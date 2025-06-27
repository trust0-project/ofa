import { useCallback, useContext } from "react";

import { PrismDIDContext, RouterContext, ThemeContext } from "@/context";
import { useDatabase } from "@trust0/identus-react/hooks";


export function usePrismDID() {
    const context = useContext(PrismDIDContext);
    if (!context) {
        throw new Error('usePrismDID must be used within a PrismDIDProvider');
    }
    return context;
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

export function useRouter() {
    const context = useContext(RouterContext);
    if (context === undefined) {
        throw new Error('useRouter must be used within a RouterProvider');
    }
    return context;
}


export function usePermissions() {
    const { features } = useDatabase();
    const hasPermission = useCallback((feature: string): boolean => {
        return features.includes(feature);
    }, [features]);
    return {
        hasPermission
    };
} 