import { useEffect, useState } from "react";
import { useMessages } from "@trust0/identus-react/hooks";
import { useRouter } from "next/navigation";
import SDK from '@hyperledger/identus-sdk';









export function Notifications() {
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const router = useRouter();
    const { unreadMessages } = useMessages();


    const [messages, setMessages] = useState<SDK.Domain.Message[]>([]);

    useEffect(() => {
        const messages = unreadMessages.map((message) => message);
        setMessages(messages);
    }, [unreadMessages]);

    return <div className="relative flex items-center group">
    <div
        className={`absolute top-12 right-0 mt-1 w-80 bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg rounded-2xl shadow-xl z-20 border border-gray-200 dark:border-gray-800 transition-all duration-300 
        ${notificationsOpen ? 'opacity-100 visible' : 'opacity-0 invisible'} 
        lg:group-hover:opacity-100 lg:group-hover:visible`}
    >
        <div className="py-2">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {messages.length > 0 ? (
                    <div>
                        {messages.map((notification) => {
                            return <div
                                key={`header-notification-${notification.uuid}`}
                                className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 cursor-pointer"
                                onClick={() => {
                                    router.push(`/app/messages/${notification.id}`);
                                }}
                            >
                                <p className="text-sm text-gray-900 dark:text-white font-medium">{notification.piuri}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Click to view message</p>
                            </div>
                        })}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 px-4 py-3">No new notifications</p>
                )}
            </div>
        </div>
    </div>
    <button
        onClick={() => setNotificationsOpen(!notificationsOpen)}
        className="relative flex items-center justify-center p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-300 border border-gray-200 dark:border-gray-700"
        aria-label="Notifications"
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadMessages.length > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white bg-gradient-to-r from-teal-500 to-green-500 rounded-full">
                {unreadMessages.length}
            </span>
        )}
    </button>
</div>
}