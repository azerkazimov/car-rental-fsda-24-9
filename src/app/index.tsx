import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { layoutTheme } from "../../constants/theme";
import { useRouter } from "expo-router";

function TiiraLogo() {
  return (
    <View style={styles.logoRow}>
      <Text style={styles.logoLetter}>T</Text>
      <View style={styles.logoBars}>
        <View style={[styles.logoBar, styles.logoBarLight]} />
        <View style={[styles.logoBar, styles.logoBarDark]} />
      </View>
      <Text style={styles.logoLetter}>R</Text>
      <Text style={styles.logoLetter}>A</Text>
    </View>
  );
}

export default function Index() {
  const insets = useSafeAreaInsets();
  const router = useRouter()

  return (
    <View style={styles.launchScreen}>
      <StatusBar style="light" />

      <Image
        source={require("@/assets/images/bmw.png")}
        style={styles.background}
        contentFit="cover"
      />

      <View
        style={[
          styles.content,
          { paddingTop: insets.top, paddingBottom: insets.bottom + 24 },
        ]}
      >
        <View style={styles.logoSection}>
          <TiiraLogo />
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.taglineBlock}>
            <View style={styles.accentLine} />
            <Text style={styles.tagline}>
              Rent your dream car{"\n"}from the Best Company
            </Text>
          </View>

          <Pressable
            onPress={() => {
              router.push("/signin/page");
            }}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>Get Started &gt;</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  launchScreen: {
    flex: 1,
    backgroundColor: "#000",
  },
  background: {
    ...StyleSheet.absoluteFill,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  logoSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 48,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  logoLetter: {
    fontFamily: layoutTheme.fonts.iceberg.regular,
    color: "#FFFFFF",
    fontSize: 52,
    letterSpacing: 2,
  },
  logoBars: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginHorizontal: 2,
  },
  logoBar: {
    width: 5,
    height: 44,
    borderRadius: 1,
  },
  logoBarLight: {
    backgroundColor: "#8FA4B3",
  },
  logoBarDark: {
    backgroundColor: "#4A6570",
  },
  bottomSection: {
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 36,
  },
  taglineBlock: {
    width: "100%",
    maxWidth: 340,
    alignItems: "flex-start",
  },
  accentLine: {
    width: 56,
    height: 5,
    backgroundColor: "#3D4F58",
    marginBottom: 20,
    borderRadius: 2,
  },
  tagline: {
    width: "100%",
    fontFamily: layoutTheme.fonts.hind.bold,
    color: "#FFFFFF",
    fontSize: 28,
    lineHeight: 38,
    textAlign: "center",
  },
  button: {
    minWidth: 260,
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 50,
    backgroundColor: "#C44E4E",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: Platform.select({
      ios: "Courier",
      android: "monospace",
      default: "monospace",
    }),
    letterSpacing: 0.5,
  },
});
