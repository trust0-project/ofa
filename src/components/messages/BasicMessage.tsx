import SDK from "@hyperledger/identus-sdk";
import { useEffect, useState } from "react";
import { useAgent } from "@trust0/identus-react/hooks";
import { useMessageStatus } from "./utils";
import { MessageCircle, Send, ArrowRight, User, Clock, Paperclip } from "lucide-react";

export function BasicMessage(props: { message: SDK.Domain.Message }) {
    const { message } = props;
    const { agent } = useAgent();
    const { hasResponse, hasAnswered } = useMessageStatus(message);
    const [response, setResponse] = useState<string>("");
    const [isAnswering, setIsAnswering] = useState(false);

    useEffect(() => {
        if (hasAnswered) {
            setIsAnswering(false);
        }
    }, [hasAnswered])

    const parsed = { ...message };
    if (typeof parsed.body === "string") {
        (parsed as any).body = JSON.parse(parsed.body);
    }

    const attachments = message.attachments.reduce((acc, x) => {
        if ("base64" in x.data) {
            if (x.format === "prism/jwt") {
                const decodedFirst = Buffer.from(x.data.base64, "base64").toString();
                const decoded = Buffer.from(decodedFirst.split(".")[1], "base64").toString();
                const parsed = JSON.parse(decoded);
                return acc.concat(parsed);
            }
            const decoded = Buffer.from(x.data.base64, "base64").toString();
            try {
                const parsed = JSON.parse(decoded);
                return acc.concat(parsed);
            } catch (err) {

            }
        }
        return acc;
    }, []);

    const handleSend = async () => {
        setIsAnswering(true);
        const text = response;
        const from = message?.from as SDK.Domain.DID;
        const to = message?.to as SDK.Domain.DID;
        const thid = message?.thid || message?.id;
        try {
            if (!agent) {
                throw new Error("Start the agent first");
            }
            await agent.send(
                new SDK.BasicMessage(
                    { content: text },
                    to,
                    from,
                    thid
                ).makeMessage()

            );
        }
        catch (e) {
            console.log(e);
        }
    };

    const isReceived = message.direction !== SDK.Domain.MessageDirection.SENT;

    return (
        <div className="space-y-6">
            {/* Message Header */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 rounded-xl flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                            Basic Message
                        </h2>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {new Date(message.createdTime * 1000).toLocaleString()}
                            </div>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                isReceived
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                            }`}>
                                {isReceived ? 'Received' : 'Sent'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Message Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4 text-green-500" />
                        From
                    </h3>
                    <p className="text-sm font-mono break-all text-gray-800 dark:text-gray-200 bg-white/80 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                        {message.from?.toString()}
                    </p>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-orange-500" />
                        To
                    </h3>
                    <p className="text-sm font-mono break-all text-gray-800 dark:text-gray-200 bg-white/80 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                        {message.to?.toString()}
                    </p>
                </div>
            </div>

            {/* Message Content */}
            <div className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"></div>
                    Message Content
                </h3>
                <div className="bg-white/90 dark:bg-gray-900/60 backdrop-blur-sm p-4 rounded-lg border border-gray-300 dark:border-gray-600 shadow-inner">
                    <div className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                        {parsed.body.content}
                    </div>
                </div>
            </div>

            {/* Attachments */}
            {attachments.length > 0 && (
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 p-6 rounded-xl border border-amber-200 dark:border-amber-800">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <Paperclip className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        Attachments ({attachments.length})
                    </h3>
                    <div className="bg-white/90 dark:bg-gray-900/60 backdrop-blur-sm p-4 rounded-lg border border-amber-300 dark:border-amber-700 shadow-inner">
                        <pre className="text-sm font-mono whitespace-pre-wrap break-all text-gray-800 dark:text-gray-200 overflow-x-auto">
                            {attachments.map(x => JSON.stringify(x, null, 2)).join('\n\n')}
                        </pre>
                    </div>
                </div>
            )}

            {/* Response Section */}
            {isReceived && !hasResponse && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <Send className="w-5 h-5 text-green-600 dark:text-green-400" />
                        Send Response
                    </h3>
                    
                    {isAnswering ? (
                        <div className="flex items-center justify-center p-8">
                            <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
                                <div className="w-5 h-5 border-2 border-green-600 dark:border-green-400 border-t-transparent rounded-full animate-spin"></div>
                                <span className="font-medium">Sending response...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <textarea
                                className="w-full p-4 text-gray-800 dark:text-gray-200 bg-white/90 dark:bg-gray-900/60 backdrop-blur-sm border border-green-300 dark:border-green-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 transition-all duration-300 resize-none"
                                rows={4}
                                value={response}
                                placeholder="Type your response here..."
                                onChange={(e) => setResponse(e.target.value)}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!response.trim()}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Send className="w-4 h-4" />
                                Send Response
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 