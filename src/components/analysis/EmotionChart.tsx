export function EmotionChart({ emotions }: { emotions: any[] }) {
	return (
		<div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
			<p className="text-gray-400 text-xs mb-2">Emotion Breakdown</p>
			{emotions.map((emo) => (
				<div key={emo.label} className="flex items-center gap-2 mb-2">
					<span className="text-white text-xs w-16">{emo.label}</span>
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
	);
}
