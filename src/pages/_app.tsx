'use client';

import type { AppProps } from 'next/app';
import { Geist, Geist_Mono } from "next/font/google";
import { MeshProvider } from '@meshsdk/react';

import "../styles/globals.css";
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { RIDBDatabase } from '@trust0/ridb-react';
import { DatabaseProvider } from '@/components/providers/Database';
import { migrations, schemas } from '@trust0/identus-react/db';
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <main className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ThemeProvider>
                    <MeshProvider>
                        <RIDBDatabase schemas={schemas} migrations={migrations as any}>
                            <DatabaseProvider>
                                <Component {...pageProps} />
                            </DatabaseProvider>
                        </RIDBDatabase>
                    </MeshProvider>
                </ThemeProvider>
            </main>
        </>
    );
} 