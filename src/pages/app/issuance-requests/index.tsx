import Link from "next/link";
import { useDatabase, useMessages, usePeerDID } from "@trust0/identus-react/hooks";
import { useCallback, useEffect, useState } from "react";
import SDK from '@hyperledger/identus-sdk';
import { v4 as uuidv4 } from 'uuid';
import { base64ToBytes } from "did-jwt";
import QRCodeDisplay from "@/components/QRCodeDisplay";
import withLayout from "@/components/withLayout";
import { useAgent } from "@trust0/identus-react/hooks";
import { getLayoutProps } from "@/components/withLayout";
import { 
    FileText, 
    Plus, 
    Clock, 
    CheckCircle, 
    AlertCircle,
    Loader,
    QrCode,
    X,
    ArrowRight,
    Award
} from "lucide-react";

export const getServerSideProps = getLayoutProps;

type IssuanceRequest = {
    id: string;
    issuingDID: string;
    credentialFormat: string;
    automaticIssuance: boolean;
    claims: Array<{
        name: string;
        value: string;
        type: string;
    }>;
    createdAt?: number;
};

function IssuanceRequestsPage() {
    const { error: dbError, getIssuanceFlows, state: dbState } = useDatabase();
    const { agent } = useAgent();
    const { peerDID } = usePeerDID();
    const [issuanceRequests, setIssuanceRequests] = useState<IssuanceRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [showPopup, setShowPopup] = useState(false);
    const [oob, setOob] = useState<string | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<IssuanceRequest | null>(null);
    const { messages } = useMessages();

    const getIssuanceRequestStatus = useCallback((request: IssuanceRequest) => {
        const relatedMessages = messages
            .filter(({ message }) => message.thid === request.id);

        if (relatedMessages.find(({ message }) => message.piuri === SDK.ProtocolType.DidcommIssueCredential)) {
            return 'issued'
        }

        if (relatedMessages.find(({ message }) => message.piuri === SDK.ProtocolType.DidcommRequestCredential)) {
            return 'issuance-pending'
        }

        return 'pending' as const
    }, [messages]);

    useEffect(() => {
        if (dbState === 'loaded') {
            setIsLoading(true);
            getIssuanceFlows()
                .then((data) => {
                    setIssuanceRequests(data || []);
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.error("Error loading issuance requests:", err);
                    setError("Failed to load issuance requests");
                    setIsLoading(false);
                });
        }
    }, [getIssuanceFlows, dbState]);

    const openPopup = async (request: IssuanceRequest) => {
        if (!agent || !peerDID) return;

        const oobTask = new SDK.Tasks.CreateOOBOffer({
            from: peerDID,
            offer: new SDK.OfferCredential(
                {
                    goal_code: "Offer Credential",
                    credential_preview: {
                        type: SDK.ProtocolType.DidcommCredentialPreview,
                        body: {
                            attributes: request.claims.map((claim) => ({ name: claim.name, value: claim.value })),
                        },
                    },
                },
                [
                    new SDK.Domain.AttachmentDescriptor(
                        {
                            json: {
                                id: uuidv4(),
                                media_type: "application/json",
                                options: {
                                    challenge: uuidv4(),
                                    domain: window.location.origin || "domain",
                                },
                                thid: request.id,
                                presentation_definition: {
                                    id: uuidv4(),
                                    input_descriptors: [],
                                    format: {
                                        jwt: {
                                            alg: [
                                                request.credentialFormat === SDK.Domain.CredentialType.JWT ?
                                                    SDK.Domain.JWT_ALG.ES256K :
                                                    SDK.Domain.JWT_ALG.EdDSA
                                            ],
                                            proof_type: [],
                                        },
                                    },
                                },
                                format: request.credentialFormat,
                            },
                        },
                        "application/json",
                        request.id,
                        undefined,
                        request.credentialFormat
                    )
                ],
                undefined,
                undefined,
                request.id
            )
        });
        const oob = await agent.runTask(oobTask);
        const oobDecoded = base64ToBytes(oob);
        const oobJson = Buffer.from(oobDecoded).toString();
        setOob(oobJson);
        setSelectedRequest(request);
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        setSelectedRequest(null);
        setOob(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'issued':
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
            case 'issuance-pending':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
            default:
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'issued':
                return <CheckCircle className="w-4 h-4" />;
            case 'issuance-pending':
                return <Clock className="w-4 h-4" />;
            default:
                return <AlertCircle className="w-4 h-4" />;
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            {error && (
                <div className="mb-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        <div>
                            <p className="text-red-800 dark:text-red-400 font-medium">{error}</p>
                            {dbError && <p className="text-sm text-red-600 dark:text-red-400 mt-1">Database error: {dbError.message}</p>}
                        </div>
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg p-12 rounded-2xl border border-gray-200 dark:border-gray-800 text-center shadow-lg">
                    <div className="flex justify-center mb-4">
                        <Loader className="w-8 h-8 text-teal-500 animate-spin" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Loading Issuance Requests</h3>
                    <p className="text-gray-600 dark:text-gray-400">Fetching your credential issuance requests...</p>
                </div>
            ) : issuanceRequests.length === 0 ? (
                <div className="space-y-6">
                    {/* Create Request CTA */}
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div></div>
                            <Link 
                                href="/app/issuance-requests/create"
                                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
                            >
                                <Plus className="w-4 h-4" />
                                New Request
                            </Link>
                        </div>
                    </div>

                    {/* Empty State */}
                    <div className="bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20 p-12 rounded-2xl border border-teal-200 dark:border-teal-800 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-green-100 dark:from-teal-900/50 dark:to-green-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <FileText className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                            No Issuance Requests Yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                            Create your first issuance request to start offering verifiable credentials to holders.
                        </p>
                        <div className="bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg p-6 rounded-xl border border-gray-200 dark:border-gray-700 max-w-md mx-auto shadow-lg">
                            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Issuance benefits:</h4>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 text-left">
                                <li>• Issue verifiable credentials</li>
                                <li>• Automated credential offers</li>
                                <li>• QR code distribution</li>
                                <li>• Track issuance status</li>
                            </ul>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Create Request CTA */}
                    <div className="bg-gradient-to-r from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20 p-4 rounded-xl border border-teal-200 dark:border-teal-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Plus className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                                <p className="text-teal-800 dark:text-teal-300 font-medium">
                                    Create a new credential issuance request
                                </p>
                            </div>
                            <Link 
                                href="/app/issuance-requests/create"
                                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                            >
                                <Plus className="w-3 h-3" />
                                Create
                            </Link>
                        </div>
                    </div>

                    {/* Requests list */}
                    <div className="bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-lg">
                        {issuanceRequests.map((request) => {
                            const status = getIssuanceRequestStatus(request);
                            return (
                                <div
                                    key={request.id}
                                    className="group border-b border-gray-200 dark:border-gray-800 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all duration-300 p-6"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4 flex-1 min-w-0">
                                            {/* Request indicator */}
                                            <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-green-100 dark:from-teal-900/50 dark:to-green-900/50 rounded-xl flex items-center justify-center">
                                                <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                                            </div>
                                            
                                            <div className="flex-1 min-w-0">
                                                {/* Request metadata */}
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium gap-1 ${getStatusColor(status)}`}>
                                                        {getStatusIcon(status)}
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </span>
                                                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                                        <Clock className="w-3 h-3" />
                                                        Created recently
                                                    </div>
                                                </div>
                                                
                                                {/* Request content */}
                                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                                    <span className="font-mono text-sm">{request.id.slice(0, 8)}...</span>
                                                </h3>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        <span className="font-medium">Format:</span> {request.credentialFormat}
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        <span className="font-medium">Claims:</span> {request.claims.length} attributes
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                                        <span className="font-medium">DID:</span> <span className="font-mono">{request.issuingDID.slice(0, 16)}...</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Actions */}
                                        <div className="flex items-center gap-2 ml-4">
                                            <button
                                                onClick={() => openPopup(request)}
                                                className="group/btn flex items-center gap-1 px-3 py-1.5 text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg transition-all duration-300"
                                            >
                                                <QrCode className="w-3 h-3" />
                                                View QR
                                                <ArrowRight className="w-3 h-3 transform transition-transform duration-300 group-hover/btn:translate-x-1" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Popup Modal */}
            {showPopup && selectedRequest && oob && (
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
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Credential Offer</h3>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                    Scan this QR code with your wallet to receive the credential offer for request{' '}
                                    <span className="font-mono font-medium">{selectedRequest.id.slice(0, 8)}...</span>
                                </p>
                            </div>
                            
                            <div className="p-4">
                                <QRCodeDisplay oob={oob} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 

export default withLayout(IssuanceRequestsPage, {
    title: "Issuance Requests",
    description: "Manage your credential issuance requests and offers",
    pageHeader: true,
    icon: <FileText className="w-5 h-5" />
}); 