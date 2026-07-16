import { useTheme } from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme-types";
import Constants from "expo-constants";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, type Region } from "react-native-maps";

const DEFAULT_DELTA = 0.05;
const SEARCH_DELTA = 0.01;

const useGoogleMapsIos =
    Platform.OS === "ios" &&
    Boolean(process.env.EXPO_PUBLIC_IOS_MAPS_API_KEY) &&
    Constants.appOwnership !== "expo";

function toRegion(
    latitude: number,
    longitude: number,
    delta = DEFAULT_DELTA,
): Region {
    return {
        latitude,
        longitude,
        latitudeDelta: delta,
        longitudeDelta: delta,
    };
}

async function geocodeQuery(
    query: string,
): Promise<{ latitude: number; longitude: number } | null> {
    // Platform geocoder (Apple on iOS, Google on Android)
    try {
        const results = await Location.geocodeAsync(query);
        if (results.length > 0) {
            return {
                latitude: results[0].latitude,
                longitude: results[0].longitude,
            };
        }
    } catch {
        // Fall through to Nominatim
    }

    // Fallback when CLGeocoder / Android geocoder returns nothing
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
            {
                headers: {
                    "Accept-Language": "en",
                    "User-Agent": "car-rental-expo-app/1.0",
                },
            },
        );

        if (!response.ok) return null;

        const data: Array<{ lat: string; lon: string }> = await response.json();
        if (data.length === 0) return null;

        return {
            latitude: Number(data[0].lat),
            longitude: Number(data[0].lon),
        };
    } catch {
        return null;
    }
}

export default function LocationScreen() {
    const { colorScheme } = useTheme();
    const styles = getStyles(colorScheme);
    const mapRef = useRef<MapView>(null);

    const [userCoords, setUserCoords] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);
    const [initialRegion, setInitialRegion] = useState<Region | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState<{
        latitude: number;
        longitude: number;
        title: string;
    } | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function loadLocation() {
            try {
                const { status } =
                    await Location.requestForegroundPermissionsAsync();
                if (cancelled) return;

                if (status !== "granted") {
                    setErrorMsg("Permission to access location was denied");
                    return;
                }

                const enabled = await Location.hasServicesEnabledAsync();
                if (cancelled) return;

                if (!enabled) {
                    setErrorMsg("Location services are disabled on this device");
                    return;
                }

                let location = await Location.getLastKnownPositionAsync({
                    maxAge: 60_000,
                    requiredAccuracy: 1000,
                });

                if (!location) {
                    location = await Location.getCurrentPositionAsync({
                        accuracy: Location.Accuracy.Balanced,
                    });
                }

                if (cancelled) return;

                if (!location) {
                    setErrorMsg("Could not determine your location");
                    return;
                }

                const coords = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                };
                setUserCoords(coords);
                setInitialRegion(toRegion(coords.latitude, coords.longitude));
            } catch (error) {
                if (cancelled) return;
                const message =
                    error instanceof Error
                        ? error.message
                        : "Failed to get location";
                setErrorMsg(message);
            }
        }

        loadLocation();
        return () => {
            cancelled = true;
        };
    }, []);

    const moveMapTo = (latitude: number, longitude: number) => {
        const nextRegion = toRegion(latitude, longitude, SEARCH_DELTA);

        // animateToRegion can no-op if called in the same tick as marker updates
        requestAnimationFrame(() => {
            mapRef.current?.animateToRegion(nextRegion, 500);
        });

        // Fallback for flaky map refs on iOS Simulator / Expo Go
        setTimeout(() => {
            mapRef.current?.animateToRegion(nextRegion, 350);
            mapRef.current?.fitToCoordinates([{ latitude, longitude }], {
                edgePadding: { top: 120, right: 40, bottom: 40, left: 40 },
                animated: true,
            });
        }, 100);
    };

    const handleSearch = async (submittedText?: string) => {
        const query = (submittedText ?? search).trim();
        if (!query || isSearching) return;

        Keyboard.dismiss();
        setIsSearching(true);

        try {
            const place = await geocodeQuery(query);

            if (!place) {
                Alert.alert("No results", `Nothing found for "${query}"`);
                return;
            }

            setSearchResult({
                latitude: place.latitude,
                longitude: place.longitude,
                title: query,
            });
            moveMapTo(place.latitude, place.longitude);
        } catch (error) {
            console.error("Error searching for location:", error);
            Alert.alert("Error", "Failed to search for location");
        } finally {
            setIsSearching(false);
        }
    };

    if (errorMsg) {
        return (
            <View style={[styles.container, styles.centered]}>
                <Text style={styles.message}>{errorMsg}</Text>
            </View>
        );
    }

    if (!initialRegion || !userCoords) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color="#F9B401" />
                <Text style={[styles.message, styles.loadingText]}>
                    Finding your location…
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.searchBar} pointerEvents="box-none">
                <TextInput
                    placeholder="Search for a location"
                    placeholderTextColor={
                        colorScheme === "dark" ? "#95BCCC" : "#7a8a90"
                    }
                    value={search}
                    onChangeText={setSearch}
                    onSubmitEditing={(event) =>
                        handleSearch(event.nativeEvent.text)
                    }
                    returnKeyType="search"
                    blurOnSubmit
                    autoCorrect={false}
                    autoCapitalize="none"
                    style={styles.searchInput}
                />
                <Pressable
                    onPress={() => handleSearch()}
                    style={styles.searchButton}
                    disabled={isSearching}
                    hitSlop={8}
                >
                    {isSearching ? (
                        <ActivityIndicator color="#F9B401" />
                    ) : (
                        <Text style={styles.searchButtonText}>Go</Text>
                    )}
                </Pressable>
            </View>

            <MapView
                ref={mapRef}
                style={styles.map}
                provider={useGoogleMapsIos ? PROVIDER_GOOGLE : undefined}
                initialRegion={initialRegion}
                showsUserLocation
                showsMyLocationButton
            >
                <Marker
                    coordinate={userCoords}
                    title="You are here"
                />
                {searchResult && (
                    <Marker
                        coordinate={{
                            latitude: searchResult.latitude,
                            longitude: searchResult.longitude,
                        }}
                        title={searchResult.title}
                        pinColor="#F9B401"
                    />
                )}
            </MapView>
        </View>
    );
}

const getStyles = (theme: ThemeType) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme === "dark" ? "#121212" : "#fff",
        },
        centered: {
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 24,
        },
        map: {
            ...StyleSheet.absoluteFillObject,
        },
        message: {
            color: theme === "dark" ? "#fff" : "#121212",
            textAlign: "center",
            fontSize: 16,
        },
        loadingText: {
            marginTop: 12,
        },
        searchBar: {
            position: "absolute",
            top: 60,
            left: 24,
            right: 24,
            zIndex: 10,
            elevation: 10,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
        },
        searchInput: {
            flex: 1,
            height: 44,
            backgroundColor: theme === "dark" ? "#1e1e1e" : "#fff",
            color: theme === "dark" ? "#fff" : "#121212",
            borderRadius: 18,
            paddingHorizontal: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 4,
        },
        searchButton: {
            height: 44,
            minWidth: 52,
            paddingHorizontal: 14,
            borderRadius: 18,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme === "dark" ? "#1e1e1e" : "#fff",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 4,
        },
        searchButtonText: {
            color: "#F9B401",
            fontWeight: "700",
            fontSize: 15,
        },
    });
