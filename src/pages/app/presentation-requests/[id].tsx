import { useMessageStatus } from "@/components/messages/utils";
import withLayout from "@/components/withLayout";
import SDK from "@hyperledger/identus-sdk";
import { OEA } from "@hyperledger/identus-sdk/plugins/oea";
import { useMessages, usePeerDID, useVerifier } from "@trust0/identus-react/hooks";
import { ArrowRight, CheckCircle, Clock, AlertCircle, Shield, FileText, QrCode, ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState, useCallback, useEffect } from "react";
import QRCodeDisplay from "@/components/QRCodeDisplay";
import OOBCode from "@/components/OOBCode";


    // useEffect(() => {
    //     // const load = async () => {
    //     //     //const peerDID = await createPeerDID();
    //     //     //const oob = getOOBPresentationRequest(peerDID,requestMessage);
    //     //    // setOob(`${window.location.protocol}://${window.location.host}/app/credentials?oob=${oob}`);
    //     //     //setPeerDID(peerDID);
    //     // }
    //     // if (agentState === SDK.Domain.Startable.State.RUNNING && !request) {
    //     //     load();
    //     // }
    // }, [agentState, createPeerDID, getOOBPresentationRequest, peerDID, request, requestMessage]);
    
    // Extract direction once to avoid depending on entire requestMessage object
// type a = { request:requestMessage }: { request: SDK.Domain.Message
// }


const getStatusColor = (status: string) => {
    switch (status) {
        case 'sent':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
        case 'received':
            return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'sent':
            return <ArrowRight className="w-3 h-3" />;
        case 'received':
            return <CheckCircle className="w-3 h-3" />;
        case 'pending':
            return <Clock className="w-3 h-3" />;
        default:
            return <AlertCircle className="w-3 h-3" />;
    }
};

function PresentationRequest() {
    const router = useRouter();
    const { messages } = useMessages();
    const params = useParams();
    const { getOOBPresentationRequest, state: agentState} = useVerifier();
    const {create: createPeerDID} = usePeerDID();
    const id = params?.id as string;
    const [peerDID, setPeerDID] = useState<SDK.Domain.DID | null>(null);
    const [oob, setOob] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [isGeneratingOOB, setIsGeneratingOOB] = useState(false);

    const copyOobUrl = useCallback(async () => {
        if (oob) {
            try {
                await navigator.clipboard.writeText(oob);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy OOB URL:', err);
            }
        }
    }, [oob]);

    const requestMessage = messages.find((message) => message.message.id === id);
    const request = requestMessage?.message.attachments.at(0)?.payload as (OEA.PresentationRequest | null);

    // Derive status from hasResponse and hasAnswered
    const status = useMemo(() => {
        const messageDirection = requestMessage?.message.direction;
        const isReceived = messageDirection === SDK.Domain.MessageDirection.RECEIVED;
        return 'pending'
    }, []);

    const generateOOBCode = useCallback(async () => {
        if (!request || !requestMessage || agentState !== SDK.Domain.Startable.State.RUNNING) return;
        
        setIsGeneratingOOB(true);
        try {
            const newPeerDID = await createPeerDID();
            const oobCode = await getOOBPresentationRequest(newPeerDID, requestMessage.message);
            const fullUrl = `${window.location.protocol}//${window.location.host}/app/credentials?oob=${oobCode}`;
            
            setPeerDID(newPeerDID);
            setOob(fullUrl);
            setShowPopup(true);
        } catch (error) {
            console.error('Failed to generate OOB code:', error);
        } finally {
            setIsGeneratingOOB(false);
        }
    }, [request, requestMessage, agentState, createPeerDID, getOOBPresentationRequest]);

    const closePopup = () => {
        setShowPopup(false);
        setOob(null);
    };

    if (!request) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-12 rounded-2xl border border-red-200 dark:border-red-800 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/50 dark:to-orange-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                        Presentation Request Not Found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        The  Presentation Request message you're looking for doesn't exist or may have been deleted.
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

    return (
        <div className="max-w-4xl w-full space-y-6">
            {/* Back navigation */}
            <Link 
                href="/app/presentation-requests"
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Presentation Requests
            </Link>

            {/* Main content */}
            <div className="bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg">
                <div className="p-6">
                    {/* Header with status and generate button */}
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                            <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-green-100 dark:from-teal-900/50 dark:to-green-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Shield className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium gap-1 ${getStatusColor(status)}`}>
                                        {getStatusIcon(status)}
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Generate OOB Button */}
                        <div className="flex-shrink-0">
                            <button
                                onClick={generateOOBCode}
                                disabled={isGeneratingOOB || agentState !== SDK.Domain.Startable.State.RUNNING}
                                className="group/btn flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <QrCode className="w-4 h-4" />
                                {isGeneratingOOB ? 'Generating...' : 'Generate QR Code'}
                                <ArrowRight className="w-4 h-4 transform transition-transform duration-300 group-hover/btn:translate-x-1" />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6">

                        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Verification Options</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                <div>
                                    <span className="text-gray-500 dark:text-gray-400">Challenge:</span>
                                    <p className="font-mono text-xs text-gray-700 dark:text-gray-300 break-all mt-1">
                                        {request.options.challenge}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-500 dark:text-gray-400">Domain:</span>
                                    <p className="font-mono text-xs text-gray-700 dark:text-gray-300 break-all mt-1">
                                        {request.options.domain}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Input Descriptors */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Required Credentials ({request.presentation_definition.input_descriptors.length})
                            </h4>
                            
                            {request.presentation_definition.input_descriptors.map((descriptor, index) => (
                                <div key={descriptor.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900/50">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h5 className="font-medium text-gray-800 dark:text-white">
                                                {descriptor.name || `Credential ${index + 1}`}
                                            </h5>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                                                ID: {descriptor.id} 
                                            </p>
                                        </div>
                                        {descriptor.format && (
                                            <div className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400 px-2 py-1 rounded">
                                                {Object.keys(descriptor.format).join(', ').toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    
                                    {descriptor.purpose && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 italic">
                                            {descriptor.purpose}
                                        </p>
                                    )}

                                    {/* Fields */}
                                    {descriptor.constraints.fields.length > 0 && (
                                        <div className="mt-3">
                                            <h6 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                Required Fields:
                                            </h6>
                                            <div className="space-y-2">
                                                {descriptor.constraints.fields.map((field, fieldIndex) => (
                                                    <div key={fieldIndex} className="bg-gray-50 dark:bg-gray-800 rounded p-2">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex-1">
                                                                {field.name && (
                                                                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                                                                        {field.name}
                                                                    </p>
                                                                )}
                                                                <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                                                                    Path: {field.path.join(' → ')}
                                                                </p>
                                                                {field.purpose && (
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-1">
                                                                        {field.purpose}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {field.optional && (
                                                                    <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                                                                        Optional
                                                                    </span>
                                                                )}
                                                                {field.filter && (
                                                                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-2 py-1 rounded">
                                                                        Filtered
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Limit Disclosure */}
                                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="text-gray-500 dark:text-gray-400">Limit Disclosure:</span>
                                            <span className={`px-2 py-1 rounded ${
                                                descriptor.constraints.limit_disclosure === 'required' 
                                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' 
                                                    : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                                            }`}>
                                                {descriptor.constraints.limit_disclosure.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Popup Modal */}
            {showPopup && oob && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-md bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800">
                        <div className="p-6">
                            <button
                                onClick={closePopup}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-300"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-gradient-to-br from-teal-100 to-green-100 dark:from-teal-900/50 dark:to-green-900/50 rounded-lg flex items-center justify-center">
                                        <QrCode className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Presentation Request</h3>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                    Scan this QR code with your wallet to respond to this presentation request. The holder can use this to submit their credentials for verification.
                                </p>
                            </div>
                            
                            <div className="p-4">
                                <OOBCode code={oob} type="presentation" />
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={copyOobUrl}
                                    className="w-full px-4 py-2 text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg transition-all duration-300"
                                >
                                    {copied ? 'Copied!' : 'Copy URL'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default withLayout(PresentationRequest, {
    title: "Presentation Request",
    description: "View detailed information about a presentation request",
    pageHeader: true
}); 