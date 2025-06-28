'use client';

import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDatabase } from "@trust0/identus-react/hooks";
import { useApollo } from "@trust0/identus-react/hooks";
import AgentRequire from "@/components/AgentRequire";
import { getLayoutProps, PageProps } from "@/components/withLayout";
import { useRouter as useCustomRouter } from "@/hooks";
import { Key, RefreshCw, ArrowRight, Shield, AlertTriangle } from "lucide-react";

export const getServerSideProps = getLayoutProps;

export default function Mnemonics(props: PageProps) {
    const apollo = useApollo();
    const router = useRouter();
    const { setSeed } = useDatabase();
    const { redirectUrl } = useCustomRouter();
    
    const [mnemonics, setMnemonics] = useState<string[]>([]);

    useEffect(() => {
        setMnemonics(apollo.createRandomMnemonics());
    }, [apollo]);

    async function regenerateClick() {
        setMnemonics(apollo.createRandomMnemonics());
    }

    async function onNextClick() {
        if (mnemonics.length === 24) {
            const seed = apollo.createSeed(mnemonics as any);
            await setSeed(seed);
            router.push(!props.isMediatorManaged ? '/app/mediator' : redirectUrl || '/app');
        }
    }

    return (
        <AgentRequire>
            <Head>
                <title>Seed Phrase | Identus Agent</title>
                <meta name="description" content="Generate and secure your wallet seed phrase" />
            </Head>
            <div className="min-h-screen bg-white dark:bg-[#0A0A0A] text-gray-800 dark:text-gray-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-green-100 dark:from-teal-900/50 dark:to-green-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Key className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
                            Your Seed Phrase
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            The keys to your decentralized identity
                        </p>
                    </div>

                    <div className="bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg py-8 px-6 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-800">
                        {/* Warning Message */}
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-xl border border-amber-200 dark:border-amber-800 mb-8">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-1">
                                        Critical Security Information
                                    </h3>
                                    <p className="text-amber-700 dark:text-amber-400 text-sm">
                                        These 24 words are the <strong>only way</strong> to recover your wallet. Write them down and store them in a secure location. Anyone with access to these words can control your identity.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Seed Words Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                            {mnemonics.map((word, i) => (
                                <div
                                    key={`mnemonicWord${i}`}
                                    className="flex items-center p-4 rounded-lg bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-300"
                                >
                                    <span className="text-teal-500 dark:text-teal-400 mr-3 text-sm font-medium w-6">
                                        {i + 1}.
                                    </span>
                                    <span className="text-gray-800 dark:text-white font-medium">
                                        {word}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                className="group flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all duration-300 border border-gray-200 dark:border-gray-700"
                                onClick={regenerateClick}
                            >
                                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                                Generate New Phrase
                            </button>
                            <button
                                className="group flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-teal-500 to-green-500 text-white font-medium rounded-lg hover:from-teal-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                                onClick={onNextClick}
                            >
                                I've Secured My Phrase
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {/* Security Note */}
                        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Shield className="w-4 h-4" />
                                <span>This phrase will never be shown again</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AgentRequire>
    );
} 