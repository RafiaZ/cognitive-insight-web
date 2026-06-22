import { useState, useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as toxicity from "@tensorflow-models/toxicity";

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
	const [isModelLoading, setIsModelLoading] = useState(false);
	const [isSafe, setIsSafe] = useState<boolean | null>(null);
	const [error, setError] = useState("");
	const [toxocityResult, setToxixityResult] = useState<
		{ label: string; tscore: number }[]
	>([]);
	const modelRef = useRef<toxicity.ToxicityClassifier | null>(null);

	const abortControllerRef = useRef<AbortController | null>(null);
	const labels = [
		"toxicity",
		"severe_toxicity",
		"identity_attack",
		"insult",
		"threat",
		"sexual_explicit",
	];
	useEffect(() => {
		async function initTF() {
			if (modelRef.current) return;
			setIsModelLoading(true);
			try {
				const model = await toxicity.load(0.6, labels);
				modelRef.current = model;
			} catch (err) {
				console.error("TF loading Error", err);
			} finally {
				setIsModelLoading(false);
			}
		}
		initTF();
	}, []);

	useEffect(() => {
		if (!modelRef.current || inputText.trim().length < 5) {
			setIsSafe(null);
			return;
		}
		const timer = setTimeout(async () => {
			if (!modelRef.current) return;

			try {
				const predictions = await modelRef.current.classify([
					inputText,
				]);
				const toxicityDetail = predictions.map((p) => ({
					label: p.label,
					tscore: p.results[0].probabilities[1],
				}));
				setToxixityResult(toxicityDetail);

				const toxic = predictions.some(
					(p) => p.results[0].match === true,
				);

				setIsSafe(!toxic);
				console.log(predictions);
			} catch (err) {
				console.error("TensorFlow classification failed:", err);
			}
		}, 500);
		return () => clearTimeout(timer);
	}, [inputText]);

	// useEffect(() => {
	// 	return () => {
	// 		if (abortControllerRef.current) {
	// 			abortControllerRef.current.abort();
	
	// 		}
	// 	};
	// });

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
				signal: controller.signal,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ text: inputText }),
			});
			const data = await res.json();
			console.log("Full API Response:", data); 

			if (!res.ok) throw new Error(data.error || "Analysis failed");
			if (data.analysis) {
				setResult(data.analysis);
			} else {
				setResult(data);
			}
		} catch (err: any) {
			if (err.name === "AbortError") {
				console.log("Api fetch aborted");
				return;
			}

			setError(err.message || "An error occurred");
		} finally {
			if (controller === abortControllerRef.current) {
				setLoading(false);
				abortControllerRef.current = null;
			}
		}
	};
	return {
		inputText,
		setInputText,
		isModelLoading,
		isSafe,
		result,
		loading,
		error,
		handleClearAll,
		handleTextAnalyser,
		toxocityResult,
	};
}
