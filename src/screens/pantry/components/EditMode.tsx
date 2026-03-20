import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../theme/colors";
import { deleteIngredient } from "../../../services/ingredientService";

interface UseEditModeOptions {
  pantryId: string | undefined;
  onDeleteComplete: () => void;
}

export function useEditMode({
  pantryId,
  onDeleteComplete,
}: UseEditModeOptions) {
  const [active, setActive] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const enter = useCallback(() => setActive(true), []);

  const exit = useCallback(() => {
    setActive(false);
    setSelectedIds(new Set());
  }, []);

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback((ids: string[]) => {
    setSelectedIds((prev) => {
      if (prev.size === ids.length) {
        return new Set();
      }
      return new Set(ids);
    });
  }, []);

  const isAllSelected = useCallback(
    (totalCount: number) => selectedIds.size === totalCount && totalCount > 0,
    [selectedIds],
  );

  const bulkDelete = useCallback(async () => {
    if (!pantryId || selectedIds.size === 0) return;

    const idsToDelete = Array.from(selectedIds);

    setSelectedIds(new Set());
    setActive(false);

    const results = await Promise.all(
      idsToDelete.map((id) => deleteIngredient(Number(id), pantryId)),
    );

    if (results.some((r) => r.error)) {
      onDeleteComplete();
    }

    return idsToDelete;
  }, [pantryId, selectedIds, onDeleteComplete]);

  return {
    active,
    selectedIds,
    enter,
    exit,
    toggle,
    selectAll,
    isAllSelected,
    bulkDelete,
  };
}

interface EditModeBarProps {
  active: boolean;
  isAllSelected: boolean;
  onEnter: () => void;
  onExit: () => void;
  onSelectAll: () => void;
}

export function EditModeBar({
  active,
  isAllSelected,
  onEnter,
  onExit,
  onSelectAll,
}: EditModeBarProps) {
  return (
    <View style={styles.toolbar}>
      {active ? (
        <>
          <TouchableOpacity onPress={onSelectAll}>
            <Text style={styles.toolbarText}>
              {isAllSelected ? "Deselect All" : "Select All"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onExit}>
            <Text style={styles.toolbarText}>Done</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View />
          <TouchableOpacity onPress={onEnter}>
            <Text style={styles.toolbarText}>Edit</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

interface DeleteBarProps {
  selectedCount: number;
  onBulkDelete: () => void;
}

export function DeleteBar({ selectedCount, onBulkDelete }: DeleteBarProps) {
  if (selectedCount === 0) return null;

  return (
    <View style={styles.deleteBarWrapper}>
      <TouchableOpacity
        style={styles.deleteBar}
        onPress={onBulkDelete}
        activeOpacity={0.8}
      >
        <Ionicons name="trash-outline" size={20} color={colors.white} />
        <Text style={styles.deleteBarText}>
          Delete {selectedCount} item{selectedCount !== 1 ? "s" : ""}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 8,
    paddingBottom: 4,
  },
  toolbarText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.primary,
  },
  deleteBarWrapper: {
    alignItems: "center",
    paddingBottom: 30,
  },
  deleteBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF3B30",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    gap: 8,
    shadowColor: colors.black,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  deleteBarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
