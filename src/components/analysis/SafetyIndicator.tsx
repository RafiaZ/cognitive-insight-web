interface props {
	isSafe: boolean | null;
	loading: boolean;
}

export function SafetyIndicator({ isSafe, loading }: props) {
	if (loading) return <p>Ready for Input</p>;

	if (isSafe === null) return <p>ready for input </p>;

	return (
		<div
			className={`text-xs font-bold px-2 py-1 rounded w-fit transition-all duration-300 ${
				isSafe
					? "text-green-400 bg-green-900/20 border border-green-800"
					: "text-red-400 bg-red-900/20 border border-red-800 animate-shake"
			}`}
		>
			{isSafe
				? "✅ Content Safe"
				: "⚠️ Warning: Potential Toxicity Detected"}
		</div>
	);
}
