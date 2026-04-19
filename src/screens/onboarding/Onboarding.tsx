import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  AppState,
  Image,
  TextInput,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../lib/supabase";
import colors from "../../theme/colors";
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get("window");

const STORAGE_KEY = "onboarding_in_progress";

type Slide = {
  id: string;
  title: string;
  subtitle: string;
  message: string;
  secondMessage?: string;
  image?: any;
  hasNameInput?: boolean;
};

const slides: Slide[] = [
  {
    id: "1",
    title: "PantryChef",
    subtitle: "Cook what you own. Save what you earn.",
    message:
      "29% of food produced in the U.S. goes unsold or uneaten annually",
    secondMessage: "\nThat’s over 70 million tons of food each year",
    image: require("@assets/images/onboarding/trash-can-animation.json"),
  },
  {
    id: "2",
    title: "PantryChef",
    subtitle: "Cook what you own. Save what you earn.",
    message:
      "By throwing away less food, your\n household can save $52 per week.",
    secondMessage: "That's over $2,500 a year.\n ",
    image: require("@assets/images/onboarding/piggy-bank-animation.json"),
  },
  {
    id: "3",
    title: "PantryChef",
    subtitle: "Cook what you own. Save what you earn.",
    message:
      "Let’s save together! PantryChef will\n help you accomplish a less\n wasteful world.",
    hasNameInput: true,
  },
];

export function PingPongLottie({ source }: { source: any }) {
    const animationRef = useRef<LottieView>(null);
    const [forward, setForward] = useState(true);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (animationRef === null) return;
        if (forward) {
            animationRef.current?.play(0, 150); // Forward
        } else {
            animationRef.current?.play(150, 0); // Backward
        }
    }, [forward]);
    const handleFinish = () => {
        // Clear the existing timeout before setting a new timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (forward) {
            setForward(!forward);
            return;
        }

        timeoutRef.current = setTimeout(() => {
            setForward((prev) => {
                return !prev;
            });
        }, 1000);
    };
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);
    return (
        <LottieView
            ref={animationRef}
            source={source}
            loop={false}
            onAnimationFinish={handleFinish}
            style={{ width: 400, height: 400 }}
        />
    );
}

export const Onboarding = ({ onFinish }: { onFinish: () => void }) => {
  const flatListRef = useRef<FlatList>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSecondMessage, setShowSecondMessage] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const isLastSlide = currentIndex === slides.length - 1;
  const currentSlide = slides[currentIndex];

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, "true");
  }, []);

  useEffect(() => {
    const checkOnboardingState = async () => {
      const inProgress = await AsyncStorage.getItem(STORAGE_KEY);

      if (inProgress === "true") {
        await AsyncStorage.removeItem(STORAGE_KEY);
        setCurrentIndex(0);
      }

      await AsyncStorage.setItem(STORAGE_KEY, "true");
    };

    checkOnboardingState();
  }, []);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
    setShowSecondMessage(false);
    fadeAnim.setValue(0);
  };

  const triggerCrossfade = () => {
    setShowSecondMessage(true);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 650,
      useNativeDriver: true,
    }).start();
  };

  const handleNext = async () => {
    if (currentSlide.secondMessage && !showSecondMessage) {
      triggerCrossfade();
      return;
    }

    if (isLastSlide) {
      const newErrors = {
        firstName: !firstName.trim(),
        lastName: !lastName.trim(),
      };
      setErrors(newErrors);
      if (Object.values(newErrors).some(Boolean)) return;

      setSaving(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user?.id) {
        const { error } = await supabase
          .from("users")
          .update({
            first_name: firstName.trim(),
            last_name: lastName.trim(),
          })
          .eq("user_id", session.user.id);

        if (error) {
          console.error("Error saving name:", error.message);
          setSaving(false);
          return;
        }
      }

      await AsyncStorage.removeItem(STORAGE_KEY);
      setSaving(false);
      onFinish();
    } else {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const renderContent = (item: Slide, isActive: boolean) => (
    <>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>

      {item.hasNameInput ? (
        <View style={styles.nameInputContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              First Name{" "}
              {errors.firstName && <Text style={styles.error}>*</Text>}
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                value={firstName}
                onChangeText={(text) => {
                  setFirstName(text);
                  if (errors.firstName)
                    setErrors((e) => ({ ...e, firstName: false }));
                }}
                placeholder="First Name"
                placeholderTextColor="#999"
                autoCapitalize="words"
                style={styles.textInput}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Last Name {errors.lastName && <Text style={styles.error}>*</Text>}
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                value={lastName}
                onChangeText={(text) => {
                  setLastName(text);
                  if (errors.lastName)
                    setErrors((e) => ({ ...e, lastName: false }));
                }}
                placeholder="Last Name"
                placeholderTextColor="#999"
                autoCapitalize="words"
                style={styles.textInput}
              />
            </View>
          </View>
        </View>
      ) : item.id==="1" ? (
          <View style={styles.imageContainer}>
            <PingPongLottie source={item.image}/>
          </View>
      ) : item.id==="2" ? (
        <View style={styles.imageContainer}>
          <LottieView
            source={item.image}
            style={{width: 400, height: 400}} 
            autoPlay={true}
            loop
          />
        </View>
      ) : (
          <View style={styles.imageContainer}>
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
      )}

      <View style={styles.messageContainer}>
        <Animated.Text
          style={[
            styles.message,
            {
              opacity: isActive
                ? fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0],
                  })
                : 1,
            },
          ]}
        >
          {item.message}
        </Animated.Text>

        {item.secondMessage && (
          <Animated.Text
            style={[
              styles.message,
              styles.absoluteMessage,
              { opacity: isActive ? fadeAnim : 0 },
            ]}
          >
            {item.secondMessage}
          </Animated.Text>
        )}
      </View>
    </>
  );

  const renderSlide = ({ item, index }: { item: Slide; index: number }) => {
    const isActive = index === currentIndex;
    const isSlideThree = item.id === "3";
    const isSlideOne = item.id === "1";

    if (isSlideThree) {
      return (
        <ImageBackground
          source={require("../../../assets/images/sign-in/background-image-silhouette.png")}
          style={styles.slide}
          resizeMode="cover"
        >
          {renderContent(item, isActive)}
        </ImageBackground>
      );
    }

    return <View style={styles.slide}>{renderContent(item, isActive)}</View>;
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        extraData={[showSecondMessage, errors, firstName, lastName]}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[styles.nextButton, saving && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={saving}
        >
          <Text style={styles.nextButtonText}>
            {saving ? "Saving..." : isLastSlide ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>

        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  slide: {
    width,
    flex: 1,
    alignItems: "center",
    paddingTop: height * 0.08,
    paddingHorizontal: 30,
  },
  title: {
    fontFamily: "InriaSerif_700Bold",
    fontSize: 48,
    color: colors.white,
  },
  subtitle: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 17,
    color: colors.white,
    textAlign: "center",
    letterSpacing: -0.85,
    marginTop: 5,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: width,
    height: width,
  },
  nameInputContainer: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },
  textInput: {
    padding: 14,
    fontSize: 16,
    color: colors.black,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.white,
    marginBottom: 6,
  },
  error: {
    color: "#FF3B30",
    fontWeight: "700",
  },
  messageContainer: {
    position: "relative",
    width: "100%",
    alignItems: "center",
    marginBottom: height * 0.23,
  },
  message: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 18,
    color: colors.white,
    textAlign: "center",
  },
  absoluteMessage: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  bottomSection: {
    position: "absolute",
    bottom: 0,
    alignItems: "center",
    width: "100%",
    paddingBottom: height * 0.05,
  },
  nextButton: {
    backgroundColor: colors.secondary,
    borderRadius: 30,
    paddingVertical: 16,
    width: width - 60,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    fontSize: 19,
    color: colors.white,
    fontWeight: "600",
  },
  dotsContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  dotActive: {
    backgroundColor: colors.white,
  },
  dotInactive: {
    backgroundColor: "rgba(255,255,255,0.4)",
  },
});
