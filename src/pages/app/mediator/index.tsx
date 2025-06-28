'use client';

import Head from "next/head";
import { useState } from "react";
import SDK from "@hyperledger/identus-sdk";
import { useRouter } from "next/navigation";
import AgentRequire from "@/components/AgentRequire";
import { MEDIATOR_DID } from "@/config";
import { useDatabase } from "@trust0/identus-react/hooks";
import { getLayoutProps, PageProps } from "@/components/withLayout";
import { Globe, ArrowRight, Shield, Info } from "lucide-react";

export const getServerSideProps = getLayoutProps;

export default function Mediator({
    serverMediatorDID
}: PageProps) {
    const { storeSettingsByKey } = useDatabase();
    const router = useRouter();
    const [mediatorDID, setMediatorDID] = useState<string | undefined>(serverMediatorDID ?? undefined);

    function onClick() {
        if (mediatorDID?.length) {
            const did = SDK.Domain.DID.fromString(mediatorDID);
            storeSettingsByKey(MEDIATOR_DID, did.toString());
            router.push('/app');
        }
    }

    return (
        <AgentRequire>
            <Head>
                <title>Mediator Configuration | Identus Agent</title>
                <meta name="description" content="Configure your DIDComm mediator for secure peer-to-peer communication" />
            </Head>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-green-100 dark:from-teal-900/50 dark:to-green-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Globe className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            Configure Mediator
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Enable secure DIDComm communication
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-900 py-8 px-6 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-800">
                        {/* Info Message */}
                        <div className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800 mb-6">
                            <div className="flex items-start gap-3">
                                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
                                        About Mediators
                                    </h3>
                                    <p className="text-blue-700 dark:text-blue-400 text-sm">
                                        A mediator enables secure message routing between agents in the DIDComm protocol, facilitating private peer-to-peer communication.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="mediatorDID" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                    Mediator DID
                                </label>
                                <input
                                    id="mediatorDID"
                                    type="text"
                                    value={mediatorDID || ''}
                                    onChange={(e) => setMediatorDID(e.target.value)}
                                    placeholder="did:peer:2.Ez6LS..."
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-mono text-sm"
                                />
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    Enter the DID of your trusted mediator service
                                </p>
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={onClick}
                                    disabled={!mediatorDID?.length}
                                    className="group w-full flex justify-center items-center gap-2 py-3 px-4 bg-gradient-to-r from-teal-500 to-green-500 text-white font-medium rounded-lg hover:from-teal-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                                >
                                    Continue Setup
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {/* Security Note */}
                        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Shield className="w-4 h-4" />
                                <span>Mediator configuration is stored securely</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AgentRequire>
    );
} 