"use client";
import React, { useState } from "react";

// --- Types for our Analysis Response ---
interface AnalysisResult {
	stats: {
		wordCount: number;
		characterCount: number;
		sentenceCount: number;
		readingTimeMinutes: number;
	};
	cognitiveInsight: {
		sentiment: string;
		confidence: number;
		tone: string;
		dominantEmotion: string;
	};
	emotions: { label: string; score: number }[];
}

type TextBoxProps = {
	label: string;
	readOnly?: boolean;
	value?: string;
	onChange?: (value: string) => void;
};

function TextBox({ label, readOnly, value, onChange }: TextBoxProps) {
	return (
		<div className="flex flex-col w-full md:w-1/2">
			<label className="mb-2 text-white font-semibold"> {label}</label>
			<textarea
				className="w-full h-40 p-3 border border-gray-700 bg-gray-900 text-white rounded-md resize-none focus:ring-2 focus:ring-amber-500 outline-none"
				readOnly={readOnly}
				value={value}
				onChange={(e) => onChange && onChange(e.target.value)}
				placeholder={
					readOnly
						? "Analysis will appear here..."
						: "Type your text..."
				}
			/>
		</div>
	);
}

export default function TextAnalyser() {
	const [inputText, setInputText] = useState<string>("");
	// Change result state to hold the structured object
	const [result, setResult] = useState<AnalysisResult | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState("");

	const handleClearAll = () => {
		setResult(null);
		setInputText("");
	};
	const handleTextAnalyser = async () => {
		if (inputText.trim().length < 20) {
			setError("Please enter at least 20 characters to analyze.");
			return;
		}

		setError("");
		setLoading(true);

		try {
			const res = await fetch("/api/analyze", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ text: inputText }),
			});

			const data = await res.json();
			console.log("Frontend received data:", data);
			if (!res.ok) throw new Error(data.error || "Something went wrong");

			setResult(data.analysis); // Store the analysis object
		} catch (err: any) {
			setError(
				err.message || "An error occurred while analyzing the text.",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container mx-auto p-6 max-w-5xl">
			<div className="flex flex-col md:flex-row gap-6 w-full">
				<TextBox
					label="Input text here"
					value={inputText}
					onChange={setInputText}
				/>

				{/* We can show a text summary in the second box */}
				<TextBox
					label="Text Summary"
					readOnly={true}
					value={
						result
							? `Analysis Complete!\nDominant Emotion: ${result.cognitiveInsight.dominantEmotion}\nSentiment: ${result.cognitiveInsight.sentiment}\nWord Count: ${result.stats.wordCount}`
							: ""
					}
				/>
			</div>

			<div className="mt-6 flex  gap-4">
				{error && <p className="text-red-400">{error}</p>}

				<button
					onClick={handleTextAnalyser}
					disabled={loading}
					className="w-fit px-8 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:bg-gray-600 transition-colors"
				>
					{loading ? "Analyzing..." : "Analyze Text"}
				</button>
				<button
					className="px-6 py-3 border border-gray-500 text-gray-300 rounded-md hover:bg-gray-800 hover:text-white transition-all"
					onClick={handleClearAll}
				>
					Clear All
				</button>
			</div>

			{/* <div className="mt-6 flex flex-col gap-4"></div> */}

			{/* --- ANALYSIS DASHBOARD --- */}
			{result && (
				<div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
					{/* Stats Card */}
					<div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
						<h3 className="text-amber-500 font-bold mb-4 uppercase text-sm tracking-widest">
							Text Statistics
						</h3>
						<div className="grid grid-cols-2 gap-4 text-white">
							<div className="p-3 bg-gray-900 rounded-lg">
								<p className="text-gray-400 text-xs">Words</p>
								<p className="text-2xl font-bold">
									{result.stats.wordCount}
								</p>
							</div>
							<div className="p-3 bg-gray-900 rounded-lg">
								<p className="text-gray-400 text-xs">
									Characters
								</p>
								<p className="text-2xl font-bold">
									{result.stats.characterCount}
								</p>
							</div>
							<div className="p-3 bg-gray-900 rounded-lg">
								<p className="text-gray-400 text-xs">
									Sentences
								</p>
								<p className="text-2xl font-bold">
									{result.stats.sentenceCount}
								</p>
							</div>
							<div className="p-3 bg-gray-900 rounded-lg">
								<p className="text-gray-400 text-xs">
									Reading Time
								</p>
								<p className="text-xl font-bold">
									{result.stats.readingTimeMinutes} min
								</p>
							</div>
						</div>
					</div>

					{/* Cognitive Card */}
					<div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
						<h3 className="text-amber-500 font-bold mb-4 uppercase text-sm tracking-widest">
							Cognitive Insight
						</h3>
						<div className="space-y-4">
							<div>
								<div className="flex justify-between text-white mb-1">
									<span>
										Sentiment:{" "}
										<b className="text-amber-400">
											{result.cognitiveInsight.sentiment}
										</b>
									</span>
									<span>
										{Math.round(
											result.cognitiveInsight.confidence *
												100,
										)}
										%
									</span>
								</div>
								<div className="w-full bg-gray-900 h-2 rounded-full">
									<div
										className="bg-amber-500 h-2 rounded-full transition-all duration-1000"
										style={{
											width: `${result.cognitiveInsight.confidence * 100}%`,
										}}
									></div>
								</div>
							</div>

							<div className="pt-2">
								<p className="text-gray-400 text-xs mb-2">
									Emotion Breakdown
								</p>
								{result.emotions.map((emo) => (
									<div
										key={emo.label}
										className="flex items-center gap-2 mb-2"
									>
										<span className="text-white text-xs w-16">
											{emo.label}
										</span>
										<div className="flex-1 bg-gray-900 h-1.5 rounded-full">
											<div
												className="bg-blue-500 h-1.5 rounded-full"
												style={{
													width: `${emo.score * 100}%`,
												}}
											></div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
