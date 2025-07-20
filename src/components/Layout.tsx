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
import { PageProps } from './withLayout';
import SDK from '@hyperledger/identus-sdk';
import { BLOCKFROST_KEY_NAME } from '@/config';
import {Notifications} from './Notifications';

interface LayoutProps extends PageProps {
    children: ReactNode;
    title?: string;
    description?: string;
    pageHeader?: boolean;
    icon?: React.ReactNode;
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
    icon,
    isMediatorManaged,
    serverMediatorDID,
    serverResolverUrl,
    serverBlockfrostKey
}: LayoutProps) {
    const {
        getMediator,
        getSeed,
        getWallet,
        setMediator,
        setResolverUrl,
        storeSettingsByKey,
        state: dbState,
        error: dbError,
    } = useDatabase();

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

    useEffect(() => {
        if (dbState === "loaded") {
            if (serverMediatorDID) {
                setMediator(SDK.Domain.DID.fromString(serverMediatorDID));
            }
            if (serverResolverUrl) {
                setResolverUrl(serverResolverUrl);
            }
            if (serverBlockfrostKey) {
                storeSettingsByKey(BLOCKFROST_KEY_NAME, serverBlockfrostKey);
            }
        }
    }, [dbState, serverResolverUrl, serverMediatorDID,setResolverUrl, setMediator, serverBlockfrostKey, storeSettingsByKey])

    const currentMediator = useCallback(async () => {
        if (serverMediatorDID) {
            return serverMediatorDID;
        }
        return await getMediator();
    }, [serverMediatorDID, getMediator]);

    // Handle authentication routing when database is disconnected
    useEffect(() => {
        if (dbState === "disconnected" && currentRoute !== "/app/auth") {
            const fullUrl = getFullPath();
            setRedirectUrl(fullUrl);
            router.replace("/app/auth");
        }
    }, [dbState, currentRoute, getFullPath, setRedirectUrl, router]);

    // Handle database loaded state - routing and initialization
    useEffect(() => {
        async function initializeApp() {
            if (dbState === 'loaded' && !dbError) {
                const seed = await getSeed();
                
                // Route to mnemonics if no seed
                if (currentRoute !== "/app/mnemonics" && !seed) {
                    router.replace("/app/mnemonics");
                    return;
                }
                
                // Route to mediator if needed
                const storedMediatorDID = await currentMediator();
                if (currentRoute !== "/app/mediator" && seed && !storedMediatorDID && !isMediatorManaged) {
                    router.replace("/app/mediator");
                    return;
                }
                
                // Connect wallet if available
                const walletId = await getWallet();
                if (walletId) {
                    await connect(walletId);
                }
                
                // Initialize loaded state and start agent
                setTimeout(() => setLoaded(true), 100);
                await start();
            }
        }
        
        initializeApp();
    }, [dbState, dbError, getSeed, currentMediator, getWallet, connect, start, currentRoute, router, isMediatorManaged]);
    

    const navItems: NavigationItem[] = [
        { path: '/app', label: 'Dashboard' },
        { path: '/app/messages', label: 'Messages' },
        {
            label: 'Identity',
            children: [
                { path: '/app/credentials', label: 'Credentials' },
                { path: '/app/issuance-requests', label: 'Issue' },
                { path: '/app/presentation-requests', label: 'Verify' },

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
    if (!loaded) {
        return <Loading />
    }

    return <>
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
        </Head>
        <div className="flex flex-col h-screen bg-white dark:bg-[#0A0A0A] text-gray-800 dark:text-gray-200">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                            aria-label="Toggle menu"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div className="flex items-center gap-3">
                            <Image src="/logos/ofa-dark.svg" alt="Identus Logo" width={108} height={32} />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 lg:space-x-6">
                        {/* Notifications */}
                        <Notifications />
                        {/* Agent Controls Menu */}
                        <div className="relative flex items-center group">
                            <div
                                className={`absolute top-12 right-0 mt-1 w-80 bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg rounded-2xl shadow-xl z-20 border border-gray-200 dark:border-gray-800 transition-all duration-300 
                                ${agentControlsOpen ? 'opacity-100 visible' : 'opacity-0 invisible'} 
                                lg:group-hover:opacity-100 lg:group-hover:visible`}
                            >
                                <div className="py-2">
                                    <div className="flex px-4 py-3 border-b border-gray-200 dark:border-gray-800 justify-between items-center">
                                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Agent Controls</h3>
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
                                className="flex items-center justify-center p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-300 border border-gray-200 dark:border-gray-700"
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
                    fixed inset-y-0 left-0 z-30 w-64 bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg border-r border-gray-200 dark:border-gray-800 
                    transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}>
                    <nav className="mt-4 h-full overflow-y-auto">
                        <ul className="space-y-1 px-3">
                            {navItems.map((item, index) => (
                                <li key={isNavGroup(item) ? `group-${index}` : `item-${index}`}>
                                    {isNavGroup(item) ? (
                                        <div className="mb-4">
                                            <div className="px-3 py-2">
                                                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{item.label}</h3>
                                            </div>
                                            <ul className="space-y-1">
                                                {item.children.map((child, childIndex) => (
                                                    <li key={`${item.label}-${childIndex}`}>
                                                        <Link
                                                            href={child.path}
                                                            className={`flex items-center px-3 py-2.5 text-sm rounded-xl transition-all duration-300 ${currentRoute === child.path
                                                                ? 'bg-gradient-to-r from-teal-50 to-green-50 dark:from-teal-900/30 dark:to-green-900/30 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 shadow-sm'
                                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:-translate-y-0.5 hover:shadow-sm'
                                                            }`}
                                                        >
                                                            {child.label}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <Link
                                            href={item.path}
                                            className={`flex items-center px-3 py-2.5 text-sm rounded-xl transition-all duration-300 ${currentRoute === item.path
                                                ? 'bg-gradient-to-r from-teal-50 to-green-50 dark:from-teal-900/30 dark:to-green-900/30 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 shadow-sm'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:-translate-y-0.5 hover:shadow-sm'
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
                <main className="flex-1 p-4 lg:p-8 overflow-y-auto bg-gray-50/50 dark:bg-gray-950/50">
                    {
                        pageHeader && (
                            <PageHeader
                                title={title}
                                description={description}
                                icon={icon}
                            />
                        )
                    }
                        {children}
                </main>
            </div>
        </div>
    </>
}