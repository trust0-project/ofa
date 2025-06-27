import { ErrorAlert } from "@/components/ErrorAlert";
import {  useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Message } from "@/components/Message";
import { useMessages } from "@trust0/identus-react/hooks";
import withLayout from "@/components/withLayout";

function MessageDetails() {
    const { messages, readMessage } = useMessages();
    const query = useSearchParams();
    const id = query.get("id");
    const [error, setError] = useState<string | null>(null);

    const message = messages.find((message) => message.message.id === id);

    useEffect(() => {
        if (message && !message.read) {
            readMessage(message.message);
        }
    }, [message, readMessage])

    if (!message) {
        return  <div className="bg-background-light dark:bg-background-dark hadow-sm">
            <ErrorAlert
                message={"Message not found"}
                onDismiss={() => setError(null)}
            />
        </div>
    }

    const msg = message.message;

    return <div className="bg-background-light dark:bg-background-dark hadow-sm">
            <div className="space-y-6">
                <Message message={msg} />

            </div>
        </div>
   
}


export default withLayout(MessageDetails, {
    title: "Message Details",
    description: "View detailed information about a message",
    pageHeader: true
}); 