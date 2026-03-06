
# Cognitive Insight Web
AI Text Analyser is a full-stack web application that is built by using Next.js, TypeScript, and TailwindCss.
The goal is to build a scalable AI-integrated system capable of analyzing and processing user-submitted text.

This project is being built incrementally, with daily documentation of progress.

Day 1 Progress: 
1. Frontend Foundation:
 - Responsive layout using Tailwind CSS
 - Reusable TextBox component
 - Controlled components using React state
 - Type-safe props with Typescript 
 - Component architecture refactoring 

## 🛠 Tech Stack
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)

 TextAnalyser
 ├── TextBox (Reusable Component)
 └── State Management (useState)

2. Architecture and Insight Visualization
   - API integration: Created a Next.Js Route (`/api/analyze`) to process data server-side.
   - Cognitive Dashboard: Visually represented the emotions and sentiment using a dynamic progress bar.
   - Regex Processing: Made expressions to parse text to calculate words and sentence count.
3. Greedy Quantifiers: 
   Used Greedy Quantifiers in the Regex to ensure that the irregular punctuation and whitespaces don't get in the way of cognitive analysis metrics.

## 🛠 Architecture Diagram:
User Input
     │
     ▼
Frontend (Next.js UI)
     │
     ▼
API Layer (/api/analyze)
     │
     ▼
AI Orchestration Layer
     │
 ┌───────────────┬───────────────┬───────────────┐
 ▼               ▼               ▼
HuggingFace   TensorFlow.js   CustomGPT/OpenAI
 NLP Model      Local ML        AI Reasoning
   
 

