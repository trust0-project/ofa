import SDK from "@hyperledger/identus-sdk";
import { useDatabase, useMessages } from "@trust0/identus-react/hooks";
import { AlertCircle, Plus, QrCode, Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PresentationRequest } from "@/components/messages/PresentationRequest";
import OOBCode from "@/components/OOBCode";
import withLayout, { getLayoutProps } from "@/components/withLayout";

export const getServerSideProps = getLayoutProps;

function PresentationRequestsPage() {
	const { error: dbError } = useDatabase();
	const [presentationRequests, setPresentationRequests] = useState<
		SDK.RequestPresentation[]
	>([]);
	const [error, setError] = useState<string | null>(null);
	const [showPopup, setShowPopup] = useState(false);
	const [oob, setOob] = useState<string | null>(null);

	const { sentMessages } = useMessages();

	useEffect(() => {
		const pre = sentMessages.filter(
			({ piuri }) => piuri === SDK.ProtocolType.DidcommRequestPresentation,
		);
		setPresentationRequests(
			pre.map((m) => {
				return new SDK.RequestPresentation(
					m.body,
					m.attachments,
					m.from!,
					m.to!,
					m.thid,
					m.id,
				);
			}),
		);
	}, [sentMessages]);

	const closePopup = () => {
		setShowPopup(false);
		setOob(null);
	};

	return (
		<div className="max-w-6xl mx-auto">
			{error && (
				<div className="mb-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800">
					<div className="flex items-center gap-3">
						<AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
						<div>
							<p className="text-red-800 dark:text-red-400 font-medium">
								{error}
							</p>
							{dbError && (
								<p className="text-sm text-red-600 dark:text-red-400 mt-1">
									Database error: {dbError.message}
								</p>
							)}
						</div>
					</div>
				</div>
			)}

			{presentationRequests.length === 0 ? (
				<div className="space-y-6">
					<div className="p-6">
						<div className="flex items-center justify-between">
							<div></div>
							<Link
								href="/app/presentation-requests/create"
								className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
							>
								<Plus className="w-4 h-4" />
								New Request
							</Link>
						</div>
					</div>
					<div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-12 rounded-2xl border border-blue-200 dark:border-blue-800 text-center">
						<div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
							<Search className="w-8 h-8 text-blue-600 dark:text-blue-400" />
						</div>
						<h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
							No Presentation Requests Yet
						</h3>
						<p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
							Create your first presentation request to start verifying
							credentials from holders.
						</p>
						<div className="bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg p-6 rounded-xl border border-gray-200 dark:border-gray-700 max-w-md mx-auto shadow-lg">
							<h4 className="font-semibold text-gray-800 dark:text-white mb-2">
								Verification benefits:
							</h4>
							<ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 text-left">
								<li>• Verify credential authenticity</li>
								<li>• Request specific claims</li>
								<li>• Trust specific issuers</li>
								<li>• QR code verification</li>
							</ul>
						</div>
					</div>
				</div>
			) : (
				<div className="space-y-6">
					<div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
								<p className="text-blue-800 dark:text-blue-300 font-medium">
									Create a new presentation request
								</p>
							</div>
							<Link
								href="/app/presentation-requests/create"
								className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
							>
								<Plus className="w-3 h-3" />
								Create
							</Link>
						</div>
					</div>
					<div className="bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-lg">
						{presentationRequests.map((request) => {
							return (
								<div
									key={request.id}
									className="group border-b border-gray-200 dark:border-gray-800 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all duration-300"
								>
									<Link
										href={`/app/presentation-requests/${request.id}`}
										className="block p-6"
									>
										<PresentationRequest request={request.makeMessage()} />
									</Link>
								</div>
							);
						})}
					</div>
				</div>
			)}
			{showPopup && oob && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
					<div className="relative w-full max-w-md bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800">
						<div className="p-6">
							<button
								type="button"
								onClick={closePopup}
								className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-300"
								aria-label="Close"
							>
								<X className="w-5 h-5" />
							</button>

							<div className="mb-6">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-lg flex items-center justify-center">
										<QrCode className="w-4 h-4 text-blue-600 dark:text-blue-400" />
									</div>
									<h3 className="text-xl font-semibold text-gray-800 dark:text-white">
										Presentation Request
									</h3>
								</div>
							</div>

							<div className="p-4">
								<OOBCode code={oob} type="presentation" />
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default withLayout(PresentationRequestsPage, {
	title: "Presentation Requests",
	description: "Manage your credential presentation requests and verification",
	pageHeader: true,
	icon: <Search className="w-5 h-5" />,
});
