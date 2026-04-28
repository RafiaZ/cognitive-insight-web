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
	const modelRef = useRef<toxicity.ToxicityClassifier | null>(null);

	const abortControllerRef = useRef<AbortController | null>(null);

	useEffect(() => {
		async function initTF() {
			if (modelRef.current) return;
			setIsModelLoading(true);
			try {
				const model = await toxicity.load(0.85, []);
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
	});

	const timer = setTimeout(async () => {
		
		if (!modelRef.current) return;

		try {
			const predictions = await modelRef.current.classify([inputText]);
			const toxic = predictions.some((p) => p.results[0].match === true);
			setIsSafe(!toxic);
		} catch (err) {
			console.error("TensorFlow classification failed:", err);
		}
	}, 500);
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
			console.log(data);
			if (!res.ok) throw new Error(data.error || "Something went wrong");

			setResult(data.analysis);
		} catch (err: any) {
			setError(
				err.message || "An error occurred while analyzing the text.",
			);
		} finally {
			setLoading(false);
		}

		useEffect(() => {
			return () => {
				if (abortControllerRef.current) {
					abortControllerRef.current.abort();
				}
			};
		});
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
	};
}
