import SDK from "@hyperledger/identus-sdk";

export function DefaultMessage(props: { message: SDK.Domain.Message }) {
    const { message } = props;

    return (
        <div className="space-y-6">
            {/* Message Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Message ID
                    </h3>
                    <p className="text-sm font-mono break-all text-gray-800 dark:text-gray-200 bg-white/80 dark:bg-gray-900/50 p-3 rounded-lg">
                        {message.id}
                    </p>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        Protocol URI
                    </h3>
                    <p className="text-sm font-mono break-all text-gray-800 dark:text-gray-200 bg-white/80 dark:bg-gray-900/50 p-3 rounded-lg">
                        {message.piuri}
                    </p>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        From
                    </h3>
                    <p className="text-sm font-mono break-all text-gray-800 dark:text-gray-200 bg-white/80 dark:bg-gray-900/50 p-3 rounded-lg">
                        {message.from?.toString() || 'N/A'}
                    </p>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        To
                    </h3>
                    <p className="text-sm font-mono break-all text-gray-800 dark:text-gray-200 bg-white/80 dark:bg-gray-900/50 p-3 rounded-lg">
                        {message.to?.toString() || 'N/A'}
                    </p>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                            message.direction === SDK.Domain.MessageDirection.SENT ? 'bg-emerald-500' : 'bg-cyan-500'
                        }`}></div>
                        Direction
                    </h3>
                    <div className="bg-white/80 dark:bg-gray-900/50 p-3 rounded-lg">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            message.direction === SDK.Domain.MessageDirection.SENT
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                                : 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300'
                        }`}>
                            {message.direction === SDK.Domain.MessageDirection.SENT ? 'Sent' : 'Received'}
                        </span>
                    </div>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        Created Time
                    </h3>
                    <p className="text-sm text-gray-800 dark:text-gray-200 bg-white/80 dark:bg-gray-900/50 p-3 rounded-lg">
                        {new Date(message.createdTime * 1000).toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Message Body */}
            <div className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"></div>
                    Message Body
                </h3>
                <div className="bg-white/90 dark:bg-gray-900/60 backdrop-blur-sm p-4 rounded-lg shadow-inner">
                    <pre className="text-sm font-mono whitespace-pre-wrap break-all text-gray-800 dark:text-gray-200 overflow-x-auto">
                        {JSON.stringify(message.body, null, 2)}
                    </pre>
                </div>
            </div>

            {/* Attachments */}
            {message.attachments.length > 0 && (
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 p-6 rounded-xl border border-amber-200 dark:border-amber-800">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"></div>
                        Attachments ({message.attachments.length})
                    </h3>
                    <div className="space-y-4">
                        {message.attachments.map((attachment, index) => (
                            <div key={index} className="bg-white/90 dark:bg-gray-900/60 backdrop-blur-sm p-4 rounded-lg border border-amber-300 dark:border-amber-700 shadow-sm">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-semibold text-gray-800 dark:text-white bg-amber-100 dark:bg-amber-900/30 px-3 py-1 rounded-full">
                                            Attachment {index + 1}
                                        </span>
                                        {attachment.mediaType && (
                                            <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">
                                                {attachment.mediaType}
                                            </span>
                                        )}
                                    </div>
                                    {attachment.description && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                            {attachment.description}
                                        </p>
                                    )}
                                    {attachment.filename && (
                                        <p className="text-sm font-mono text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 p-2 rounded">
                                            {attachment.filename}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Extra Headers */}
            {Object.keys(message.extraHeaders).length > 0 && (
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-violet-200 dark:border-violet-800">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <div className="w-3 h-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"></div>
                        Extra Headers
                    </h3>
                    <div className="bg-white/90 dark:bg-gray-900/60 backdrop-blur-sm p-4 rounded-lg border border-violet-300 dark:border-violet-700 shadow-inner">
                        <pre className="text-sm font-mono whitespace-pre-wrap break-all text-gray-800 dark:text-gray-200 overflow-x-auto">
                            {JSON.stringify(message.extraHeaders, null, 2)}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
} 