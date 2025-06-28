import { OOB } from "@/components/OOB";
import withLayout from "@/components/withLayout";
import { getLayoutProps } from "@/components/withLayout";
import { useRouter } from "next/navigation";
import { 
  Users, 
  ArrowLeft,
  Shield,
  Zap
} from "lucide-react";

export const getServerSideProps = getLayoutProps;

function CreateConnectionPage() {
    const router = useRouter();

    return (
        <div className="max-w-7xl mx-auto">
                <div className="bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20 p-12 rounded-2xl border border-teal-200 dark:border-teal-800 text-center">

                {/* OOB Component */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                        Generate Connection Invitation
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Create a secure out-of-band invitation that can be shared with another agent to establish a connection.
                    </p>
                    <OOB />
                </div>

                {/* Actions */}
                <div className="flex justify-start">
                    <button
                        onClick={() => router.back()}
                        className="group inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 rounded-full font-medium hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-600"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                        Back to Connections
                    </button>
                </div>
            </div>
        </div>
    );
}

export default withLayout(CreateConnectionPage, {
    title: "Create Connection",
    description: "Create a new secure connection with another agent",
    pageHeader: true,
    icon: <Users className="w-5 h-5" />
}); 