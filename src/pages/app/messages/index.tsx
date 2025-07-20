import Link from "next/link";
import SDK from '@hyperledger/identus-sdk';
import { useMessages } from "@trust0/identus-react/hooks";
import { withLayout } from "@/components/withLayout";
import { getLayoutProps } from "@/components/withLayout";
import { MessageSquare, Send, ArrowDownCircle, Trash2, ChevronRight, Clock } from "lucide-react";

export const getServerSideProps = getLayoutProps;
function MessagesPage() {
    
    const { messages, deleteMessage} = useMessages();

    const handleDeleteMessage = async (message: SDK.Domain.Message) => {
        await deleteMessage(message);
    }

    return (
        <div className="max-w-6xl mx-auto">
            {messages.length === 0 ? (
                <div className="bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20 p-12 rounded-2xl border border-teal-200 dark:border-teal-800 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-green-100 dark:from-teal-900/50 dark:to-green-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <MessageSquare className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                        No Messages Yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                        When you send or receive secure DIDComm messages, they will appear here for easy management.
                    </p>
                    <div className="bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg p-6 rounded-xl border border-gray-200 dark:border-gray-700 max-w-md mx-auto shadow-lg">
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Message types include:</h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 text-left">
                            <li>• Connection requests</li>
                            <li>• Credential offers</li>
                            <li>• Presentation requests</li>
                            <li>• Basic communications</li>
                        </ul>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">

                    {/* Messages list */}
                    <div className="bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-lg">
                        {messages.map((message, i) => {
                            const msg = message.message;
                            const isReceived = msg.direction === SDK.Domain.MessageDirection.RECEIVED;
                            if (msg.piuri === SDK.ProtocolType.DidcommOfferCredential) {
                                return null;
                            }
                            return (
                                <div
                                    key={`message-list-${msg.id + i}`}
                                    className="group border-b border-gray-200 dark:border-gray-800 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all duration-300"
                                >
                                    <Link href={`/app/messages/${msg.id}`} className="block p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4 flex-1 min-w-0">
                                                {/* Direction indicator */}
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                                    isReceived 
                                                        ? 'bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50' 
                                                        : 'bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50'
                                                }`}>
                                                    {isReceived ? (
                                                        <ArrowDownCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                    ) : (
                                                        <Send className="w-5 h-5 text-green-600 dark:text-green-400" />
                                                    )}
                                                </div>
                                                
                                                <div className="flex-1 min-w-0">
                                                    {/* Message metadata */}
                                                    <div className="flex items-center gap-3 mb-2">
                                                                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                            isReceived
                                                ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
                                                : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                        }`}>
                                                            {isReceived ? 'Received' : 'Sent'}
                                                        </span>
                                                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(msg.createdTime * 1000).toLocaleString()}
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Message content */}
                                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1 truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                                        {msg.piuri}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                                        {isReceived
                                                            ? `From: ${msg.from?.toString() || 'N/A'}`
                                                            : `To: ${msg.to?.toString() || 'N/A'}`
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            {/* Actions */}
                                            <div className="flex items-center gap-2 ml-4">
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleDeleteMessage(message.message);
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300"
                                                    title="Delete message"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-teal-500 group-hover:translate-x-1 transition-all duration-300" />
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

// Export the component wrapped with layout
export default withLayout(MessagesPage, {
    title: "Messages",
    description: "View and manage your messages",
    pageHeader: true,
    icon: <MessageSquare className="w-5 h-5" />
}); 