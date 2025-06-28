import { useEffect, useState } from "react";
import { getServerSideProps } from "next";
import { BLOCKFROST_KEY_NAME, PRISM_RESOLVER_URL_KEY, FEATURES, MEDIATOR_DID } from "@/config";
import { useDatabase } from "@trust0/identus-react/hooks";
import { ThemeToggle } from "@/components/ThemeToggle";
import withLayout from "@/components/withLayout";
import { getLayoutProps } from "@/components/withLayout";
interface PageProps {
    serverBlockfrostKey: string | null;
    serverMediatorDID: string | null;
    serverResolverUrl: string | null;
    isBlockfrostManaged: boolean;
    isMediatorManaged: boolean;
    isResolverManaged: boolean;
}

function SettingsPage({ 
    serverBlockfrostKey, 
    serverMediatorDID, 
    serverResolverUrl,
    isBlockfrostManaged,
    isMediatorManaged,
    isResolverManaged 
}: PageProps) {
    const { 
        state: dbState, 
        getFeatures, 
        getSettingsByKey, 
        storeSettingsByKey,
    } = useDatabase();
    const [blockfrostKey, setBlockfrostKey] = useState("");
    const [resolverUrl, setResolverUrl] = useState("");
    const [mediatorDID, setMediatorDID] = useState("");
    const [features, setFeatures] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ success: boolean, message: string } | null>(null);

    useEffect(() => {
        async function load() {
            if (dbState === "loaded") {
                // Always prioritize server values and overwrite database if they exist
                if (serverBlockfrostKey) {
                    setBlockfrostKey(serverBlockfrostKey);
                    // Overwrite database value with server value
                    if (!isBlockfrostManaged) {
                        await storeSettingsByKey(BLOCKFROST_KEY_NAME, serverBlockfrostKey);
                    }
                } else {
                    const blockfrost = await getSettingsByKey(BLOCKFROST_KEY_NAME);
                    if (blockfrost) {
                        setBlockfrostKey(blockfrost);
                    }
                }

                if (serverMediatorDID) {
                    setMediatorDID(serverMediatorDID);
                    // Overwrite database value with server value
                    if (!isMediatorManaged) {
                        await storeSettingsByKey(MEDIATOR_DID, serverMediatorDID);
                    }
                } else {
                    const mediatorDID = await getSettingsByKey(MEDIATOR_DID);
                    if (mediatorDID) {
                        setMediatorDID(mediatorDID);
                    }
                }

                if (serverResolverUrl) {
                    setResolverUrl(serverResolverUrl);
                    // Overwrite database value with server value
                    if (!isResolverManaged) {
                        await storeSettingsByKey(PRISM_RESOLVER_URL_KEY, serverResolverUrl);
                    }
                } else {
                    const prism = await getSettingsByKey(PRISM_RESOLVER_URL_KEY);
                    if (prism) {
                        setResolverUrl(prism);
                    }
                }
            }
        }
        load();
    }, [dbState, getSettingsByKey, storeSettingsByKey, serverBlockfrostKey, serverMediatorDID, serverResolverUrl, isBlockfrostManaged, isMediatorManaged, isResolverManaged]);

    const handleSaveAll = async () => {
        setLoading(true);
        try {
            const promises = [];
            
            // Only save non-managed settings to database
            if (!isBlockfrostManaged) {
                promises.push(storeSettingsByKey(BLOCKFROST_KEY_NAME, blockfrostKey));
            }
            if (!isMediatorManaged) {
                promises.push(storeSettingsByKey(MEDIATOR_DID, mediatorDID));
            }
            if (!isResolverManaged) {
                promises.push(storeSettingsByKey(PRISM_RESOLVER_URL_KEY, resolverUrl));
            }
            
            // Features are always user-managed for now
            promises.push(storeSettingsByKey(FEATURES, features.join(",")));

            await Promise.all(promises);
            await getFeatures();
            
            const managedCount = [isBlockfrostManaged, isMediatorManaged, isResolverManaged].filter(Boolean).length;
            const savedMessage = managedCount > 0 
                ? `Settings successfully saved (${managedCount} settings are server-managed)`
                : "All settings successfully saved";
                
            setResult({
                success: true,
                message: savedMessage
            });
        } catch (error) {
            setResult({
                success: false,
                message: error instanceof Error ? error.message : "Unknown error occurred"
            });
        } finally {
            setLoading(false);
        }
    };

    const hasUserManageableSettings = !isBlockfrostManaged || !isMediatorManaged || !isResolverManaged;

    return (
        <div className="space-y-6">
            <div className="bg-background-light dark:bg-background-dark shadow-sm rounded-lg p-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Theme
                        </label>
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Toggle between light and dark mode
                            </p>
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="blockfrostKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Blockfrost API Key
                            {isBlockfrostManaged && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                    Server Managed
                                </span>
                            )}
                            {!isBlockfrostManaged && serverBlockfrostKey && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                    Auto-synced from Environment
                                </span>
                            )}
                        </label>
                        <div className="mt-1 flex gap-4">
                            {isBlockfrostManaged ? (
                                <div className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-500 dark:text-gray-400">
                                    Managed value (configured via environment variable)
                                </div>
                            ) : (
                                <input
                                    type="password"
                                    id="blockfrostKey"
                                    value={blockfrostKey}
                                    onChange={(e) => setBlockfrostKey(e.target.value)}
                                    placeholder="Enter your Blockfrost API key"
                                    className="flex-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            )}
                        </div>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            This API key is required for interacting with the Cardano blockchain.
                            {!isBlockfrostManaged && serverBlockfrostKey && (
                                <span className="block mt-1 text-blue-600 dark:text-blue-400 text-xs">
                                    Environment variable detected and automatically synchronized to database.
                                </span>
                            )}
                        </p>
                    </div>
                    
                    <div>
                        <label htmlFor="mediatorDID" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Mediator DID
                            {isMediatorManaged && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                    Server Managed
                                </span>
                            )}
                            {!isMediatorManaged && serverMediatorDID && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                    Auto-synced from Environment
                                </span>
                            )}
                        </label>
                        <div className="mt-1 flex gap-4">
                            {isMediatorManaged ? (
                                <div className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-500 dark:text-gray-400">
                                    Managed value (configured via environment variable)
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    id="mediatorDID"
                                    value={mediatorDID}
                                    onChange={(e) => setMediatorDID(e.target.value)}
                                    placeholder="Enter the Mediator DID"
                                    className="flex-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            )}
                        </div>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            This DID is required for mediator connections.
                            {!isMediatorManaged && serverMediatorDID && (
                                <span className="block mt-1 text-blue-600 dark:text-blue-400 text-xs">
                                    Environment variable detected and automatically synchronized to database.
                                </span>
                            )}
                        </p>
                    </div>
                    
                    <div>
                        <label htmlFor="resolverUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            PRISM DID Resolver URL
                            {isResolverManaged && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                    Server Managed
                                </span>
                            )}
                            {!isResolverManaged && serverResolverUrl && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                    Auto-synced from Environment
                                </span>
                            )}
                        </label>
                        <div className="mt-1 flex gap-4">
                            {isResolverManaged ? (
                                <div className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-500 dark:text-gray-400">
                                    Managed value (configured via environment variable)
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    id="resolverUrl"
                                    value={resolverUrl}
                                    onChange={(e) => setResolverUrl(e.target.value)}
                                    placeholder="Enter the PRISM DID resolver URL"
                                    className="flex-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            )}
                        </div>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            This URL is required for resolving PRISM DIDs.
                            {!isResolverManaged && serverResolverUrl && (
                                <span className="block mt-1 text-blue-600 dark:text-blue-400 text-xs">
                                    Environment variable detected and automatically synchronized to database.
                                </span>
                            )}
                        </p>
                    </div>
                    
                    {hasUserManageableSettings && (
                        <div className="flex justify-end">
                            <button
                                onClick={handleSaveAll}
                                disabled={loading}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Saving..." : "Save Settings"}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {result && (
                <div className={`mt-4 p-4 rounded-md ${result.success ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400'}`}>
                    <p>{result.message}</p>
                </div>
            )}
        </div>
    );
}



export const getServerSideProps = getLayoutProps;
// Create a properly typed wrapped component
const WrappedSettingsPage = withLayout(SettingsPage as any, {
    title: "Settings",
    description: "Configure your agent settings for blockchain interactions and DID resolution",
    pageHeader: true
});

// Export the wrapped component
export default WrappedSettingsPage; 