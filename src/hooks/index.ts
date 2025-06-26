import { useCallback, useContext, useMemo } from "react";

import {  DatabaseContext, PrismDIDContext, ThemeContext } from "@/context";


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

export function useDatabase() {
    const context = useContext(DatabaseContext);
    if (!context) {
        throw new Error('useDatabase must be used within a DatabaseProvider');
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