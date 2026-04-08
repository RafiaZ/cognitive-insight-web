interface AnalysisResult {
    stats: {
        wordCount: number;
        characterCount: number;
        sentenceCount: number;
        readingTimeMinutes: number;
    };
}

export function StatsCard({ result }: { result: AnalysisResult }){
    return(
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
    )
    

}