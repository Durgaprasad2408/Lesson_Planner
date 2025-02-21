import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateLessonPlan(data: {
  topic: string;
  gradeLevel: string;
  mainConcept: string;
  materials: string;
  objectives: string;
  outline: string;
}) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `Create a detailed lesson plan with the following information:
Topic: ${data.topic}
Grade Level: ${data.gradeLevel}
Main Concept: ${data.mainConcept}
Materials Needed: ${data.materials}
Learning Objectives: ${data.objectives}
Lesson Outline: ${data.outline}

Please format the lesson plan with the following sections:
1. Overview
2. Learning Objectives
3. Materials and Resources
4. Introduction (10-15 minutes)
5. Main Activity (25-30 minutes)
6. Practice and Application (15-20 minutes)
7. Assessment and Closure (10 minutes)
8. Extensions and Modifications
9. Additional Notes`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating lesson plan:', error);
    throw error;
  }
}