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
import QuantityStepper from "./QuantityStepper";

type IngredientCardProps = {
  name: string;
  quantity: number;
  amount?: string;
  calories?: number;
  image?: string;

  onIncrease: () => void;
  onDecrease: () => void;
  onDelete: () => void;
  onQuantityChange: (value: number) => void;
  onPress: () => void;
};

export default function IngredientsCard({
  name,
  calories,
  amount,
  quantity,
  image,
  onIncrease,
  onDecrease,
  onDelete,
  onQuantityChange,
  onPress,
}: IngredientCardProps) {
  const swipeableRef = useRef<Swipeable>(null);

  const handleDelete = () => {
    swipeableRef.current?.close();
    onDelete();
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

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      rightThreshold={80}
      overshootRight={false}
      containerStyle={styles.swipeContainer}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.7}
      >
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

          {calories !== undefined && (
            <Text style={styles.subText}>{calories} Calories</Text>
          )}

          {amount && <Text style={styles.subText}>{amount}</Text>}
        </View>

        <QuantityStepper
          quantity={quantity}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
          onQuantityChange={onQuantityChange}
        />
      </TouchableOpacity>
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
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    marginRight: 12,
    marginLeft: 4,
  },
  imageFallback: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    marginRight: 12,
    marginLeft: 4,
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
