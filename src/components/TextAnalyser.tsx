"use client";

function TextBox({
	label,
	readOnly = false,
}: {
	label: string;
	readOnly?: boolean;
}) {
	return (
		<div className="flex flex-col w-full md:w-1/2">
			<label className="mb-2 text-white font-semibold"> {label}</label>
			<textarea
				className="w-full h-40 p-3 border border-gray-300 text-white rounded-md resize-none"
				readOnly={readOnly}
			/>
		</div>
	);
}

export default function TextAnalyser() {
	return (
		<>
			<div>
				<div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl ">
					<TextBox label="Input text here" />
					<TextBox label="Analysis results" readOnly={true} />
				</div>
				<div className="mt-6">
					<button className="px-6 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700">
						Analyze Text
					</button>
				</div>
			</div>
		</>
	);
}
