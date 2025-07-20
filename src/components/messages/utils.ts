import { useMessages } from "@trust0/identus-react/hooks";
import SDK from "@hyperledger/identus-sdk";
import { useMemo } from "react";

export function useMessageStatus(message: SDK.Domain.Message | string) {
    const { 
      messages
    } = useMessages();

    const thid = typeof message === 'string' ? message : message.thid

    // Optimize by computing both hasResponse and hasAnswered in a single pass
    const { hasResponse, hasAnswered } = useMemo(() => {
        let receivedCount = 0;
        let sentCount = 0;

        // Single pass through messages to count both directions
        for (const {message: m} of messages) {
            if (m.thid === thid) {
                if (m.direction === SDK.Domain.MessageDirection.RECEIVED) {
                    receivedCount++;
                } else if (m.direction === SDK.Domain.MessageDirection.SENT) {
                    sentCount++;
                }
            }
        }

        return {
            hasResponse: receivedCount > 0,
            hasAnswered: sentCount > 0,
        };
    }, [messages, thid]);
    
    return {
        hasResponse,
        hasAnswered,
    };
}