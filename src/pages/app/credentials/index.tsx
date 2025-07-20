import type React from "react";
import SDK from "@hyperledger/identus-sdk";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePeerDID, useCredentials, useDatabase, useHolder, useMessages } from "@trust0/identus-react/hooks";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { CreditCard, AlertTriangle, CheckCircle } from "lucide-react";
import AgentRequire from "@/components/AgentRequire";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { base64 } from "multiformats/bases/base64";
import { Credential } from "@/components/Credential";
import { useAgent } from "@trust0/identus-react/hooks";
import withLayout from "@/components/withLayout";
import { OfferCredential } from "@/components/messages";
import { getLayoutProps } from "@/components/withLayout";
import { useMessageStatus } from "@/components/messages/utils";

export const getServerSideProps = getLayoutProps;

function CredentialOffer({ message, onReject }: { message: SDK.Domain.Message, onReject: () => void }) {
    const { agent } = useAgent();
    if (!agent || agent.state !== SDK.Domain.Startable.State.RUNNING) {
        return (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-2xl border border-yellow-200 dark:border-yellow-800 mb-6">
                <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    <p className="text-yellow-800 dark:text-yellow-400 font-medium">
                        Start the agent to process the Credential Offer
                    </p>
                </div>
            </div>
        );
    }
    return <AgentRequire>
        <OfferCredential message={message} onReject={onReject} />
    </AgentRequire>
}


function CredentialSelector({ request }: { request: SDK.Domain.Message }) {
    const { credentials } = useCredentials()
    const [selectedCredential, setSelectedCredential] = useState<SDK.Domain.Credential | null>(credentials.length > 0 ? credentials[0] : null);
    const { handlePresentationRequest, state: agentState, agent } = useHolder();
    const { deleteMessage, load: loadMessages } = useMessages();
    const { state: dbState } = useDatabase();
    const [isAccepting, setIsAccepting] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);

    const requestPresentation = useMemo(() => request.attachments.at(0)!.payload, [request]);

    const claims: any[] = useMemo(() => {
        return requestPresentation?.presentation_definition ?
            requestPresentation.presentation_definition.input_descriptors.at(0)?.constraints.fields ?? [] :
            []
    }, [requestPresentation]);

    const fields = useMemo(() => {
        return claims.reduce<any>((all, claim) => [
            ...all,
            {
                name: claim.name,
                type: claim.filter.type,
                value: claim.filter.pattern || claim.filter.value || claim.filter.enum
            }
        ], [])
    }, [claims]);


    const availableCredentials = useMemo(() => {
        return credentials.filter((credential) => {
            // Pre-compute claim keys for this credential to avoid repeated Object.keys() calls
            const credentialClaimKeys = credential.claims.map(claim => Object.keys(claim));
            
            const hasFields = fields.every((field: any) => {
                if (field.name === 'iss' || field.name === "issuer") {
                    return credential.issuer.includes(field.value);
                }
                // Use pre-computed keys instead of calling Object.keys() in nested loops
                return credentialClaimKeys.some((keys) => keys.includes(field.name));
            })
            return hasFields;
        })
    }, [credentials, fields]);

    const onHandleAccept = useCallback(async () => {
        if (!agent || agentState !== SDK.Domain.Startable.State.RUNNING) {
            return;
        }
        if (!selectedCredential) {
            throw new Error("No credential selected");
        }
        try {
            setIsAccepting(true);
            await handlePresentationRequest(request, selectedCredential);
        } finally {
            setIsAccepting(false);
        }
    }, [agent, agentState, selectedCredential, handlePresentationRequest, request]);

    const onHandleReject = useCallback(async () => {
        if (dbState === 'loaded') {
            try {
                setIsRejecting(true);
                await deleteMessage(request);
                await loadMessages();
            } finally {
                setIsRejecting(false);
            }
        }
    }, [dbState, deleteMessage, request, loadMessages]);

    return <div className="bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
        <div className="p-4">

            <h2>Choose your Credential</h2>
            {
                availableCredentials.length === 0 ?
                    <>
                        <p>You have no credentials that match the request</p>
                        <button
                            className="mt-4 mx-2 bg-red-500 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={onHandleReject}
                            disabled={dbState !== 'loaded' || isRejecting}
                        >
                            {isRejecting ? 'Rejecting...' : 'Reject'}
                        </button>

                    </> :
                    <>

                        <select
                            value={selectedCredential?.id}
                            onChange={(e) => {
                                const credential = credentials.find((c) => c.id === e.target.value);
                                if (credential) {
                                    setSelectedCredential(credential);
                                }
                            }}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                        >
                            {availableCredentials.map((credential) => {
                                const credentialClaimKeys = credential.claims.reduce((allClaims, claim) => {
                                    const claimKeys = Object.keys(claim)
                                        .filter((key) => !['iss', 'sub', 'iat', 'jti'].includes(key))
                                        .map((key) => `${key}: ${claim[key].value}`)
                                        .slice(0, 2)
                                    return `${allClaims}${claimKeys.join(', ')}`
                                }, '')
                                return <option key={credential.id} value={credential.id}>
                                    Credential[{credential.credentialType}] {credentialClaimKeys} {credential.issuer.slice(0, 74)}
                                </option>
                            })}
                        </select>

                        <button
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={onHandleAccept}
                            disabled={!agent || agentState !== SDK.Domain.Startable.State.RUNNING || !selectedCredential || isAccepting || isRejecting}
                        >
                            {isAccepting ? 'Accepting...' : 'Accept'}
                        </button>
                        <button
                            className="mt-4 mx-2 bg-red-500 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={onHandleReject}
                            disabled={dbState !== 'loaded' || isAccepting || isRejecting}
                        >
                            {isRejecting ? 'Rejecting...' : 'Reject'}
                        </button>

                    </>




            }
        </div>
    </div>
}


function PresentationRequest({ message }: { message: SDK.Domain.Message }) {
    const { hasAnswered } = useMessageStatus(message);
    return hasAnswered ?
        <p>You already accepted this offer.</p> :
        <CredentialSelector request={message} />
}


function CredentialsPage() {
    const { peerDID, create: createPeerDID } = usePeerDID();
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { credentials, load: loadCredentials } = useCredentials();
    const [message, setMessage] = useState<SDK.Domain.Message | undefined>();
    const { state: agentState } = useAgent();

    useEffect(() => {
        const initializeCredentials = async () => {
            try {
                if (agentState === SDK.Domain.Startable.State.RUNNING) {
                    const oob = searchParams.get('oob');
                    if (oob) {
                        const decoded = base64.baseDecode(oob as string);
                        const message = SDK.Domain.Message.fromJson(Buffer.from(decoded).toString());
                        const attachment = message.attachments.at(0)?.payload;
                        const peerDID = await createPeerDID();
                        setMessage(SDK.Domain.Message.fromJson({
                            ...attachment,
                            from: message.from,
                            to: peerDID,
                        }));
                        router.replace(pathname);
                    }
                }
                await loadCredentials();
            } catch (error) {
                console.error('Error initializing credentials:', error);
                // Still try to load credentials even if OOB parsing fails
                try {
                    await loadCredentials();
                } catch (loadError) {
                    console.error('Error loading credentials:', loadError);
                }
            }
        };
        
        initializeCredentials();
    }, [searchParams, createPeerDID, router, pathname, agentState, loadCredentials]);


    return (
        <div className="max-w-6xl mx-auto">
            {message && (
                <div className="mb-6">
                    {
                        message.piuri === SDK.ProtocolType.DidcommOfferCredential && <CredentialOffer message={message} onReject={() => {
                            setMessage(undefined);
                        }} />

                    }

                    {
                        message.piuri === SDK.ProtocolType.DidcommRequestPresentation && <PresentationRequest message={message} />
                    }
                </div>
            )}

            {credentials.length > 0 ? (
                <div className="space-y-6">
                    {/* Credentials count */}
                    <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                            <p className="text-green-800 dark:text-green-400 font-medium">
                                You have {credentials.length} verified credential{credentials.length > 1 ? 's' : ''} in your wallet
                            </p>
                        </div>
                    </div>

                    {/* Credentials list */}
                    <div className="bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-lg">
                        {credentials.map((credential, index) => (
                            <div key={index} className="border-b border-gray-200 dark:border-gray-800 last:border-b-0">
                                <Credential credential={credential} />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20 p-12 rounded-2xl border border-teal-200 dark:border-teal-800 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-green-100 dark:from-teal-900/50 dark:to-green-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <CreditCard className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                        No Credentials Yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                        Request credentials from trusted issuers to start building your verified digital identity portfolio.
                    </p>
                    <div className="bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg p-6 rounded-xl border border-gray-200 dark:border-gray-700 max-w-md mx-auto shadow-lg">
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-2">How to get credentials:</h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 text-left">
                            <li>• Connect with credential issuers</li>
                            <li>• Respond to credential offers</li>
                            <li>• Complete verification processes</li>
                            <li>• Accept issued credentials</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}


export default withLayout(CredentialsPage, {
    title: "Credentials",
    description: "Manage your verifiable credentials and digital attestations",
    pageHeader: true,
    icon: <CreditCard className="w-5 h-5" />
}); 