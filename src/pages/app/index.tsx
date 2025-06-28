'use client'
import { withLayout, getLayoutProps } from "@/components/withLayout";
import Link from "next/link";
import {
  FileText,
  CreditCard,
  MessageSquare,
  Users,
  Settings,
  Shield,
  ArrowRight,
  Fingerprint,
  Award,
  Plus,
  Zap
} from "lucide-react";

type FeatureBlock = {
    title: string;
    description: string;
    path: string;
    icon: React.ReactNode;
    color: string;
    isComingSoon?: boolean;
}

function Dashboard() {
    const quickActions: FeatureBlock[] = [
        {
            title: "Create DID",
            description: "Generate a new decentralized identifier",
            path: "/app/dids/create",
            color: "from-blue-500 to-cyan-500",
            icon: <Fingerprint className="w-5 h-5" />
        },
        {
            title: "Issue Credential",
            description: "Create a new credential issuance request",
            path: "/app/issuance-requests/create",
            color: "from-green-500 to-emerald-500",
            icon: <Award className="w-5 h-5" />
        }
    ];

    const mainFeatures: FeatureBlock[] = [
        {
            title: "DIDs",
            description: "Manage your decentralized identifiers",
            path: "/app/dids",
            color: "from-purple-500 to-pink-500",
            icon: <Fingerprint className="w-6 h-6" />
        },
        {
            title: "Credentials",
            description: "View and manage your verifiable credentials",
            path: "/app/credentials",
            color: "from-green-500 to-teal-500",
            icon: <CreditCard className="w-6 h-6" />
        },
        {
            title: "Messages",
            description: "Secure DIDComm protocol communications",
            path: "/app/messages",
            color: "from-blue-500 to-indigo-500",
            icon: <MessageSquare className="w-6 h-6" />
        },
        {
            title: "Connections",
            description: "Manage peer-to-peer relationships",
            path: "/app/connections",
            color: "from-orange-500 to-red-500",
            icon: <Users className="w-6 h-6" />
        }
    ];

    const managementFeatures: FeatureBlock[] = [
        {
            title: "Issue Credentials",
            description: "Create and manage credential issuance workflows",
            path: "/app/issuance-requests",
            color: "from-teal-500 to-green-500",
            icon: <Award className="w-6 h-6" />
        },
        {
            title: "Verify Credentials",
            description: "Verify the authenticity of presented credentials",
            path: "#",
            color: "from-gray-400 to-gray-500",
            icon: <Shield className="w-6 h-6" />,
            isComingSoon: true
        },
        {
            title: "Settings",
            description: "Configure blockchain and identity settings",
            path: "/app/settings",
            color: "from-slate-500 to-gray-600",
            icon: <Settings className="w-6 h-6" />
        }
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-12">
            {/* Simplified Hero Section */}
            <div className="text-center space-y-6">
                <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
                        Identity Dashboard
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Essential tools for your decentralized identity management on Cardano
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {mainFeatures.map((feature) => (
                        <Link 
                            key={feature.path} 
                            href={feature.path} 
                            className="group"
                        >
                            <div className="bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                                <div className="space-y-4">
                                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Management & Tools */}
            <div className="space-y-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                        Management & Tools
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Advanced features for issuing, verifying, and configuring
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {managementFeatures.map((feature) => (
                        <div key={feature.path} className="relative">
                            {feature.isComingSoon ? (
                                <div className="bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm opacity-75 h-full">
                                    <div className="space-y-4">
                                        <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                                    {feature.title}
                                                </h3>
                                                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full">
                                                    Coming Soon
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link href={feature.path} className="group block h-full">
                                    <div className="bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                                        <div className="space-y-4">
                                            <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                                {feature.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                                    {feature.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Status/Stats Card */}
            <div className="bg-gradient-to-br from-teal-50 via-green-50 to-blue-50 dark:from-teal-900/20 dark:via-green-900/20 dark:to-blue-900/20 rounded-3xl p-8 border border-teal-200 dark:border-teal-800">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                        <Zap className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                            Ready to Build
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Your offline-first identity agent is running. Start by creating your first DID or 
                            connecting with trusted peers to begin your decentralized identity journey.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                        <Link 
                            href="/app/dids"
                            className="inline-flex items-center gap-2 px-6 py-2 bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg text-teal-600 dark:text-teal-400 rounded-full font-medium border border-teal-200 dark:border-teal-700 hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-all duration-300"
                        >
                            <Fingerprint className="w-4 h-4" />
                            View DIDs
                        </Link>
                        <Link 
                            href="/app/connections"
                            className="inline-flex items-center gap-2 px-6 py-2 bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg text-teal-600 dark:text-teal-400 rounded-full font-medium border border-teal-200 dark:border-teal-700 hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-all duration-300"
                        >
                            <Users className="w-4 h-4" />
                            Manage Connections
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
} 

export const getServerSideProps = getLayoutProps;
    
// Export the component wrapped with layout
export default withLayout(Dashboard, {
    title: "Identity Dashboard", 
    description: "Manage your decentralized identity with zero infrastructure",
    pageHeader: false,
    icon: <Shield className="w-5 h-5" />
}); 