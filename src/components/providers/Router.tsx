import React, { useState } from "react";
import { RouterContext } from "@/context";

export function RouterProvider({ children }: { children: React.ReactNode }) {
    const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
    return <RouterContext.Provider value={{ redirectUrl, setRedirectUrl }}> {children} </RouterContext.Provider>
}