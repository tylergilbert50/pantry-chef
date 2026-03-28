import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../../../theme/colors";

export function PreferencesCard() {
  const [selectedDiet, setSelectedDiet] = useState<string[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);

  const toggle = (value: string, list: string[], setList: any) => {
    if (list.includes(value)) {
      setList(list.filter((v: string) => v !== value));
    } else {
      setList([...list, value]);
    }
  };

  const dietOptions = ["Vegetarian", "Vegan", "Gluten Free", "Keto", "Paleo"];
  const allergyOptions = ["Dairy", "Eggs", "Peanuts", "Shellfish", "Soy"];

  return (
    <View style={styles.card}>
      <Text style={styles.subTitle}>Dietary</Text>
      <View style={styles.chipContainer}>
        {dietOptions.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => {
              console.log("Diet pressed:", item);
              toggle(item, selectedDiet, setSelectedDiet);
            }}
            style={[
              styles.chip,
              selectedDiet.includes(item) && styles.chipActive,
            ]}
          >
            <Text
              style={[
                styles.chipText,
                selectedDiet.includes(item) && styles.chipTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.subTitle}>Allergies</Text>
      <View style={styles.chipContainer}>
        {allergyOptions.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => {
              console.log("Allergy pressed:", item);
              toggle(item, selectedAllergies, setSelectedAllergies);
            }}
            style={[
              styles.chip,
              selectedAllergies.includes(item) && styles.chipActive,
            ]}
          >
            <Text
              style={[
                styles.chipText,
                selectedAllergies.includes(item) && styles.chipTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => {
          console.log("Save pressed:", {
            diet: selectedDiet,
            allergies: selectedAllergies,
          });
        }}
      >
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "90%",
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: colors.black,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  chip: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    color: colors.black,
  },
  chipTextActive: {
    color: colors.white,
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
