import { ThemeContextValue, ThemeContextType } from "@/types/theme-types";
import { createContext, useContext, useMemo } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function useTheme(): ThemeContextType {
    const context = useContext(ThemeContext)
    const systemColorScheme = useSystemColorScheme()

    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }

    const colorScheme = useMemo((): "light" | "dark" => {
        if (context.theme === "light") return "light"
        if (context.theme === "dark") return "dark"
        return systemColorScheme === "dark" ? "dark" : "light"
    }, [context.theme, systemColorScheme])

    return { ...context, colorScheme }
}