import { useState } from 'react';
import encodeQR from 'qr';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { base64 } from 'multiformats/bases/base64'
interface QRCodeDisplayProps {
    oob: string;
}

export default function QRCodeDisplay({ oob }: QRCodeDisplayProps) {
    const [copied, setCopied] = useState(false);
    const qrSvg = encodeQR(oob, 'svg', { version: 40 });
    const encoded = `${window.location.origin}/app/credentials?oob=${base64.baseEncode(Buffer.from(oob))}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(encoded);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="space-y-4">
            <div className="w-full bg-white/95  p-4 rounded-lg flex items-center justify-center shadow-lg border border-gray-200 dark:border-gray-800">
                <div dangerouslySetInnerHTML={{ __html: qrSvg }} className="w-full h-full" />
            </div>

            <div className="flex items-center space-x-2">
                <code className="flex-1 p-2 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded text-sm overflow-x-auto text-gray-800 dark:text-gray-200">
                    {encoded}
                </code>
                <button
                    onClick={handleCopy}
                    className="px-3 py-2 bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 shadow-lg hover:shadow-xl"
                >
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
        </div>
    );
} 