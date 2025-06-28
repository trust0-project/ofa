import React, { useEffect, useState } from "react";
import { useAgent, usePeerDID, usePrismDID } from "@trust0/identus-react/hooks";
import SDK from "@hyperledger/identus-sdk";

export function PeerDIDCopy({type}: {type: 'peerDID' | 'prismDID'}) {
    const { state} = useAgent();

    const { peerDID, create: createPeerDID } = usePeerDID();
    const { prismDID, create: createPrismDID } = usePrismDID();
    const [showCopyFeedback, setShowCopyFeedback] = useState(false);

    useEffect(() => {
        if (state === SDK.Domain.Startable.State.RUNNING && !peerDID) {
            if (type === 'peerDID') {
                createPeerDID();
            } else {
                createPrismDID('did');
            }
        }
    }, [state, createPeerDID, createPrismDID, peerDID, prismDID, type]);

    if (peerDID) {
        return <button
            onClick={() => {
                navigator.clipboard.writeText(peerDID.toString());
                setShowCopyFeedback(true);
                setTimeout(() => setShowCopyFeedback(false), 2000);
            }}
            className={`text-xs sm:text-sm text-teal-500 transition-transform duration-300 flex items-center gap-2 ${showCopyFeedback ? 'text-green-500' : ''}`}
        >
            {showCopyFeedback ? (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Copied!
                </>
            ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                    Copy {type === 'peerDID' ? 'Peer DID' : 'Prism DID'}
                </>
            )}
        </button>
    }

    return null
}