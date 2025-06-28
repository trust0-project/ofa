import type React from "react";
import SDK from "@hyperledger/identus-sdk";
import { useEffect, useState } from "react";
import { useDatabase, usePeerDID, useCredentials } from "@trust0/identus-react/hooks";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import AgentRequire from "@/components/AgentRequire";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { base64 } from "multiformats/bases/base64";
import { Credential } from "@/components/Credential";
import { useAgent } from "@trust0/identus-react/hooks";
import withLayout from "@/components/withLayout";
import { OfferCredential } from "@/components/messages";
import { getLayoutProps } from "@/components/withLayout";

export const getServerSideProps = getLayoutProps;

function CredentialOffer({ message, onReject }: { message: SDK.Domain.Message, onReject: () => void }) {
    const { agent } = useAgent();
    if (!agent || agent.state !== SDK.Domain.Startable.State.RUNNING) {
        return <div className="p-4 rounded-md bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400">
            <p>Start the agent to process the Credential Offer</p>
        </div>
    }
    return <AgentRequire>
        <OfferCredential message={message} onReject={onReject} />
    </AgentRequire>
}

function CredentialsPage() {
    const { peerDID } = usePeerDID();
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [credentials, setCredentials] = useState<SDK.Domain.Credential[]>([]);
    const [message, setMessage] = useState<SDK.Domain.Message | undefined>();
    const { fetchCredentials } = useCredentials();
    useEffect(() => {
        if (peerDID) {
            const oob = searchParams.get('oob');
            if (oob) {
                const decoded = base64.baseDecode(oob as string);
                const message = SDK.Domain.Message.fromJson(Buffer.from(decoded).toString());
                const attachment = message.attachments.at(0)?.payload;
                setMessage(SDK.Domain.Message.fromJson({
                    ...attachment,
                    from: message.from,
                    to: peerDID,
                }));
                router.replace(pathname);
            }
        }
    }, [searchParams, peerDID, router, pathname]);

    useEffect(() => {
        fetchCredentials().then(setCredentials);
    }, [fetchCredentials]);

    return (
        <>
            {message && <CredentialOffer message={message} onReject={() => {
                setMessage(undefined);
            }} />}

            {credentials.length > 0 ? (
                <div className="mt-5">
                    {credentials.map((credential, index) => (
                        <Credential key={index} credential={credential} />
                    ))}
                </div>
            ) : (
                <div className="mt-5 bg-background-light dark:bg-background-dark hadow-sm">
                    <div className="border border-border-light dark:border-border-dark rounded-md bg-gray-50 dark:bg-gray-900">
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-lg mb-2">No credentials yet</p>
                            <p>Request credentials from issuers to start building your digital identity</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
} 


export default withLayout(CredentialsPage, {
    title: "Credentials",
    description: "Manage your verifiable credentials and digital attestations",
    pageHeader: true
}); 