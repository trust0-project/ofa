import { useConnections } from "@trust0/identus-react/hooks";
import withLayout from "@/components/withLayout";
import { getLayoutProps } from "@/components/withLayout";
import Link from "next/link";
import { 
  Users, 
  Plus, 
  Activity, 
  Shield, 
  Link2,
  Calendar,
  ArrowRight 
} from "lucide-react";

export const getServerSideProps = getLayoutProps;

function ConnectionsPage() {
    const { connections } = useConnections();

    return (
        <div className="max-w-6xl mx-auto">
            {connections.length === 0 ? (
                <div className="space-y-6">
                    {/* Create Connection CTA */}
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div></div>
                            <Link 
                                href="/app/connections/create"
                                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
                            >
                                <Plus className="w-4 h-4" />
                                Create Connection
                            </Link>
                        </div>
                    </div>

                    {/* Empty State */}
                    <div className="bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20 p-12 rounded-2xl border border-teal-200 dark:border-teal-800 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-green-100 dark:from-teal-900/50 dark:to-green-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Link2 className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                            No Connections Yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                            Start building your identity network by creating your first connection.
                        </p>
                        <div className="bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg p-6 rounded-xl border border-gray-200 dark:border-gray-700 max-w-md mx-auto shadow-lg">
                            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Connection benefits:</h4>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 text-left">
                                <li>• Secure peer-to-peer communication</li>
                                <li>• Credential exchange</li>
                                <li>• Decentralized identity verification</li>
                                <li>• Private messaging</li>
                            </ul>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Create Connection CTA */}
                    <div className="bg-gradient-to-r from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20 p-4 rounded-xl border border-teal-200 dark:border-teal-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Plus className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                                <p className="text-teal-800 dark:text-teal-300 font-medium">
                                    Create a new secure connection
                                </p>
                            </div>
                            <Link 
                                href="/app/connections/create"
                                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                            >
                                <Plus className="w-3 h-3" />
                                Create
                            </Link>
                        </div>
                    </div>

                    {/* Connections stats */}
                    <div className="bg-gradient-to-r from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20 p-4 rounded-xl border border-teal-200 dark:border-teal-800">
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                            <p className="text-teal-800 dark:text-teal-300 font-medium">
                                {connections.length} active connection{connections.length > 1 ? 's' : ''} in your network
                            </p>
                        </div>
                    </div>

                    {/* Connections list */}
                    <div className="bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-lg">
                        {connections.map((connection, i) => (
                            <div
                                key={`connection${i}`}
                                className="group border-b border-gray-200 dark:border-gray-800 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all duration-300 p-6"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1 min-w-0">
                                        {/* Connection indicator */}
                                        <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-green-100 dark:from-teal-900/50 dark:to-green-900/50 rounded-xl flex items-center justify-center">
                                            <Shield className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            {/* Connection metadata */}
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="flex items-center gap-1">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                                        Active
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                                    <Calendar className="w-3 h-3" />
                                                    Connected recently
                                                </div>
                                            </div>
                                            
                                            {/* Connection content */}
                                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                                {connection.name || `Connection ${i + 1}`}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Secure peer-to-peer connection for credential exchange and messaging
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Actions */}
                                    <div className="flex items-center gap-2 ml-4">
                                        <button className="group/btn flex items-center gap-1 px-3 py-1.5 text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg transition-all duration-300">
                                            View
                                            <ArrowRight className="w-3 h-3 transform transition-transform duration-300 group-hover/btn:translate-x-1" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default withLayout(ConnectionsPage, {
    title: "Connections",
    description: "Manage your connections with other agents and services",
    pageHeader: true,
    icon: <Users className="w-5 h-5" />
}); 