/** @type {import('expo/config').ExpoConfig} */
const config = {
  name: "car-rental",
  slug: "car-rental",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "carrental",
  userInterfaceStyle: "automatic",
  ios: {
    icon: "./assets/expo.icon",
    supportsTablet: true,
    bundleIdentifier: "com.azerkazimov.carrental",
    config: {
      googleMapsApiKey: process.env.EXPO_PUBLIC_IOS_MAPS_API_KEY,
    },
  },
  android: {
    package: "com.azerkazimov.carrental",
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#208AEF",
        android: {
          image: "./assets/images/splash-icon.png",
          imageWidth: 76,
        },
      },
    ],
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission:
          "Allow $(PRODUCT_NAME) to use your location.",
      },
    ],
    [
      "react-native-maps",
      {
        iosGoogleMapsApiKey: process.env.EXPO_PUBLIC_IOS_MAPS_API_KEY,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

module.exports = config;
