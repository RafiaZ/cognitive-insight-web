

import { InferenceClient } from '@huggingface/inference';

const hf = new InferenceClient(process.env.HF_TOKEN);

export async function analyzeText(text: string){
const sentimentResult = await hf.textClassification({
	model: "distilbert/distilbert-base-uncased-finetuned-sst-2-english",
	inputs: text,
	provider: "hf-inference",
});
const emotionResult = await hf.textClassification({
	model: "j-hartmann/emotion-english-distilroberta-base",
	inputs: text,
	provider: "hf-inference",
});

const emotionRate = [...emotionResult].sort((a,b)=> b.score - a.score)
console.log("here is the emotion rate in hf.ts", emotionRate)
return {
    sentiment:sentimentResult[0],
    emotion: emotionRate,
    dominantEmotion: emotionRate[0].label
}
}





