import Head from "next/head";
import { useCallback, useState } from "react";
import Image from "next/image";
import { StorageType } from "@trust0/ridb";
import { useDatabase } from "@trust0/identus-react/hooks";
import { useRouter as useCustomRouter } from "@/hooks";
import { useRouter } from "next/navigation";
import { LogIn, Shield, AlertCircle } from "lucide-react";
import AtalaGraphic from "@/components/Identus";

export default function Auth() {
    const { start } = useDatabase();
    const [dbName, setDbName] = useState('test-db');
    const [error, setError] = useState<string | null>(null);
    const [password, setPassword] = useState('123456');
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
            router.replace(redirectUrl || "/app");
        } catch (err) {
            setError((err as Error).message);
        }
    }, [dbName, password, start, redirectUrl, router])

    return (
        <>
            <Head>
                <title>Authentication | Identus Agent</title>
                <meta name="description" content="Secure authentication for your identity agent" />
            </Head>
            <div className="min-h-screen bg-white dark:bg-[#0A0A0A] text-gray-800 dark:text-gray-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                
                <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
                    <div className="flex justify-center mb-8">
                        <div className="bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-gray-200 dark:border-gray-800">
                            <Image src="/identus-navbar-light.png" alt="Identus Logo" width={128} height={32} />
                        </div>
                    </div>
                    
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Access your decentralized identity agent
                        </p>
                    </div>
                </div>



                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-20">
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
                                <label htmlFor="dbName" className="block text-sm font-medium text-gray-800 dark:text-white mb-2">
                                    Database Name
                                </label>
                                <input
                                    id="dbName"
                                    name="dbName"
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    placeholder="Enter database name"
                                    value={dbName}
                                    onChange={(e) => setDbName(e.target.value)}
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-800 dark:text-white mb-2">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="w-full px-4 py-3 bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="group w-full flex justify-center items-center gap-2 py-3 px-4 bg-gradient-to-r from-teal-500 to-green-500 text-white font-medium rounded-lg hover:from-teal-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    <LogIn className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    Access Agent
                                </button>
                            </div>
                        </form>
                        
                        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Shield className="w-4 h-4" />
                                <span>Your data is encrypted and stored locally</span>
                            </div>
                        </div>
                    </div>
                </div>
                <AtalaGraphic />

            </div>
        </>
    );
} 