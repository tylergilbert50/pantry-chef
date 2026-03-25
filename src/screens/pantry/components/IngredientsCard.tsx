import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  TouchableOpacity,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../theme/colors";
import QuantityStepper from "./CountStepper";

type IngredientCardProps = {
  name: string;
  quantity: number;
  unit?: string;
  itemCount: number;
  calories?: number;
  image?: string;
  selectMode?: boolean;
  selected?: boolean;

  onIncrease: () => void;
  onDecrease: () => void;
  onDelete: () => void;
  onItemCountChange: (value: number) => void;
  onPress: () => void;
  onSwipeOpen?: (close: () => void) => void;
};

export default function IngredientsCard({
  name,
  calories,
  unit,
  quantity,
  itemCount,
  image,
  selectMode = false,
  selected = false,
  onIncrease,
  onDecrease,
  onDelete,
  onItemCountChange,
  onPress,
  onSwipeOpen,
}: IngredientCardProps) {
  const swipeableRef = useRef<Swipeable>(null);

  const handleDelete = () => {
    swipeableRef.current?.close();
    onDelete();
  };

  const handleSwipeOpen = () => {
    onSwipeOpen?.(() => swipeableRef.current?.close());
  };

  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0.5],
      extrapolate: "clamp",
    });

    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={handleDelete}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[styles.deleteContent, { transform: [{ scale }] }]}
        >
          <Ionicons name="trash-outline" size={24} color={colors.white} />
          <Text style={styles.deleteText}>Delete</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const cardContent = (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {selectMode && (
        <View style={styles.checkboxContainer}>
          <Ionicons
            name={selected ? "checkmark-circle" : "ellipse-outline"}
            size={24}
            color={selected ? colors.primary : "#ccc"}
          />
        </View>
      )}

      {image ? (
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.imageFallback}>
          <Ionicons name="nutrition-outline" size={28} color="#ccc" />
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>

        {unit ? (
          <Text style={styles.subText}>
            {quantity} {unit}
          </Text>
        ) : null}

        {calories !== undefined && (
          <Text style={styles.subText}>{calories} Calories</Text>
        )}
      </View>

      {!selectMode && (
        <QuantityStepper
          quantity={itemCount}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
          onQuantityChange={onItemCountChange}
        />
      )}
    </TouchableOpacity>
  );

  if (selectMode) {
    return <View style={styles.swipeContainer}>{cardContent}</View>;
  }

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      rightThreshold={80}
      overshootRight={false}
      containerStyle={styles.swipeContainer}
      onSwipeableWillOpen={handleSwipeOpen}
    >
      {cardContent}
    </Swipeable>
  );
}

const IMAGE_SIZE = 55;

const styles = StyleSheet.create({
  swipeContainer: {
    width: "90%",
    alignSelf: "center",
    marginVertical: 8,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 20,
    shadowColor: colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  checkboxContainer: {
    marginRight: 10,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    marginRight: 12,
  },
  imageFallback: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
  },
  subText: {
    fontSize: 13,
    color: "#666",
  },
  deleteAction: {
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    width: 90,
    borderRadius: 20,
    marginLeft: 8,
  },
  deleteContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  deleteText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
});
