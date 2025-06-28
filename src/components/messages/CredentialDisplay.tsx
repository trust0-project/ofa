import SDK from "@hyperledger/identus-sdk";
import { Credential } from "../Credential";
import { MessageTitle } from "./MessageTitle";
import { Badge, Clock } from "lucide-react";

export function CredentialDisplay(props: { message: SDK.Domain.Message }) {
    const { message } = props;
    const attachments = message.attachments.reduce<SDK.Domain.Credential[]>((acc, x) => {
        if (x.format === "prism/jwt") {
            return acc.concat(SDK.JWTCredential.fromJWS(x.payload));
        }

        if (x.format === "vc+sd-jwt") {
            return acc.concat(SDK.SDJWTCredential.fromJWS(x.payload));
        }

        try {
            const parsed = JSON.parse(x.payload);
            return acc.concat(parsed);
        }
        catch (err) { }

        return acc;
    }, []);

    const attachment = attachments.at(0)!;
    const parsed = { ...message };
    if (typeof parsed.body === "string") {
        (parsed as any).body = JSON.parse(parsed.body);
    }
    const format = message.attachments?.at(0)?.format;
    const isReceived = message.direction === SDK.Domain.MessageDirection.RECEIVED;

    return (
        <div className="space-y-6">
            {/* Message Header */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50 rounded-xl flex items-center justify-center">
                        <Badge className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                            Credential Display
                        </h2>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {new Date(message.createdTime * 1000).toLocaleString()}
                            </div>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                isReceived
                                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                            }`}>
                                {isReceived ? 'Received' : 'Sent'}
                            </span>
                            {format && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                                    {format}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Credential Content */}
            <div className="bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden">
                <Credential credential={attachment} />
            </div>
        </div>
    );
} 