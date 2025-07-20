import Head from "next/head";
import { useCallback, useState } from "react";
import Image from "next/image";
import { StorageType } from "@trust0/ridb";
import { useDatabase } from "@trust0/identus-react/hooks";
import { useRouter as useCustomRouter } from "@/hooks";
import { useRouter } from "next/router";
import { LogIn, Shield, AlertCircle, Database, Lock, Info } from "lucide-react";
import AtalaGraphic from "@/components/Identus";
import LOGOSmall from "../../../../public/logos/ofa-dark.svg"
import { RIDBError } from "@trust0/ridb-core";

export default function Auth() {
    const { start, db, getMediator } = useDatabase();
    const [dbName, setDbName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [password, setPassword] = useState('');
    const {redirectUrl } = useCustomRouter();
    const router = useRouter();

    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!dbName.trim()) {
            setError('Database name is required');
            return;
        }
        try {
            await start({
                dbName,
                password,
                storageType: StorageType.IndexDB,
            });
            await getMediator()
            router.replace(redirectUrl || "/app");
        } catch (err) {
            if (err instanceof RIDBError) {
                if (err.type === 'AuthenticationError') {
                    setError('Database error: Invalid password');
                } else {
                    setError(err.message);
                }
            } else {
                setError((err as Error).message);
            }
        }
    }, [dbName, start, password, getMediator, router, redirectUrl])

    return (
        <>
            <Head>
                <title>Setup Your Agent | Identus</title>
                <meta name="description" content="Initialize your personal decentralized identity agent" />
            </Head>
            <div className="min-h-screen bg-white dark:bg-[#0A0A0A] text-gray-800 dark:text-gray-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                
                <div className="sm:mx-auto sm:w-full sm:max-w-lg z-10">
                    <div className="flex justify-center mb-8">
                        <div className="bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-gray-200 dark:border-gray-800">
                            <Image src={LOGOSmall} alt="Identus Logo" width={128} height={32} />
                        </div>
                    </div>
                    
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
                            Initialize Your Identity Agent
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                            Set up your personal decentralized identity workspace
                        </p>
                    </div>

                    {/* Important Information Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800 mb-8">
                        <div className="flex items-start gap-3 mb-4">
                            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                    Important: Local Browser Storage
                                </h3>
                                <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                                    Your identity agent runs entirely in your browser. The database name and password you choose will create an encrypted workspace stored locally on your device. 
                                    <strong className="block mt-2">Only you have access to this data — we cannot recover your password if lost.</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-lg relative z-20">
                    <div className="bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg py-8 px-6 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-800">
                        {error && (
                            <div className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                    <p className="text-red-800 dark:text-red-400 font-medium">{error}</p>
                                </div>
                            </div>
                        )}
                        
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="dbName" className="block text-sm font-medium text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                                    <Database className="w-4 h-4" />
                                    Workspace Name
                                </label>
                                <input
                                    id="dbName"
                                    name="dbName"
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    placeholder="Choose a unique workspace name"
                                    value={dbName}
                                    onChange={(e) => setDbName(e.target.value)}
                                />
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    This creates your local encrypted database
                                </p>
                            </div>
                            
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                                    <Lock className="w-4 h-4" />
                                    Master Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="w-full px-4 py-3 bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    placeholder="Create a strong password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                                    <p className="text-xs text-amber-800 dark:text-amber-200 font-medium">
                                        ⚠️ Store this password securely — it cannot be recovered if lost
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="group w-full flex justify-center items-center gap-2 py-3 px-4 bg-gradient-to-r from-teal-500 to-green-500 text-white font-medium rounded-lg hover:from-teal-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    <LogIn className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    Initialize Agent
                                </button>
                            </div>
                        </form>
                        
                        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="space-y-3">
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Shield className="w-4 h-4" />
                                    <span>Your data is encrypted and stored locally</span>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        No data is sent to external servers. Your privacy is guaranteed.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <AtalaGraphic />

            </div>
        </>
    );
} 