import React, { useEffect, useState } from 'react';
import SDK from '@hyperledger/identus-sdk';
import Loading from './Loading';
import { useWallet } from "@meshsdk/react";
import { usePathname, useRouter } from 'next/navigation';
import { useDatabase } from '@trust0/identus-react/hooks';

interface RequireDBProps {
    children: React.ReactNode;
}


export default function AgentRequire({ children }: RequireDBProps) {
    const { getMediator, getSeed, getWallet, state: dbState, db, error: dbError } = useDatabase();
    const router = useRouter();
    const [loaded, setLoaded] = useState<boolean>(false);
    const [mediatorDID, setMediatorDID] = useState<SDK.Domain.DID | null>(null);
    const { connect } = useWallet();

    const currentRoute = usePathname();
    useEffect(() => {
        async function load() {
            try {
                if (dbState === 'loaded' && !dbError) {
                    const seed = await getSeed();
                    if (currentRoute !== "/app/mnemonics" && !seed) {
                        router.replace("/app/mnemonics");
                        return
                    }
                    const storedMediatorDID = await getMediator();
                    if (currentRoute !== "/app/mediator" && seed && !storedMediatorDID) {
                        router.replace("/app/mediator");
                        return
                    }
                    const walletId = await getWallet();
                    if (walletId) {
                        await connect(walletId);
                    }
                    if (storedMediatorDID) {
                        setMediatorDID(storedMediatorDID);
                    }
                }
                setLoaded(true);
            } catch (error) {
                console.error('Error during agent initialization:', error);
                // Still set loaded to true to prevent infinite loading state
                setLoaded(true);
            }
        }
        load();
    }, [dbState, dbError, currentRoute, getMediator, getSeed, getWallet, connect, router]);

    return children
} 