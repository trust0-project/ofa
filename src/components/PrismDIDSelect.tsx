import { useEffect, useState } from "react";
import SDK from "@hyperledger/identus-sdk";
import { useDatabase, usePrismDID } from "@trust0/identus-react/hooks";




export function PrismDIDSelect({onChange}: {onChange: (did: SDK.Domain.DID) => void}) {
    const { db, getExtendedDIDs } = useDatabase();
    const { prismDID: selectedDID } = usePrismDID();
    const [dids, setDIDs] = useState<Pick<SDK.Domain.PrismDID, "did" | "alias">[]>([]);

    useEffect(() => {
        if (db) {
            getExtendedDIDs().then((dids) => {
                const data = dids.reduce<Pick<SDK.Domain.PrismDID, "did" | "alias">[]>((dids, prismDID) => {
                    if (prismDID.status === "published") {
                        const found = dids.find(d => d.did.toString() === prismDID.did.toString());
                        if (!found) {
                            dids.push({ did: prismDID.did, alias: prismDID.alias });
                        }
                    }
                    return dids
                }, [])
                return setDIDs(data)
            });
        }
    }, [db, getExtendedDIDs]);

    if (dids.length === 0) {
        return <div className="text-text-secondary-light dark:text-text-secondary-dark px-4 py-3">
            No DIDs found
        </div>
    }

    return <select
        value={selectedDID?.toString() ?? ""}
        onChange={(e) => onChange(SDK.Domain.DID.fromString(e.target.value))}
        className="block w-56 bg-input-background-light dark:bg-input-background-dark border border-input-border-light dark:border-input-border-dark rounded-md py-2 px-3 text-sm leading-tight focus:outline-none focus:ring-2 focus:ring-button-primary-light dark:focus:ring-button-primary-dark focus:border-button-primary-light dark:focus:border-button-primary-dark transition-colors duration-200"
    >
        {dids.map(({ did, alias }) => {
            const didString = did.toString();
            return <option key={didString} value={didString}>
                {alias ?? didString.slice(0, 5) + "..."}
            </option>
        })}
    </select>
}
