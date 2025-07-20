import { useEffect, useState, useRef } from "react";
import { useDatabase, usePrismDID } from "@trust0/identus-react/hooks";
import { DIDAlias, GroupedDIDs } from "@/utils/types";

interface DIDSelectorProps {
    onSelectDID: (didItem: DIDAlias | null) => void;
    selectedDID?: string;
    label?: string;
    className?: string;
}

export function DIDSelector({
    onSelectDID,
    selectedDID,
    label = "Select a DID",
    className = ""
}: DIDSelectorProps) {
    const { create } = usePrismDID()
    const { db, getGroupedDIDs } = useDatabase();
    const [groupedDIDs, setGroupedDIDs] = useState<GroupedDIDs>({});
    const [error, setError] = useState<string | null>(null);
    const [flatDIDs, setFlatDIDs] = useState<DIDAlias[]>([]);
    const [initialSelectionDone, setInitialSelectionDone] = useState(false);
    
    // Store the callback in a ref to avoid re-running effect when callback changes
    const onSelectDIDRef = useRef(onSelectDID);
    onSelectDIDRef.current = onSelectDID;

    useEffect(() => {
        if (db) {
            getGroupedDIDs()
                .then(({ prism = [], ...dids }) => {
                    const groupedData = {
                        ...dids,
                        publishedPrismDIDs: prism.filter(did => did.status === 'published'),
                        unpublishedPrismDIDs: prism.filter(did => did.status !== 'published')
                    };
                    setGroupedDIDs(groupedData);

                    // Create a flat list of all DIDs for easier selection
                    const allDIDs = Object.values(groupedData).flat();
                    setFlatDIDs(allDIDs);

                    // If selectedDID is provided and we haven't done initial selection yet,
                    // find and select the matching DID
                    if (selectedDID && !initialSelectionDone) {
                        const matchingDID = allDIDs.find(
                            didItem => didItem.did.toString() === selectedDID
                        );
                        if (matchingDID) {
                            onSelectDIDRef.current(matchingDID);
                        }
                        setInitialSelectionDone(true);
                    }
                })
                .catch((err) => {
                    setError(err.message);
                })
        }
    }, [db, initialSelectionDone, selectedDID, getGroupedDIDs]);

    const handleDIDChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const didString = event.target.value;
        if (didString === "") {
            onSelectDID(null);
            return;
        }

        const selectedDIDItem = flatDIDs.find(
            didItem => didItem.did.toString() === didString
        );

        if (selectedDIDItem) {
            onSelectDID(selectedDIDItem);
        }
    };

    const hasAnyDIDs = flatDIDs.length > 0;

    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {label}
            </label>

            {error ? (
                <div className="text-sm text-red-500">{error}</div>
            ) : !hasAnyDIDs ? (
                <div className="text-sm text-gray-500 dark:text-gray-400 mx-auto">
                    No DIDs available
                    <button className="ml-2 px-3 py-1.5 text-sm bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50  "

                    onClick={async () => {
                        try {
                            await create("Issuance DID");
                            // Reload DIDs after creation
                            const { prism = [], ...dids } = await getGroupedDIDs();
                            const groupedData = {
                                ...dids,
                                publishedPrismDIDs: prism.filter(did => did.status === 'published'),
                                unpublishedPrismDIDs: prism.filter(did => did.status !== 'published')
                            };
                            setGroupedDIDs(groupedData);
                            setFlatDIDs(Object.values(groupedData).flat());
                        } catch (err: any) {
                            setError(err.message);
                        }
                    }}>
                        Create
                    </button>
                    </div>
            ) : (
                <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-teal-500 focus:border-teal-500"
                    onChange={handleDIDChange}
                    value={selectedDID || ""}
                >
                    <option value="">Select a DID</option>

                    {Object.entries(groupedDIDs).map(([method, dids]) =>
                        dids.length > 0 && (
                            <optgroup key={`${method}-group`} label={`${method === 'publishedPrismDIDs' ? 'Published' : 'Unpublished'} DIDs`}>
                                {dids.map((didItem) => (
                                    <option
                                        key={didItem.did.toString()}
                                        value={didItem.did.toString()}
                                    >
                                     {didItem.status} - {didItem.alias} - {didItem.did.toString().slice(0,74) + '...'}
                                    </option>
                                ))}
                            </optgroup>
                        )
                    )}
                </select>
            )}
        </div>
    );
} 