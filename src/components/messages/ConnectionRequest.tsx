import SDK from "@hyperledger/identus-sdk";
import { UserCheck, Clock, User, ArrowRight } from "lucide-react";

export function ConnectionRequest(props: { message: SDK.Domain.Message }) {
    const { message } = props;
    const parsed = { ...message };
    if (typeof parsed.body === "string") {
        (parsed as any).body = JSON.parse(parsed.body);
    }

    const isReceived = message.direction === SDK.Domain.MessageDirection.RECEIVED;

    return (
        <div className="space-y-6">
            {/* Message Header */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-6 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 rounded-xl flex items-center justify-center">
                        <UserCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                            Connection Request
                        </h2>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {new Date(message.createdTime * 1000).toLocaleString()}
                            </div>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                isReceived
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
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

            {/* Connection Request Body */}
            <div className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                    Request Details
                </h3>
                <div className="bg-white/90 dark:bg-gray-900/60 backdrop-blur-sm p-4 rounded-lg border border-gray-300 dark:border-gray-600 shadow-inner">
                    <pre className="text-sm font-mono whitespace-pre-wrap break-all text-gray-800 dark:text-gray-200 overflow-x-auto">
                        {JSON.stringify(parsed.body, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
} 