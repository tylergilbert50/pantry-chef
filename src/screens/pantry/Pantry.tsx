import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Modal,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import colors from "../../theme/colors";

import { PantrySearchBar } from "../pantry/components/SearchBar";
import IngredientsCard from "../pantry/components/IngredientsCard";
import {
  EditModeBar,
  DeleteBar,
  useEditMode,
} from "../pantry/components/EditMode";
import { IngredientForm } from "../barcode/components/IngredientForm";

import {
  getIngredients,
  updateIngredient,
  deleteIngredient,
  backfillImages,
} from "../../services/ingredientService";

import { useUser } from "../../context/UserContext";
import { supabase } from "../../lib/supabase";

export function Pantry() {
  const { profile } = useUser();
  const pantryId: string | undefined = profile?.pantry_id ?? undefined;

  const [search, setSearch] = useState("");
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const openSwipeable = useRef<(() => void) | null>(null);

  const fetchIngredients = useCallback(async () => {
    if (!pantryId) return;
    const { data, error } = await getIngredients(pantryId);

    if (error || !data) {
      console.error("Fetch error:", error);
      return;
    }

    backfillImages(data, pantryId);
    setIngredients(data);
  }, [pantryId]);

  useEffect(() => {
    fetchIngredients();
  }, [fetchIngredients]);

  useFocusEffect(
    useCallback(() => {
      fetchIngredients();
    }, [fetchIngredients]),
  );

  useEffect(() => {
    if (!pantryId) return;

    const channel = supabase
      .channel(`pantry_${pantryId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "pantry_ingredients",
          filter: `pantry_id=eq.${pantryId}`,
        },
        () => {
          fetchIngredients();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pantryId, fetchIngredients]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchIngredients();
    setRefreshing(false);
  }, [fetchIngredients]);

  const editMode = useEditMode({
    pantryId,
    onDeleteComplete: fetchIngredients,
  });

  const updateQuantity = async (id: number, change: number) => {
    const current = ingredients.find((item) => item.ingredient_id === id);
    if (!current || !pantryId) return;

    const newQuantity = Math.max(1, current.quantity + change);

    setIngredients((prev) =>
      prev.map((item) =>
        item.ingredient_id === id ? { ...item, quantity: newQuantity } : item,
      ),
    );

    await updateIngredient(id, pantryId, {
      quantity: newQuantity,
    });
  };

  const setQuantity = async (id: number, value: number) => {
    if (!pantryId) return;

    const newQuantity = Math.max(1, value);

    setIngredients((prev) =>
      prev.map((item) =>
        item.ingredient_id === id ? { ...item, quantity: newQuantity } : item,
      ),
    );

    await updateIngredient(id, pantryId, {
      quantity: newQuantity,
    });
  };

  const handleDelete = async (id: number) => {
    if (!pantryId) return;

    setIngredients((prev) => prev.filter((item) => item.ingredient_id !== id));

    const { error } = await deleteIngredient(id, pantryId);

    if (error) {
      await fetchIngredients();
    }
  };

  const handleBulkDelete = async () => {
    const idsToDelete = await editMode.bulkDelete();

    if (idsToDelete) {
      setIngredients((prev) =>
        prev.filter(
          (item) => !idsToDelete.includes(String(item.ingredient_id)),
        ),
      );
    }
  };

  const handleEditDone = () => {
    setEditingItem(null);
    fetchIngredients();
  };

  const filtered = ingredients
    .filter((item) =>
      item.name_product.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.name_product.localeCompare(b.name_product, undefined, {
            sensitivity: "base",
          })
        : b.name_product.localeCompare(a.name_product, undefined, {
            sensitivity: "base",
          }),
    );

  return (
    <View style={styles.container}>
      <View style={styles.header} />

      <View style={styles.searchWrapper}>
        <PantrySearchBar
          value={search}
          onChange={setSearch}
          onFilterPress={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
        />
      </View>

      <View style={styles.topSpacer} />

      <EditModeBar
        active={editMode.active}
        isAllSelected={editMode.isAllSelected(filtered.length)}
        onEnter={editMode.enter}
        onExit={editMode.exit}
        onSelectAll={() =>
          editMode.selectAll(filtered.map((i) => String(i.ingredient_id)))
        }
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.ingredient_id)}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressViewOffset={150}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        renderItem={({ item }) => (
          <IngredientsCard
            name={item.name_product}
            unit={item.unit}
            quantity={item.quantity}
            image={item.image}
            selectMode={editMode.active}
            selected={editMode.selectedIds.has(String(item.ingredient_id))}
            onIncrease={() => updateQuantity(item.ingredient_id, 1)}
            onDecrease={() => updateQuantity(item.ingredient_id, -1)}
            onDelete={() => handleDelete(item.ingredient_id)}
            onQuantityChange={(value) => setQuantity(item.ingredient_id, value)}
            onPress={
              editMode.active
                ? () => editMode.toggle(String(item.ingredient_id))
                : () => setEditingItem(item)
            }
            onSwipeOpen={(close) => {
              openSwipeable.current?.();
              openSwipeable.current = close;
            }}
          />
        )}
      />

      {editMode.active && (
        <DeleteBar
          selectedCount={editMode.selectedIds.size}
          onBulkDelete={handleBulkDelete}
        />
      )}

      <Modal
        visible={!!editingItem}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setEditingItem(null)}
      >
        <IngredientForm
          existingIngredient={editingItem}
          onDone={handleEditDone}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    position: "absolute",
    width: 900,
    height: 900,
    borderRadius: 325,
    top: -790,
    alignSelf: "center",
    backgroundColor: colors.primary,
    zIndex: 5,
  },
  searchWrapper: {
    position: "absolute",
    top: 80,
    width: "85%",
    alignSelf: "center",
    zIndex: 10,
  },
  topSpacer: {
    height: 140,
  },
  listContent: {
    paddingBottom: 40,
  },
});
