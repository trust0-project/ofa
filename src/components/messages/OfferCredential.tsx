import SDK from "@hyperledger/identus-sdk";
import { useAgent, useMessages } from "@trust0/identus-react/hooks";
import { useMessageStatus } from "./utils";
import { useCallback, useState } from "react";

export function OfferCredential(props: { message: SDK.Domain.Message, onReject?: () => void }) {
    const { message, onReject } = props;
    const { agent } = useAgent();
    const { deleteMessage, load: loadMessages } = useMessages();
    const { hasAnswered } = useMessageStatus(message);
    const [acceptBusy, setAcceptBusy] = useState(false);
    const [rejectBusy, setRejectBusy] = useState(false);
    const body = message.body;

    const onHandleAccept = useCallback(async function onHandleAccept(message: SDK.Domain.Message) {
        if (!agent) {
            throw new Error("Start the agent first");
        }
        setAcceptBusy(true);
        try {
            const credentialOffer = SDK.OfferCredential.fromMessage(message);
            const requestCredential = await agent.prepareRequestCredentialWithIssuer(credentialOffer);
            const requestMessage = requestCredential.makeMessage()
            await agent.send(requestMessage);
            await loadMessages();
        } catch (err) {
            console.log("continue after err", err);
        } finally {
            setAcceptBusy(false);
        }
    }, [agent, loadMessages]);

    const onHandleReject = useCallback(async function onHandleReject(message: SDK.Domain.Message) {
        if (!agent) {
            throw new Error("Start the agent first");
        }
        setRejectBusy(true);
        try {
            if (onReject) {
                onReject();
            } else {
                await deleteMessage(message);
                await loadMessages();
            }
        } finally {
            setRejectBusy(false);
        }
    }, [agent, onReject, deleteMessage, loadMessages]);
    
    return <div className="mt-3 md:mt-4 lg:mt-5 space-y-3 md:space-y-4 lg:space-y-5">
        <div className="border border-slate-200 rounded-lg p-3 md:p-4 lg:p-5 xl:p-6 bg-slate-50 dark:bg-slate-800 dark:border-slate-700">
            <div className="flex justify-between items-start mb-2 md:mb-3 lg:mb-4">
                <div className="flex-1">
                    <h4 className="text-base md:text-lg lg:text-xl xl:text-2xl font-medium text-slate-900 dark:text-slate-100">
                        Credential Offer
                    </h4>
                    {
                        hasAnswered ?    
                        <p className="text-sm md:text-base lg:text-lg text-green-600 dark:text-green-400 font-medium">You already accepted this credential offer.</p>
                        : <p className="text-sm md:text-base lg:text-lg text-slate-600 dark:text-slate-400">Issuer is offering you a Credential with the following claims:</p>
                    }
                    <div className="flex flex-wrap gap-2 md:gap-3 lg:gap-4 mt-1 md:mt-2 lg:mt-3">
                        {
                            body.credential_preview.body.attributes.map((field: { name: string, value: string }, i: number) => {
                                return (
                                    <div key={i} className="flex-auto min-w-fit">
                                        <span className="text-xs md:text-sm lg:text-base font-medium text-slate-600 dark:text-slate-400">{field.name}: </span>
                                        <p className="text-sm md:text-base lg:text-lg xl:text-xl font-normal text-slate-900 dark:text-slate-200 break-all inline">
                                            {field.value}
                                        </p>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </div>

            {!hasAnswered && (
                <div className="flex space-x-2 md:space-x-3 lg:space-x-4">
                    <button
                        disabled={acceptBusy || rejectBusy}
                        onClick={() => onHandleAccept(message)}
                        className={`flex-1 font-medium py-1.5 px-3 md:py-2 md:px-4 lg:py-3 lg:px-6 rounded-lg transition-all duration-200 text-sm md:text-base lg:text-lg ${
                            acceptBusy || rejectBusy
                                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                                : 'bg-emerald-500 hover:bg-emerald-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shadow-md hover:shadow-lg cursor-pointer'
                        }`}
                    >
                        {acceptBusy ? 'Accepting...' : 'Accept'}
                    </button>
                    <button
                        disabled={acceptBusy || rejectBusy}
                        onClick={() => onHandleReject(message)}
                        className={`flex-1 font-medium py-1.5 px-3 md:py-2 md:px-4 lg:py-3 lg:px-6 rounded-lg transition-all duration-200 text-sm md:text-base lg:text-lg ${
                            acceptBusy || rejectBusy
                                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                                : 'bg-red-500 hover:bg-red-600 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-md hover:shadow-lg cursor-pointer'
                        }`}
                    >
                        {rejectBusy ? 'Rejecting...' : 'Reject'}
                    </button>
                </div>
            )}
        </div>
    </div>
} 