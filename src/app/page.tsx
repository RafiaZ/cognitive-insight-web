
import Image from "next/image";
import TextAnalyser from "../components/TextAnalyser";

export default function Home() {
	return (
		<>
			<div className="p-4 border-amber-600 border-4">
				Cognitive Insight Web
			</div>

			<TextAnalyser />
		</>
	);
}
