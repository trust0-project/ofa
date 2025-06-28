import { ErrorAlert } from "@/components/ErrorAlert";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Message } from "@/components/Message";
import { useMessages } from "@trust0/identus-react/hooks";
import withLayout from "@/components/withLayout";
import { getLayoutProps } from "@/components/withLayout";
import { MessageSquare, ArrowDownCircle, Send, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import SDK from '@hyperledger/identus-sdk';

export const getServerSideProps = getLayoutProps;

function MessageDetails() {
    const { messages, readMessage } = useMessages();
    const params = useParams();
    const id = params?.id as string;
    const [error, setError] = useState<string | null>(null);

    const message = messages.find((message) => message.message.id === id);

    useEffect(() => {
        if (message && !message.read) {
            readMessage(message.message);
        }
    }, [message, readMessage])

    if (!message) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-12 rounded-2xl border border-red-200 dark:border-red-800 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/50 dark:to-orange-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <MessageSquare className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                        Message Not Found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        The message you're looking for doesn't exist or may have been deleted.
                    </p>
                    <Link 
                        href="/app/messages"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Messages
                    </Link>
                </div>
            </div>
        );
    }

    const msg = message.message;
    const isReceived = msg.direction === SDK.Domain.MessageDirection.RECEIVED;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Back navigation */}
            <Link 
                href="/app/messages"
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Messages
            </Link>

            {/* Message header */}
            <div className="bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg">
                <div className="flex items-start gap-4">
                    {/* Direction indicator */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isReceived 
                            ? 'bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50' 
                            : 'bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50'
                    }`}>
                        {isReceived ? (
                            <ArrowDownCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        ) : (
                            <Send className="w-6 h-6 text-green-600 dark:text-green-400" />
                        )}
                    </div>
                    
                    <div className="flex-1">
                        {/* Status badge */}
                        <div className="flex items-center gap-3 mb-3">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                isReceived
                                    ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
                                    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                            }`}>
                                {isReceived ? 'Received' : 'Sent'}
                            </span>
                            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                <Clock className="w-4 h-4" />
                                {new Date(msg.createdTime * 1000).toLocaleString()}
                            </div>
                        </div>
                        
                        {/* Message title */}
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                            {msg.piuri}
                        </h1>
                        
                        {/* From/To info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500 dark:text-gray-400">From:</span>
                                <p className="font-mono text-gray-800 dark:text-white break-all">
                                    {msg.from?.toString() || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <span className="text-gray-500 dark:text-gray-400">To:</span>
                                <p className="font-mono text-gray-800 dark:text-white break-all">
                                    {msg.to?.toString() || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Message content */}
            <div className="bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg">
                <div className="p-6">
                    <Message message={msg} />
                </div>
            </div>
        </div>
    );
}

export default withLayout(MessageDetails, {
    title: "Message Details",
    description: "View detailed information about a message",
    pageHeader: true
}); 