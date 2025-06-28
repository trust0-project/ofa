import { OOB } from "@/components/OOB";
import { useConnections } from "@trust0/identus-react/hooks";
import withLayout from "@/components/withLayout";
import { getLayoutProps } from "@/components/withLayout";

export const getServerSideProps = getLayoutProps;
function ConnectionsPage() {
    const { connections } = useConnections();
    return (
       
            <div className="bg-background-light dark:bg-background-dark hadow-sm">
                <OOB />
                {
                    connections.length <= 0 ?
                        <p className=" text-lg font-normal text-gray-500 lg:text-xl  dark:text-gray-400">
                            No connections.
                        </p>
                        :
                        null
                }
                {
                    connections.map((connection, i) => {
                        return <p key={`connection${i}`} className="my-5 overflow-x-auto h-auto text-lg font-normal text-gray-500 lg:text-xl  dark:text-gray-400">
                            {connection.name}
                        </p>
                    })
                }
            </div>
       
    );
} 


export default withLayout(ConnectionsPage, {
    title: "Connections",
    description: "Manage your connections with other agents and services",
    pageHeader: true
}); 