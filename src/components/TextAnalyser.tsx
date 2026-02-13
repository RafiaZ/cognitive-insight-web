"use client";
import React, { useState } from "react";

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
				className="w-full h-40 p-3 border border-gray-300 text-white rounded-md resize-none"
				readOnly={readOnly}
				value={value}
				onChange={(e) => onChange && onChange(e.target.value)}
			/>
		</div>
	);
}

export default function TextAnalyser() {
	const [inputText, setInputText] = useState<string>("");
    const [result, setResult] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleTextAnalyser = () =>{
        if (inputText.trim() === "") {
            alert("Please enter some text to analyze.");
            return;
        }

       
        setTimeout(() => {
            setResult(`Text Length: ${inputText.length} characters`);
             setLoading(false);
        }, 1500)
    }
	return (
		<>
			<div className="container mx-auto p-3">
				<div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl ">
					<TextBox
						label="Input text here"
						value={inputText}
						onChange={setInputText}
					/>
					<TextBox label="Analysis results" readOnly={true} value={result} />
				</div>
				<div className="mt-6">
					<button onClick={handleTextAnalyser} className="px-6 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700">
						{loading ? "Analyzing..." : "Analyze Text"}
					</button>
				</div>
			</div>
		</>
	);
}
