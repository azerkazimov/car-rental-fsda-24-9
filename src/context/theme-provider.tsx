import { ThemeContext } from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme-types";
import { useState } from "react";


interface ThemeProviderProps {
    children: React.ReactNode
}

export default function ThemeProvider({ children }: ThemeProviderProps) {

    const [appTheme, setAppTheme] = useState<ThemeType>("system")

    const toggleTheme = (theme: ThemeType) => {
        setAppTheme(theme)
    }

    return (
        <ThemeContext.Provider value={{
            theme: appTheme,
            toggleTheme: toggleTheme,
        }}>
            {children}
        </ThemeContext.Provider>
    )
}