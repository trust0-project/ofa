import SDK from "@hyperledger/identus-sdk";
import React from "react";
import { useAgent, useConnections } from "@trust0/identus-react/hooks";

interface ErrorState {
    oob?: string;
    alias?: string;
    general?: string;
}

export const OOB: React.FC = () => {
    const { agent } = useAgent();
    const { connections } = useConnections();
    const [oob, setOOB] = React.useState<string>("");
    const [alias, setAlias] = React.useState<string>("");
    const [connectionStatus, setConnectionStatus] = React.useState<{ success: boolean; message: string } | null>(null);
    const [errors, setErrors] = React.useState<ErrorState>({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const validateFields = (): boolean => {
        const newErrors: ErrorState = {};

        if (!oob.trim()) {
            newErrors.oob = "OOB invitation or DID is required";
        } else {
            try {
                SDK.Domain.DID.fromString(oob);
            } catch {
                try {
                    new URL(oob);
                } catch {
                    newErrors.oob = "Invalid OOB invitation or DID format";
                }
            }
        }

        if (alias && alias.length > 50) {
            newErrors.alias = "Alias must be less than 50 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "oob") {
            setOOB(value);
            if (errors.oob) {
                setErrors(prev => ({ ...prev, oob: undefined }));
            }
        } else if (name === "alias") {
            setAlias(value);
            if (errors.alias) {
                setErrors(prev => ({ ...prev, alias: undefined }));
            }
        }
    };

    async function onConnectionHandleClick() {
        if (!validateFields()) {
            return;
        }
        if (!agent) {
            setErrors({ general: "Agent not initialized. Please start the agent first." });
            return;
        }
        setIsSubmitting(true);
        setErrors({});
        try {
            const parsed = await agent.parseOOBInvitation(new URL(oob));
            await agent.acceptInvitation(parsed, alias);
            setConnectionStatus({ success: true, message: "Connection established successfully!" });
        } catch (err) {
            if (!alias) {
                setErrors({ alias: "Alias is required for this connection type" });
                return;
            }
            try {
                const from = await agent.createNewPeerDID([], true);
                const resolved = await agent.castor.resolveDID(from.toString());
                const accept = resolved.services.reduce((_, service) => ([..._, ...service.serviceEndpoint.accept]), [] as any);
                const to = SDK.Domain.DID.fromString(oob);
                const message = new SDK.HandshakeRequest({ accept: accept }, from, to);
                await agent.sendMessage(message.makeMessage());
                setConnectionStatus({ success: true, message: "Connection established successfully!" });
                await agent.connections.add(new SDK.DIDCommConnection(from.toString(), to.toString(), alias));
            } catch (error) {
                setErrors({ general: "Failed to establish connection. Please try again." });
            }
        } finally {
            setOOB("");
            setAlias("");
            setIsSubmitting(false);
        }
    }

    const connection = connections.at(0);
    
    return (
        <div className="w-full space-y-6">
            {/* Connection Status */}
            {connectionStatus && (
                <div className={`p-3 rounded-lg border ${
                    connectionStatus.success 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
                }`}>
                    {connectionStatus.message}
                </div>
            )}
            
            {/* Existing Connection Info */}
            {!!connection && (
                <div className="bg-gray-50/50 dark:bg-gray-800/30 backdrop-blur-sm p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-800 dark:text-white">
                        Stored Connection: <span className="font-semibold">{connection.name}</span>
                    </p>
                </div>
            )}

            {/* Connection Form */}
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                        Accept OOB (Connections / Presentations)
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        This form helps you establish a connection with another entity, wallet or agent. It also allows accepting an out of band verification request, when a verifier is asking you to prove something without a pre-existing connection.
                    </p>
                </div>

                {errors.general && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg">
                        {errors.general}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label htmlFor="alias" className="block text-sm font-medium text-gray-800 dark:text-white mb-2">
                            Connection Name (Optional)
                        </label>
                        <input
                            id="alias"
                            name="alias"
                            className={`block p-3 w-full text-sm text-gray-800 dark:text-white bg-white dark:bg-gray-800 rounded-lg border ${errors.alias ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                                } focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400 transition-all duration-300`}
                            placeholder="Enter a name for this connection"
                            type="text"
                            value={alias}
                            onChange={handleOnChange}
                        />
                        {errors.alias && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.alias}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="oob" className="block text-sm font-medium text-gray-800 dark:text-white mb-2">
                            OOB Invitation or DID
                        </label>
                        <input
                            id="oob"
                            name="oob"
                            className={`block p-3 w-full text-sm text-gray-800 dark:text-white bg-white dark:bg-gray-800 rounded-lg border ${errors.oob ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                                } focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400 transition-all duration-300`}
                            placeholder="Paste out of band connection QRCode here or a DID"
                            type="text"
                            value={oob}
                            onChange={handleOnChange}
                        />
                        {errors.oob && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.oob}</p>
                        )}
                    </div>

                    <button
                        className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-3 bg-gradient-to-r from-teal-500 to-green-500 text-base font-medium text-white hover:from-teal-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                        onClick={onConnectionHandleClick}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Creating Connection..." : "Create Connection"}
                    </button>
                </div>
            </div>
        </div>
    );
};
