import { GoogleGenAI, Type } from '@google/genai';
import type { Course } from '../types';

// FIX: Per coding guidelines, initialize GoogleGenAI with process.env.API_KEY directly and assume it's available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const courseRecommendationSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: 'The full title of the online course.',
      },
      provider: {
        type: Type.STRING,
        description: 'The platform offering the course, e.g., Coursera, Udemy, Google Career Certificates.',
      },
      url: {
        type: Type.STRING,
        description: 'A direct link to the course page.',
      },
    },
    required: ['title', 'provider', 'url'],
  },
};

export async function getCourseRecommendations(jobDescription: string): Promise<Course[]> {
  // FIX: Per coding guidelines, assume API_KEY is always available and remove fallback logic.
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Based on the following job description, identify the key technical skills required and recommend 3-5 relevant online courses for upskilling. Focus on providers like Coursera, Udemy, Google Career Certificates, or Pluralsight.
        
        Job Description:
        ---
        ${jobDescription}
        ---
      `,
      config: {
        responseMimeType: 'application/json',
        responseSchema: courseRecommendationSchema,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        console.error("Gemini API returned an empty response.");
        return [];
    }

    const courses = JSON.parse(jsonText) as Course[];
    return courses;
  } catch (error) {
    console.error('Error fetching course recommendations from Gemini API:', error);
    throw new Error('Failed to get course recommendations.');
  }
}
