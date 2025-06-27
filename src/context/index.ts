import { createContext } from "react";
import SDK from "@hyperledger/identus-sdk";

export type Theme = 'dark' | 'light';
export type ThemeContextType = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

export const PrismDIDContext = createContext<{
    did: SDK.Domain.DID | null;
    setDID: (did: string) => void;
} | undefined>(undefined);

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const RouterContext = createContext<{
    redirectUrl: string | null;
    setRedirectUrl: (url: string | null) => void;
} | undefined>(undefined);

