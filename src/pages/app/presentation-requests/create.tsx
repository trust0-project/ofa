/* eslint-disable @typescript-eslint/ban-ts-comment */

import SDK from "@hyperledger/identus-sdk";
import {
	useDatabase,
	useHolder,
	useMessages,
	usePeerDID,
	useVerifier,
} from "@trust0/identus-react/hooks";
import { AnimatePresence, motion } from "framer-motion";
import {
	AlertCircle,
	Loader,
	Plus,
	Search,
	Shield,
	Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import {
	DragDropContext,
	Draggable,
	type DraggableProvided,
	Droppable,
	type DropResult,
} from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import OOBCode from "@/components/OOBCode";
import QRCodeDisplay from "@/components/QRCodeDisplay";
import withLayout, { getLayoutProps } from "@/components/withLayout";
import type { DIDAlias } from "@/utils/types";

type Claim = {
	id: string;
	name: string;
	value: string;
};

type ClaimTemplate = {
	name: string;
	claims: Omit<Claim, "id">[];
};

const claimTemplates: ClaimTemplate[] = [
	{
		name: "Identity Verification",
		claims: [
			{ name: "firstName", value: "John" },
			{ name: "lastName", value: "Doe" },
			{ name: "email", value: "john@example.com" },
		],
	},
	{
		name: "Age Verification",
		claims: [
			{ name: "dateOfBirth", value: "1990-01-01" },
			{ name: "age", value: "18" },
		],
	},
	{
		name: "Professional Credentials",
		claims: [
			{ name: "degree", value: "Bachelor of Science" },
			{ name: "institution", value: "University Name" },
			{ name: "graduationDate", value: "2020-05-15" },
		],
	},
];

export const getServerSideProps = getLayoutProps;

function CreatePresentationRequestPage() {
	const { db, error: dbError } = useDatabase();

	const router = useRouter();
	const [formData, setFormData] = useState({
		verifierDID: "",
		credentialFormat: SDK.Domain.CredentialType.SDJWT,
		trustIssuer: "",
		status: "pending",
	});
	const [claims, setClaims] = useState<Claim[]>([
		{ id: uuidv4(), name: "", value: "" },
	]);
	const [presentationClaims, setPresentationClaims] =
		useState<SDK.Domain.PresentationClaims>(
			{} as SDK.Domain.PresentationClaims,
		);

	const { parseOOB } = useHolder();
	const { issueOOBPresentationRequest, agent } = useVerifier();
	const { load: loadMessages } = useMessages();
	const [selectedDID, setSelectedDID] = useState<DIDAlias | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showTemplates, setShowTemplates] = useState(false);
	const [attemptedSubmit, setAttemptedSubmit] = useState(false);
	const [trustIssuer, setTrustIssuer] = useState<string>("");
	const { create: createPeerDID } = usePeerDID();
	const [oob, setOob] = useState<string | null>(null);
	useEffect(() => {
		const claimsObject = claims.reduce(
			(all, claim) => {
				if (claim.name && claim.value) {
					all[claim.name] = {
						type: "string",
						pattern: claim.value,
					};
				}
				return all;
			},
			{} as Record<string, { type: string; pattern: string }>,
		);
		setPresentationClaims({ claims: claimsObject });
	}, [claims, setPresentationClaims]);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const validateClaim = (claim: Claim): boolean => {
		return !!claim.name && !!claim.value;
	};

	const handleClaimChange = (
		index: number,
		field: keyof Claim,
		value: string,
	) => {
		const newClaims = [...claims];
		newClaims[index] = { ...newClaims[index], [field]: value };
		setClaims(newClaims);
	};

	const addClaim = () => {
		const newClaim = { id: uuidv4(), name: "", value: "", type: "string" };
		setClaims([...claims, newClaim]);
	};

	const removeClaim = (index: number) => {
		if (claims.length > 1) {
			setClaims(claims.filter((_, i) => i !== index));
		}
	};

	const handleTrustIssuerChange = (value: string) => {
		setTrustIssuer(value);

		setFormData({
			...formData,
			trustIssuer: value,
		});
	};

	const handleDragEnd = (result: DropResult) => {
		if (!result.destination) return;

		const items = Array.from(claims);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		setClaims(items);
	};

	const applyTemplate = (template: ClaimTemplate) => {
		const newClaims = template.claims.map((claim) => ({
			...claim,
			id: uuidv4(),
		}));

		setClaims(newClaims);
		setShowTemplates(false);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setAttemptedSubmit(true);
		const validClaims = claims.map((claim) => ({
			...claim,
			isValid: validateClaim(claim),
		}));
		const allValid = validClaims.every((claim) => claim.isValid);
		if (!allValid) {
			setClaims(validClaims);
			setIsSubmitting(false);
			return;
		}
		try {
			const code = await issueOOBPresentationRequest(
				SDK.Domain.CredentialType.SDJWT,
				{
					...presentationClaims,
					issuer: trustIssuer,
				},
			);

			await parseOOB(`${window.location.origin}/app/credentials?oob=${code}`);
			await loadMessages();

			router.push(`/app/presentation-requests`);
		} catch (err) {
			console.error("Error creating presentation request:", err);
			setIsSubmitting(false);
		}
	};

	return (
		<div className="max-w-7xl mx-auto">
			<div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-12 rounded-2xl border border-blue-200 dark:border-blue-800 text-center">
				<div className="max-w-4xl mx-auto">
					<div className="text-center mb-8">
						<div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
							<Search className="w-8 h-8 text-blue-600 dark:text-blue-400" />
						</div>
						<h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
							Create Presentation Request
						</h2>
						<p className="text-gray-600 dark:text-gray-400">
							Request specific credentials from holders for verification
						</p>
					</div>

					{isSubmitting && (
						<div className="bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-lg p-6 rounded-xl border border-gray-200 dark:border-gray-800 text-center mb-6 shadow-lg">
							<div className="flex justify-center mb-4">
								<Loader className="w-8 h-8 text-blue-500 animate-spin" />
							</div>
							<h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
								Creating Request
							</h3>
							<p className="text-gray-600 dark:text-gray-400">
								Setting up your presentation request...
							</p>
							<div className="p-4">
								{oob && <OOBCode code={oob} type="presentation" />}
							</div>
						</div>
					)}

					{dbError && (
						<div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-red-200 dark:border-red-800 mb-6">
							<div className="flex items-center gap-3">
								<AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
								<div>
									<p className="text-red-800 dark:text-red-400 font-medium">
										Database Error
									</p>
									<p className="text-sm text-red-600 dark:text-red-500 mt-1">
										{dbError.message}
									</p>
								</div>
							</div>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-8">
						<div className="space-y-6">
							<div>
								<label className="block text-sm font-medium text-gray-800 dark:text-white mb-2">
									Credential Format
								</label>
								<select
									name="credentialFormat"
									value={formData.credentialFormat}
									onChange={handleInputChange}
									required
									className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-800 dark:text-white"
								>
									{Object.values(SDK.Domain.CredentialType)
										.filter(
											(format) =>
												format !== SDK.Domain.CredentialType.Unknown &&
												format !== SDK.Domain.CredentialType.W3C &&
												format !== SDK.Domain.CredentialType.AnonCreds,
										)
										.map((format, i) => (
											<option
												key={`Credentialformat-${format + i}`}
												value={format}
											>
												{format}
											</option>
										))}
								</select>
							</div>

							{/* Trust Issuers Section */}
							<div className="bg-gray-50/50 dark:bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700">
								<div className="space-y-3">
									<div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700">
										<div className="flex-1">
											<input
												type="text"
												value={trustIssuer}
												onChange={(e) =>
													handleTrustIssuerChange(e.target.value)
												}
												placeholder="did:prism:trusted-issuer-did"
												className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-800 dark:text-white text-sm"
												required
											/>
										</div>
									</div>
								</div>
							</div>

							{/* Claims Section */}
							<div className="bg-gray-50/50 dark:bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700">
								<div className="flex justify-between items-center mb-4">
									<div>
										<h3 className="text-lg font-medium text-gray-800 dark:text-white">
											Required Claims
										</h3>
										<p className="text-sm text-gray-600 dark:text-gray-400">
											Specify the claims you want to verify
										</p>
									</div>
									<div className="flex space-x-2">
										<button
											type="button"
											onClick={() => setShowTemplates(!showTemplates)}
											className="group inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
										>
											<Shield className="w-4 h-4 mr-1" />
											Templates
										</button>
										<button
											type="button"
											onClick={addClaim}
											className="group inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
										>
											<Plus className="w-4 h-4 mr-1" />
											Add Claim
										</button>
									</div>
								</div>

								<AnimatePresence>
									{showTemplates && (
										<motion.div
											initial={{ opacity: 0, height: 0 }}
											animate={{ opacity: 1, height: "auto" }}
											exit={{ opacity: 0, height: 0 }}
											className="mb-4 overflow-hidden"
										>
											<div className="p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700">
												<h4 className="text-sm font-medium text-gray-800 dark:text-white mb-3">
													Select a verification template
												</h4>
												<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
													{claimTemplates.map((template, idx) => (
														<button
															key={idx + template.name}
															type="button"
															onClick={() => applyTemplate(template)}
															className="p-3 text-left bg-gray-50/50 dark:bg-gray-700/50 hover:bg-gray-100/50 dark:hover:bg-gray-600/50 rounded-lg transition-colors border border-gray-200 dark:border-gray-600"
														>
															<h5 className="font-medium text-gray-800 dark:text-white mb-1">
																{template.name}
															</h5>
															<p className="text-xs text-gray-600 dark:text-gray-400">
																{template.claims.map((c) => c.name).join(", ")}
															</p>
														</button>
													))}
												</div>
											</div>
										</motion.div>
									)}
								</AnimatePresence>

								{/* @ts-ignore */}
								<DragDropContext onDragEnd={handleDragEnd}>
									{/* @ts-ignore */}
									<Droppable droppableId="claims">
										{(provided) => (
											<div
												{...provided.droppableProps}
												ref={provided.innerRef}
												className="space-y-3"
											>
												<AnimatePresence>
													{claims.map((claim, index) => (
														// @ts-ignore
														<Draggable
															key={claim.id}
															draggableId={claim.id}
															index={index}
														>
															{(provided: DraggableProvided) => (
																<motion.div
																	initial={{ opacity: 0, y: -10 }}
																	animate={{ opacity: 1, y: 0 }}
																	exit={{ opacity: 0, height: 0 }}
																	transition={{ duration: 0.2 }}
																	ref={provided.innerRef}
																	{...provided.draggableProps}
																	className={`flex items-center space-x-2 p-3 border rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm  text-sm border-gray-300 dark:border-gray-700`}
																>
																	<div
																		{...provided.dragHandleProps}
																		className="cursor-move text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
																	>
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			className="h-5 w-5"
																			fill="none"
																			viewBox="0 0 24 24"
																			stroke="currentColor"
																		>
																			<path
																				strokeLinecap="round"
																				strokeLinejoin="round"
																				strokeWidth={2}
																				d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
																			/>
																		</svg>
																	</div>
																	<div className="flex-1">
																		<input
																			type="text"
																			value={claim.name}
																			onChange={(e) =>
																				handleClaimChange(
																					index,
																					"name",
																					e.target.value,
																				)
																			}
																			placeholder="Claim Name (e.g., firstName)"
																			className={`w-full px-3 py-1.5 border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-800 dark:text-white text-sm text-sm border-gray-300 dark:border-gray-700`}
																			required
																		/>
																	</div>
																	<div className="flex-1">
																		<input
																			type={"text"}
																			value={claim.value}
																			onChange={(e) =>
																				handleClaimChange(
																					index,
																					"value",
																					e.target.value,
																				)
																			}
																			placeholder={`Expected Value (e.g., John)`}
																			className={`w-full px-3 py-1.5 border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-800 dark:text-white text-sm border-gray-300 dark:border-gray-700`}
																			required
																		/>
																	</div>

																	<button
																		type="button"
																		onClick={() => removeClaim(index)}
																		className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors"
																		title="Remove claim"
																	>
																		<Trash2 className="w-4 h-4" />
																	</button>
																</motion.div>
															)}
														</Draggable>
													))}
													{provided.placeholder as any}
												</AnimatePresence>
											</div>
										)}
									</Droppable>
								</DragDropContext>
							</div>

							<div className="flex justify-end space-x-3">
								<button
									type="button"
									onClick={() => router.back()}
									className="group inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 rounded-full font-medium hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-600"
								>
									Cancel
								</button>
								<button
									type="submit"
									disabled={isSubmitting}
									className="group inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isSubmitting ? (
										<>
											<Loader className="w-4 h-4 mr-2 animate-spin" />
											Creating...
										</>
									) : (
										"Create Request"
									)}
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default withLayout(CreatePresentationRequestPage, {
	title: "Create Presentation Request",
	description: "Create a new credential presentation request",
	pageHeader: true,
	icon: <Search className="w-5 h-5" />,
});
