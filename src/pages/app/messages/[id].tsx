import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Message } from "@/components/Message";
import { useMessages } from "@trust0/identus-react/hooks";
import withLayout from "@/components/withLayout";
import { getLayoutProps } from "@/components/withLayout";
import { MessageSquare, ArrowLeft } from "lucide-react";
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
        if (message) {
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