import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BrowserWallet, Wallet } from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";
import { WALLET_NAME } from "@/config";
import { useDatabase } from "@trust0/identus-react/hooks";
import Image from "next/image";

export default function SelectWallet({ onSelected, onCancel }: { onSelected: (wallet: Wallet) => void; onCancel?: () => void }) {
    const { db, wallet: selectedWallet, storeSettingsByKey } = useDatabase();
    const { connect } = useWallet();
    const [availableWallets, setAvailableWallets] = useState<Wallet[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        BrowserWallet.getAvailableWallets().then((foundWallets) => {
            console.log("Found wallets:", foundWallets);
            setAvailableWallets(foundWallets);
        }).catch(err => {
            console.error("Error loading wallets:", err);
            setError(err.message || "Failed to load wallets");
        });
    }, []);

    const modalContent = (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm overflow-y-auto flex items-center justify-center p-4" style={{ zIndex: 9999 }}
             onClick={(e) => {
                 if (e.target === e.currentTarget && onCancel) {
                     onCancel();
                 }
             }}>
            <div className="bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] border border-gray-200 dark:border-gray-800 flex flex-col">
                {/* Header - Fixed */}
                <div className="flex-shrink-0 p-6 pb-4">
                    <div className="flex justify-between items-start mb-2">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Connect to a Cardano Wallet</h1>
                        {onCancel && (
                            <button
                                onClick={onCancel}
                                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                aria-label="Close modal"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Please select a wallet to continue
                    </p>
                    {error && (
                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg">
                            <p>Error loading wallets: {error}</p>
                        </div>
                    )}
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto px-6 pb-6">
                    {availableWallets.length === 0 ? (
                        <div className="py-6 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 dark:border-teal-400 mx-auto mb-4"></div>
                            <p className="text-gray-800 dark:text-white">Loading wallets...</p>
                            <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                                Make sure you have a compatible Cardano wallet extension installed
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {availableWallets.map((foundWallet: Wallet) => (
                                <button
                                    key={foundWallet.name}
                                    className={`w-full flex items-center px-4 py-3 text-sm rounded-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:shadow-lg ${
                                        selectedWallet === foundWallet.name 
                                            ? 'bg-gradient-to-r from-teal-50 to-green-50 dark:from-teal-900/30 dark:to-green-900/30 border-teal-200 dark:border-teal-800' 
                                            : ''
                                    }`}
                                    onClick={async () => {
                                        try {
                                            connect(foundWallet.name);
                                            await storeSettingsByKey(WALLET_NAME, foundWallet.name);
                                            onSelected(foundWallet);
                                        } catch (err: any) {
                                            console.error("Error connecting wallet:", err);
                                            setError(`Error connecting wallet: ${err.message}`);
                                        }
                                    }}
                                >
                                    <Image
                                        src={foundWallet.icon}
                                        alt={foundWallet.name}
                                        className="w-8 h-8 mr-4 flex-shrink-0"
                                        width={32}
                                        height={32}
                                    />
                                    <span className="text-base font-medium text-gray-800 dark:text-white truncate">
                                        {foundWallet.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    // Only render portal on client side to avoid hydration issues
    if (!mounted) return null;
    
    return createPortal(modalContent, document.body);
}