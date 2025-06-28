'use client';

import { ReactNode, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { WalletSelect } from './WalletSelect';
import { AgentStart } from './AgentStart';
import Image from 'next/image';
import Head from 'next/head';
import PageHeader from './PageHeader';
import { useWallet } from '@meshsdk/react';
import Loading from './Loading';
import { AgentGaugeSVG } from './AgentGaugeSVG';
import { PeerDIDCopy } from './PeerDIDCopy';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAgent, useDatabase, useMessages } from '@trust0/identus-react/hooks';
import { useRouter as useCustomRouter } from '@/hooks';
import { getLayoutProps, PageProps } from './withLayout';
import SDK from '@hyperledger/identus-sdk';

interface LayoutProps extends PageProps {
    children: ReactNode;
    title?: string;
    description?: string;
    pageHeader?: boolean;
}

interface NavItem {
    path: string;
    label: string;
}

interface NavGroup {
    label: string;
    children: NavItem[];
}

type NavigationItem = NavItem | NavGroup;




const DEFAULT_TITLE = 'Hyperledger Identus Agent';
const DEFAULT_DESCRIPTION = 'Dashboard for managing your self-sovereign identity';



export default function Layout({
    children,
    title = DEFAULT_TITLE,
    description = DEFAULT_DESCRIPTION,
    pageHeader = true,
    isMediatorManaged,
    serverMediatorDID,
}: LayoutProps) {
    const {
        getMediator,
        getSeed,
        getWallet,
        setMediator,
        state: dbState,
        error: dbError,
    } = useDatabase();

    const {unreadMessages} = useMessages();

    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [agentControlsOpen, setAgentControlsOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();
    const [loaded, setLoaded] = useState<boolean>(false);
    const { connect } = useWallet();
    const searchParams = useSearchParams();
    const { setRedirectUrl } = useCustomRouter();

    const currentRoute = usePathname();
    const {start} = useAgent();
    
    // Get the full URL path including search parameters (equivalent to router.asPath)
    const getFullPath = useCallback(() => {
        const search = searchParams.toString();
        return search ? `${currentRoute}?${search}` : currentRoute;
    }, [currentRoute, searchParams]);

    // Close sidebar when route changes
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [currentRoute]);

    const currentMediator = useCallback(async () => {
        if (serverMediatorDID) {
            await setMediator(SDK.Domain.DID.fromString(serverMediatorDID));
            return serverMediatorDID;
        }
        return await getMediator();
    }, [serverMediatorDID, getMediator, setMediator]);

    useEffect(() => {
        async function load() {
            if (dbState === "disconnected") {
                if (currentRoute !== "/app/auth") {
                    const fullUrl = getFullPath();
                    setRedirectUrl(fullUrl);
                }
                if (currentRoute !== "/app/auth") {
                    router.replace("/app/auth");
                    return 
                }
            } else if (dbState === 'loaded' && !dbError) {
                const seed = await getSeed();
                if (currentRoute !== "/app/mnemonics" && !seed) {
                    router.replace("/app/mnemonics");
                    return
                }
                const storedMediatorDID = await currentMediator();
                if (currentRoute !== "/app/mediator" && seed && !storedMediatorDID && !isMediatorManaged) {
                    router.replace("/app/mediator");
                    return
                }
                const walletId = await getWallet();
                if (walletId) {
                    await connect(walletId);
                }
                setTimeout(() => setLoaded(true), 100)
                await start();      
            }
        }
        load()
    }, [dbState, dbError, getMediator, getSeed, getWallet, connect, router, currentRoute, getFullPath, setRedirectUrl, start, isMediatorManaged, currentMediator]);
    

    const navItems: NavigationItem[] = [
        { path: '/app', label: 'Home' },
        { path: '/app/messages', label: 'Messages' },
        {
            label: 'Identity',
            children: [
                { path: '/app/credentials', label: 'Credentials' },
                { path: '/app/issuance-requests', label: 'Issue Credentials' },
                { path: '#', label: 'Verify Credentials' },

            ]
        },
        {
            label: 'Manage',
            children: [
                { path: '/app/dids', label: 'DIDs' },
                { path: '/app/connections', label: 'Connections' },
                { path: '/app/settings', label: 'Settings' },
            ]
        }
    ];

    const isNavGroup = (item: NavigationItem): item is NavGroup => 'children' in item;
    // eslint-disable-next-line prefer-const
    if (!loaded) {
        return <Loading />
    }

    return <>
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
        </Head>
            <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
                {/* Header */}
                <header className="border-b border-border-light dark:border-border-dark shadow-sm">
                    <div className="px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {/* Mobile menu button */}
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                aria-label="Toggle menu"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <div className="bg-gray-50 rounded-full p-2">
                                <Image src="/identus-navbar-light.png" alt="Identus Logo" width={64} height={64} className="w-16" />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 lg:space-x-6">
                            {/* Notifications */}
                            <div className="relative flex items-center group">
                                <div
                                    className={`absolute top-10 right-0 mt-1 w-80 bg-background-light dark:bg-background-dark rounded-md shadow-lg z-20 border border-border-light dark:border-border-dark transition-all duration-200 
                                    ${notificationsOpen ? 'opacity-100 visible' : 'opacity-0 invisible'} 
                                    lg:group-hover:opacity-100 lg:group-hover:visible`}
                                >
                                    <div className="py-2">
                                        <div className="px-4 py-2 border-b border-border-light dark:border-border-dark">
                                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Notifications</h3>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {unreadMessages.length > 0 ? (
                                                <div>
                                                    {unreadMessages.map((notification) => {
                                                        return <div
                                                            key={`header-notification-${notification.uuid}`}
                                                            className={`px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700}`}
                                                        >
                                                            <p onClick={() => {
                                                                router.push(`/app/messages/${notification.id}`);
                                                            }} className="text-sm text-gray-700 dark:text-gray-300">{notification.piuri}</p>
                                                        </div>
                                                    })}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500 dark:text-gray-400 px-4 py-3">No notifications</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                                    className="flex items-center justify-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 border border-gray-300 dark:border-gray-600"
                                    aria-label="Notifications"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    {unreadMessages.length > 0 && (
                                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                                            {unreadMessages.length}
                                        </span>
                                    )}
                                </button>
                            </div>
                            {/* Agent Controls Menu */}
                            <div className="relative flex items-center group">
                                <div
                                    className={`absolute top-10 right-0 mt-1 w-80 bg-background-light dark:bg-background-dark rounded-md shadow-lg z-20 border border-border-light dark:border-border-dark transition-all duration-200 
                                    ${agentControlsOpen ? 'opacity-100 visible' : 'opacity-0 invisible'} 
                                    lg:group-hover:opacity-100 lg:group-hover:visible`}
                                >
                                    <div className="py-2">
                                        <div className="flex px-4 py-2 border-b border-border-light dark:border-border-dark justify-between items-center">
                                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Agent Controls</h3>
                                            <PeerDIDCopy type="peerDID" />
                                        </div>
                                        <div className="p-4 space-y-4">
                                            <div className="flex flex-col items-end">
                                                <AgentStart />
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <WalletSelect />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setAgentControlsOpen(!agentControlsOpen)}
                                    className="flex items-center justify-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 border border-gray-300 dark:border-gray-600"
                                    aria-label="Agent Controls"
                                >
                                    <AgentGaugeSVG />
                                </button>
                            </div>

                        </div>
                    </div>
                </header>
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <aside className={`
                        fixed inset-y-0 left-0 z-30 w-64 bg-background-light dark:bg-background-dark border-r border-border-light dark:border-border-dark 
                        transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    `}>
                        <nav className="mt-4 h-full overflow-y-auto">
                            <ul>
                                {navItems.map((item, index) => (
                                    <li key={isNavGroup(item) ? `group-${index}` : `item-${index}`}>
                                        {isNavGroup(item) ? (
                                            <>
                                                <div className="px-4 py-2 border-b border-border-light dark:border-border-dark">
                                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">{item.label}</h3>
                                                </div>
                                                <ul>
                                                    {item.children.map((child, childIndex) => (
                                                        <li key={`${item.label}-${childIndex}`}>
                                                            <Link
                                                                href={child.path}
                                                                className={`text-sm px-4 py-2 block ${currentRoute === child.path
                                                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                                    }`}
                                                            >
                                                                {child.label}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </>
                                        ) : (
                                            <Link
                                                href={item.path}
                                                className={`text-sm px-4 py-2 block ${currentRoute === item.path
                                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                    }`}
                                            >
                                                {item.label}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </aside>
                    {/* Main content */}
                    <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                        {
                            pageHeader && (
                                <PageHeader
                                    title={title}
                                    description={description}
                                />
                            )
                        }
                            {children}
                    </main>
                </div>
            </div>

    </>
}