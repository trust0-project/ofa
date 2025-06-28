import { useEffect, useState } from "react";
import { BLOCKFROST_KEY_NAME, PRISM_RESOLVER_URL_KEY, FEATURES, MEDIATOR_DID } from "@/config";
import { useDatabase, usePluto } from "@trust0/identus-react/hooks";
import { ThemeToggle } from "@/components/ThemeToggle";
import withLayout from "@/components/withLayout";
import { getLayoutProps } from "@/components/withLayout";
import { 
    Settings, 
    Key, 
    Globe, 
    Shield, 
    Save, 
    CheckCircle, 
    AlertCircle,
    Server,
    RefreshCw,
    Eye,
    EyeOff,
    Upload
} from "lucide-react";

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
    const [showBlockfrostKey, setShowBlockfrostKey] = useState(false);
    const [restoreLoading, setRestoreLoading] = useState(false);
    const [restoreResult, setRestoreResult] = useState<{ success: boolean, message: string } | null>(null);
    const pluto = usePluto();
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
        setResult(null);
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

    const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setRestoreLoading(true);
        setRestoreResult(null);

        try {
            // Read the file content
            const fileContent = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.onerror = () => reject(new Error('Failed to read file'));
                reader.readAsText(file);
            });

            // Parse the JSON backup data
            const backupData = JSON.parse(fileContent);

            // Restore the backup using pluto
            await pluto.restore(backupData);

            setRestoreResult({
                success: true,
                message: 'Backup successfully restored! Please refresh the page to see the changes.'
            });

            // Clear the file input
            event.target.value = '';
        } catch (error) {
            setRestoreResult({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to restore backup'
            });
        } finally {
            setRestoreLoading(false);
        }
    };

    const hasUserManageableSettings = !isBlockfrostManaged || !isMediatorManaged || !isResolverManaged;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="space-y-6">
                {/* Theme Settings */}
                <div className="bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-lg flex items-center justify-center">
                            <Settings className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Theme Preferences</h3>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl">
                        <div>
                            <label className="block text-sm font-medium text-gray-800 dark:text-white mb-1">
                                Appearance
                            </label>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Choose between light and dark mode
                            </p>
                        </div>
                        <ThemeToggle />
                    </div>
                </div>

                {/* API Configuration */}
                <div className="bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 rounded-lg flex items-center justify-center">
                            <Key className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Blockchain Configuration</h3>
                    </div>
                    
                    <div className="space-y-6">
                        {/* Blockfrost API Key */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <label htmlFor="blockfrostKey" className="block text-sm font-medium text-gray-800 dark:text-white">
                                    Blockfrost API Key
                                </label>
                                {isBlockfrostManaged && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                        <Server className="w-3 h-3" />
                                        Server Managed
                                    </span>
                                )}
                                {!isBlockfrostManaged && serverBlockfrostKey && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
                                        <RefreshCw className="w-3 h-3" />
                                        Auto-synced
                                    </span>
                                )}
                            </div>
                            
                            {isBlockfrostManaged ? (
                                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                                    <Shield className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-600 dark:text-gray-400">
                                        Managed value (configured via environment variable)
                                    </span>
                                </div>
                            ) : (
                                <div className="relative">
                                    <input
                                        type={showBlockfrostKey ? "text" : "password"}
                                        id="blockfrostKey"
                                        value={blockfrostKey}
                                        onChange={(e) => setBlockfrostKey(e.target.value)}
                                        placeholder="Enter your Blockfrost API key"
                                        className="w-full px-4 py-3 pr-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowBlockfrostKey(!showBlockfrostKey)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    >
                                        {showBlockfrostKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            )}
                            
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Required for interacting with the Cardano blockchain through Blockfrost services.
                                {!isBlockfrostManaged && serverBlockfrostKey && (
                                    <span className="block mt-1 text-blue-600 dark:text-blue-400">
                                        Environment variable detected and automatically synchronized.
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* DID Configuration */}
                <div className="bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-br from-teal-100 to-green-100 dark:from-teal-900/50 dark:to-green-900/50 rounded-lg flex items-center justify-center">
                            <Shield className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Identity Configuration</h3>
                    </div>
                    
                    <div className="space-y-6">
                        {/* Mediator DID */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <label htmlFor="mediatorDID" className="block text-sm font-medium text-gray-800 dark:text-white">
                                    Mediator DID
                                </label>
                                {isMediatorManaged && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                        <Server className="w-3 h-3" />
                                        Server Managed
                                    </span>
                                )}
                                {!isMediatorManaged && serverMediatorDID && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
                                        <RefreshCw className="w-3 h-3" />
                                        Auto-synced
                                    </span>
                                )}
                            </div>
                            
                            {isMediatorManaged ? (
                                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                                    <Shield className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-600 dark:text-gray-400">
                                        Managed value (configured via environment variable)
                                    </span>
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    id="mediatorDID"
                                    value={mediatorDID}
                                    onChange={(e) => setMediatorDID(e.target.value)}
                                    placeholder="Enter the Mediator DID"
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                                />
                            )}
                            
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Required for establishing mediator connections in DIDComm protocols.
                                {!isMediatorManaged && serverMediatorDID && (
                                    <span className="block mt-1 text-blue-600 dark:text-blue-400">
                                        Environment variable detected and automatically synchronized.
                                    </span>
                                )}
                            </p>
                        </div>

                        {/* Resolver URL */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <label htmlFor="resolverUrl" className="block text-sm font-medium text-gray-800 dark:text-white">
                                    PRISM DID Resolver URL
                                </label>
                                {isResolverManaged && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                        <Server className="w-3 h-3" />
                                        Server Managed
                                    </span>
                                )}
                                {!isResolverManaged && serverResolverUrl && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
                                        <RefreshCw className="w-3 h-3" />
                                        Auto-synced
                                    </span>
                                )}
                            </div>
                            
                            {isResolverManaged ? (
                                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                                    <Globe className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-600 dark:text-gray-400">
                                        Managed value (configured via environment variable)
                                    </span>
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    id="resolverUrl"
                                    value={resolverUrl}
                                    onChange={(e) => setResolverUrl(e.target.value)}
                                    placeholder="Enter the PRISM DID resolver URL"
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                                />
                            )}
                            
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Required for resolving PRISM decentralized identifiers.
                                {!isResolverManaged && serverResolverUrl && (
                                    <span className="block mt-1 text-blue-600 dark:text-blue-400">
                                        Environment variable detected and automatically synchronized.
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-lg flex items-center justify-center">
                            <Settings className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Backup & Restore</h3>
                    </div>
                    
                    <div className="space-y-6">
                        {/* Export Backup */}
                        <div className="p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl">
                            <label className="block text-sm font-medium text-gray-800 dark:text-white mb-3">
                                Export Backup
                            </label>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Export encrypted JWE backup of the Agent data (not application). You will be required to restore it in an agent with the same seed imported.
                            </p>
                            <button
                                onClick={async () => {
                                    try {
                                        const backup = await pluto.backup();
                                        
                                        // Convert JSON object to string
                                        const backupString = JSON.stringify(backup, null, 2);
                                        
                                        // Create blob with the backup data
                                        const blob = new Blob([backupString], { type: 'text/plain' });
                                        
                                        // Create a temporary URL for the blob
                                        const url = URL.createObjectURL(blob);
                                        
                                        // Create a temporary anchor element and trigger download
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `backup.txt`;
                                        document.body.appendChild(a);
                                        a.click();
                                        
                                        // Clean up
                                        document.body.removeChild(a);
                                        URL.revokeObjectURL(url);
                                    } catch (error) {
                                        console.error('Failed to export backup:', error);
                                        // You could also show an error message to the user here
                                    }
                                }}
                                disabled={loading}
                                className="group inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-full font-medium hover:from-teal-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Export Backup
                            </button>
                        </div>

                        {/* Import/Restore Backup */}
                        <div className="p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl">
                            <label className="block text-sm font-medium text-gray-800 dark:text-white mb-3">
                                Restore Backup
                            </label>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Upload and restore a previously exported backup file. This will replace all current agent data.
                            </p>
                            <div className="flex items-center gap-4">
                                <label className="relative cursor-pointer">
                                    <input
                                        type="file"
                                        accept=".txt,.json"
                                        onChange={handleRestore}
                                        disabled={restoreLoading}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                    />
                                    <div className="group inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50">
                                        {restoreLoading ? (
                                            <>
                                                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                Restoring...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                                                Choose Backup File
                                            </>
                                        )}
                                    </div>
                                </label>
                            </div>
                            
                            {/* Restore Result Message */}
                            {restoreResult && (
                                <div className={`mt-4 p-3 rounded-lg border ${
                                    restoreResult.success 
                                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                                }`}>
                                    <div className="flex items-center gap-2">
                                        {restoreResult.success ? (
                                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                        ) : (
                                            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                                        )}
                                        <p className={`text-sm ${restoreResult.success 
                                            ? 'text-green-800 dark:text-green-400' 
                                            : 'text-red-800 dark:text-red-400'
                                        }`}>
                                            {restoreResult.message}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                {hasUserManageableSettings && (
                    <div className="flex justify-end">
                        <button
                            onClick={handleSaveAll}
                            disabled={loading}
                            className="group inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-full font-medium hover:from-teal-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                                    Save Settings
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* Result Message */}
                {result && (
                    <div className={`p-4 rounded-xl border ${
                        result.success 
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    }`}>
                        <div className="flex items-center gap-3">
                            {result.success ? (
                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            )}
                            <p className={result.success 
                                ? 'text-green-800 dark:text-green-400 font-medium' 
                                : 'text-red-800 dark:text-red-400 font-medium'
                            }>
                                {result.message}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export const getServerSideProps = getLayoutProps;
// Create a properly typed wrapped component
const WrappedSettingsPage = withLayout(SettingsPage as any, {
    title: "Settings",
    description: "Configure your agent settings for blockchain interactions and DID resolution",
    pageHeader: true,
    icon: <Settings className="w-5 h-5" />
});

// Export the wrapped component
export default WrappedSettingsPage; 