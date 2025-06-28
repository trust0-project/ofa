import { useState } from "react";
import { useAgent } from "@trust0/identus-react/hooks";
import withLayout from "@/components/withLayout";
import { getLayoutProps } from "@/components/withLayout";
import { Fingerprint, Plus, CheckCircle, AlertCircle, Loader, Copy } from "lucide-react";

export const getServerSideProps = getLayoutProps;

function DIDsPage() {
    const { agent } = useAgent();
    const [alias, setAlias] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [result, setResult] = useState<{ success: boolean; message: string; did?: string }>();

    const handleCreateDID = async () => {
        if (!agent) {
            setResult({
                success: false,
                message: "Agent is not initialized"
            });
            return;
        }
        try {
            setLoading(true);
            setResult(undefined);
            const did = await agent.createNewPrismDID(alias || "did", []);
            setResult({
                success: true,
                message: "DID created successfully",
                did: did.toString()
            });
        } catch (error) {
            console.error("Error creating DID:", error);
            setResult({
                success: false,
                message: error instanceof Error ? error.message : "Unknown error occurred"
            });
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="max-w-7xl mx-auto">
                <div className="bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20 p-12 rounded-2xl border border-teal-200 dark:border-teal-800 text-center">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-green-100 dark:from-teal-900/50 dark:to-green-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Fingerprint className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                            Create New DID
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Generate a new decentralized identifier on Cardano
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label htmlFor="alias" className="block text-sm font-medium text-gray-800 dark:text-white mb-2">
                                Alias (Optional)
                            </label>
                            <input
                                type="text"
                                id="alias"
                                value={alias}
                                onChange={(e) => setAlias(e.target.value)}
                                placeholder="Enter a friendly name for your DID"
                                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            />
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                This helps you identify your DID in the interface
                            </p>
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={handleCreateDID}
                                disabled={loading || !agent}
                                className="group w-full flex justify-center items-center gap-2 py-3 px-4 bg-gradient-to-r from-teal-500 to-green-500 text-white font-medium rounded-full hover:from-teal-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" />
                                        Creating DID...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                        Create DID
                                    </>
                                )}
                            </button>
                        </div>

                        {!agent && (
                            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-xl border border-yellow-200 dark:border-yellow-800">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                    <p className="text-yellow-800 dark:text-yellow-400 font-medium">
                                        Agent is not initialized. Please start the agent first.
                                    </p>
                                </div>
                            </div>
                        )}

                        {result && (
                            <div className={`p-6 rounded-xl border ${
                                result.success 
                                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800' 
                                    : 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200 dark:border-red-800'
                            }`}>
                                <div className="flex items-start gap-3">
                                    {result.success ? (
                                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                                    )}
                                    <div className="flex-1">
                                        <p className={result.success 
                                            ? 'text-green-800 dark:text-green-400 font-medium' 
                                            : 'text-red-800 dark:text-red-400 font-medium'
                                        }>
                                            {result.message}
                                        </p>
                                        {result.did && (
                                            <div className="mt-4 p-4 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="text-sm font-semibold text-gray-800 dark:text-white">
                                                        Your New DID:
                                                    </h4>
                                                    <button
                                                        onClick={() => copyToClipboard(result.did!)}
                                                        className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                                                        title="Copy DID"
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <p className="text-sm text-gray-700 dark:text-gray-300 font-mono break-all">
                                                    {result.did}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 

export default withLayout(DIDsPage, {
    title: "Create DID",
    description: "Generate a new decentralized identifier",
    pageHeader: true,
    icon: <Fingerprint className="w-5 h-5" />
}); 