import { useState, useRef } from "react";

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
export function useStateTextAnalysis() {
	const [inputText, setInputText] = useState<string>("");
	const [result, setResult] = useState<AnalysisResult | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState("");
	const abortControllerRef = useRef<AbortController | null>(null);

	const handleClearAll = () => {
		setResult(null);
		setInputText("");
	};
	const handleTextAnalyser = async () => {
		if (inputText.trim().length < 20) {
			setError("Please enter at least 20 characters to analyze.");
			return;
		}
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}

		const controller = new AbortController();
		abortControllerRef.current = controller;
		setError("");
		setLoading(true);

		try {
			const res = await fetch("/api/analyze", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ text: inputText }),
			});

			const data = await res.json();
			console.log(data);
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
	return {
		inputText,
		setInputText,
		result,
		loading,
		error,
		handleClearAll,
		handleTextAnalyser,
	};
}
