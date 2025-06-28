import { useEffect, useState } from "react";
import { BrowserWallet, Wallet } from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";
import { WALLET_NAME } from "@/config";
import { useDatabase } from "@trust0/identus-react/hooks";
import Image from "next/image";

export default function SelectWallet({ onSelected }: { onSelected: (wallet: Wallet) => void }) {
    const { db, wallet: selectedWallet, storeSettingsByKey } = useDatabase();
    const { connect } = useWallet();
    const [availableWallets, setAvailableWallets] = useState<Wallet[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        BrowserWallet.getAvailableWallets().then((foundWallets) => {
            console.log("Found wallets:", foundWallets);
            setAvailableWallets(foundWallets);
        }).catch(err => {
            console.error("Error loading wallets:", err);
            setError(err.message || "Failed to load wallets");
        });
    }, []);

    return <div className="fixed inset-0 z-[9999] bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg overflow-y-auto flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
        <div className="bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-gray-200 dark:border-gray-800">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Connect to a Cardano Wallet</h1>
            <p className="text-gray-600 dark:text-gray-400 my-5">
                Please select a wallet to continue
            </p>
            {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg">
                    <p>Error loading wallets: {error}</p>
                </div>
            )}

            {availableWallets.length === 0 ? (
                <div className="py-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 dark:border-teal-400 mx-auto mb-4"></div>
                    <p className="text-gray-800 dark:text-white">Loading wallets...</p>
                    <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                        Make sure you have a compatible Cardano wallet extension installed
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableWallets.map((foundWallet: Wallet) => (
                        <button
                            key={foundWallet.name}
                            className={`w-full flex items-center px-4 py-3 text-sm rounded-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:shadow-lg ${selectedWallet === foundWallet.name ? 'bg-gradient-to-r from-teal-50 to-green-50 dark:from-teal-900/30 dark:to-green-900/30 border-teal-200 dark:border-teal-800' : ''
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
                                className="w-8 h-8 mr-4"
                                width={24}
                                height={24}
                            />
                            <span className="text-lg font-medium text-gray-800 dark:text-white">
                                {foundWallet.name}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    </div>
}