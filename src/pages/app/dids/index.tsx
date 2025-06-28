import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Fingerprint, Loader } from "lucide-react";

import { DIDItem } from "@/components/DIDItem";
import { ErrorAlert } from "@/components/ErrorAlert";
import { useDatabase } from "@trust0/identus-react/hooks";
import { GroupedDIDs } from "@/utils/types";
import withLayout from "@/components/withLayout";
import { getLayoutProps } from "@/components/withLayout";

export const getServerSideProps = getLayoutProps;
function DIDsPage() {
    const { db, getGroupedDIDs } = useDatabase();
    const router = useRouter();
    const [groupedDIDs, setGroupedDIDs] = useState<GroupedDIDs>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        if (db) {
            setLoading(true);
            getGroupedDIDs().then(({ prism = [], ...dids }) => {
                setGroupedDIDs({
                    prism,
                    ...dids
                });
            }).catch((err) => {
                setError(err.message);
            }).finally(() => {
                setLoading(false);
            })
        }
    }, [db, getGroupedDIDs])

    useEffect(() => {
        loadData();
    }, [loadData])

    async function createDIDClick() {
        await router.push("/app/dids/create");
    }

    const hasAnyDIDs = Object.values(groupedDIDs).some(dids => dids.length > 0);

    return (
        <div className="max-w-6xl mx-auto">
            {error && (
                <div className="mb-6">
                    <ErrorAlert
                        message={error}
                        onDismiss={() => setError(null)}
                    />
                </div>
            )}

            {/* Create DID Button */}
            <div className="flex justify-end mb-8">
                {hasAnyDIDs && (
                    <button
                        onClick={createDIDClick}
                        className="group inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-full font-medium hover:from-teal-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        <Plus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                        Create DID
                    </button>
                )}
            </div>

            {loading ? (
                <div className="bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg p-12 rounded-2xl border border-gray-200 dark:border-gray-800 text-center shadow-lg">
                    <div className="flex justify-center mb-4">
                        <Loader className="w-8 h-8 text-teal-500 animate-spin" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Loading DIDs</h3>
                    <p className="text-gray-600 dark:text-gray-400">Fetching your decentralized identifiers...</p>
                </div>
            ) : hasAnyDIDs ? (
                <div className="space-y-8">
                    {Object.entries(groupedDIDs).map(([method, dids]) => (
                        <div key={`${method}-dids`}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-6 h-6 bg-gradient-to-br from-teal-100 to-green-100 dark:from-teal-900/50 dark:to-green-900/50 rounded-lg flex items-center justify-center">
                                    <div className="w-2 h-2 bg-teal-500 rounded-full" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white capitalize">
                                    {method} DIDs
                                </h3>
                            </div>
                            <div className="bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-lg">
                                {dids.map((didItem, index) => (
                                    <div key={`${method}-${index}`} className="border-b border-gray-200 dark:border-gray-800 last:border-b-0">
                                        <DIDItem didItem={didItem} onUpdate={() => {
                                            loadData();
                                        }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20 p-12 rounded-2xl border border-teal-200 dark:border-teal-800 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-green-100 dark:from-teal-900/50 dark:to-green-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Fingerprint className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                        No DIDs Created Yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                        Create your first decentralized identifier to start building your self-sovereign digital identity on the blockchain.
                    </p>
                    <button
                        onClick={createDIDClick}
                        className="group inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-full font-medium hover:from-teal-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        <Plus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                        Create Your First DID
                    </button>
                </div>
            )}
        </div>
    );
} 


export default withLayout(DIDsPage, {
    title: "DIDs",
    description: "Manage your decentralized identifiers",
    pageHeader: true,
    icon: <Fingerprint className="w-5 h-5" />
}); 