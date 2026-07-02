export type ThemeType = "light" | "dark" | "system"

export type ThemeContextValue = {
    theme: ThemeType,
    toggleTheme: (theme: ThemeType) => void,
}

export type ThemeContextType = ThemeContextValue & {
    colorScheme: "light" | "dark",
}