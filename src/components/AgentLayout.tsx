import { useDatabase } from "@/hooks";
import SDK from "@hyperledger/identus-sdk";
import { WithAgentProvider } from "@trust0/identus-react";
import { ReactNode, useState, useEffect } from "react";
import Loading from "./Loading";

export function AgentLayout({ children }: { children: ReactNode }) {
    const [loaded, setLoaded] = useState(false);
    const { getSeed, getMediator, getResolverUrl, state } = useDatabase()

    const [seed, setSeed] = useState<SDK.Domain.Seed | null>(null);
    const [mediatorDID, setMediatorDID] = useState<SDK.Domain.DID | null>(null);
    const [resolverUrl, setResolverUrl] = useState<string>();

    useEffect(() => {
        async function load() {
            if (state === 'loaded') {
                const seed = await getSeed();
                const mediatorDID = await getMediator();
                const resolverUrl = await getResolverUrl();
                if (resolverUrl) {
                    setResolverUrl(resolverUrl);
                }
                setSeed(seed);
                setMediatorDID(mediatorDID);
                setLoaded(true);
            }
        }
        load();
    }, [getSeed, getMediator, getResolverUrl, state]);

    if (!loaded || !seed || !mediatorDID) {
        return <Loading />
    }
    return <WithAgentProvider
        seed={seed}
        resolverUrl={resolverUrl}
        mediatorDID={mediatorDID}>
        {children}
    </WithAgentProvider>
}