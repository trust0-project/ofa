import SDK from "@hyperledger/identus-sdk";
import { OEA } from "@hyperledger/identus-sdk/plugins/oea";
import { ArrowRight, CheckCircle, Clock, AlertCircle, Shield, FileText } from "lucide-react";
import { useMemo } from "react";
import { useRouter } from "next/router";
import { useMessageStatus } from "./utils";

export function PresentationRequest({ request: requestMessage }: { request: SDK.Domain.Message }) {
    const router = useRouter();
    const { hasResponse, hasAnswered } = useMessageStatus(requestMessage.id);
    const request = requestMessage.attachments.at(0)!.payload as OEA.PresentationRequest;
    const messageDirection = requestMessage.direction;
    
    // Derive status from hasResponse and hasAnswered
    const status = useMemo(() => {
        const isReceived = messageDirection === SDK.Domain.MessageDirection.RECEIVED;
        if (isReceived) {
            return hasAnswered ? 'answered' : 'pending';
        } else {
            return hasResponse ? 'received' : 'sent';
        }
    }, [hasResponse, hasAnswered, messageDirection]);

    const handleClick = () => {
        router.push(`/app/presentation-requests/${requestMessage.id}`);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'sent':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'received':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'answered':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
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
            case 'answered':
                return <CheckCircle className="w-3 h-3" />;
            default:
                return <AlertCircle className="w-3 h-3" />;
        }
    };

    // Get summary of required fields
    const getFieldsSummary = () => {
        // Collect all field names from all descriptors
        const allFieldNames: string[] = [];
        
        request.presentation_definition.input_descriptors.forEach(descriptor => {
            descriptor.constraints.fields.forEach(field => {
                if (field.name) {
                    allFieldNames.push(field.name);
                } else {
                    // If no name, show the last part of the path
                    const pathStr = field.path[field.path.length - 1] || 'Unknown field';
                    allFieldNames.push(pathStr.replace('$.', '').replace(/[\[\]']/g, ''));
                }
            });
        });
        
        if (allFieldNames.length === 0) {
            return 'No fields specified';
        }
        
        // Show first 3 field names, then truncate if more
        const displayFields = allFieldNames.slice(0, 3);
        const hasMore = allFieldNames.length > 3;
        
        return `${displayFields.join(', ')}${hasMore ? `, +${allFieldNames.length - 3} more` : ''}`;
    };

    return (
        <div 
            onClick={handleClick}
            className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-all duration-200 hover:shadow-md"
        >
            <div className="w-8 h-8 bg-gradient-to-br from-teal-100 to-green-100 dark:from-teal-900/50 dark:to-green-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        Presentation Request
                    </h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium gap-1 ${getStatusColor(status)} flex-shrink-0 ml-2`}>
                        {getStatusIcon(status)}
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span className="font-mono truncate">ID: {requestMessage.id}</span>
                </div>
                
                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                    <FileText className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">Required claims: {getFieldsSummary()}</span>
                </div>
            </div>

            <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
        </div>
    );
}
