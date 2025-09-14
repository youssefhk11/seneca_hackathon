import { GoogleGenAI, Type } from "@google/genai";
import type { User, Recipe, Workout, Article } from "../types";

// The API key is hardcoded for this high-fidelity prototype as per the request.
// In a real production app, this should be handled via environment variables.
const apiKey = "AIzaSyD-6XbAxuJhIxwvqqV6_WA1yBoSWn-Z0rc";
const ai = new GoogleGenAI({ apiKey });

const model = 'gemini-2.5-flash';

/**
 * Generates a chat response from the AI based on the user's prompt and profile.
 */
export const getAIChatResponse = async (prompt: string, user: User): Promise<string> => {
    try {
        const userProfileInfo = user.profile ? `
            Here is some context about the user you are talking to:
            - Age: ${user.profile.age}
            - Weight: ${user.profile.weight} kg
            - Height: ${user.profile.height} cm
            - Stated Fitness Level: ${user.profile.fitnessLevel}
            - Goals: ${user.profile.goals.join(', ')}
            - Location: ${user.profile.city}
            Please tailor your response to be encouraging and relevant to their profile.
        ` : "The user has not completed their profile yet.";

        const response = await ai.models.generateContent({
            model: model,
            contents: `The user asked: "${prompt}". ${userProfileInfo}`,
            config: {
                systemInstruction: "You are a friendly and encouraging AI fitness assistant for the FitConnect app. Provide safe, helpful, and motivating advice. Do not give medical advice. Keep responses concise and easy to understand."
            }
        });
        
        return response.text;
    } catch (error) {
        console.error("AI chat response error:", error);
        return "Sorry, I'm having trouble connecting to the AI service. Please try again later.";
    }
};

/**
 * Classifies the user's fitness level based on their profile data.
 */
export const classifyUserLevel = async (user: User): Promise<string> => {
    if (!user.profile) return "Profile not available";
    const { age, weight, height, fitnessLevel, goals } = user.profile;
    const prompt = `
        Based on the following user data, classify their fitness level into one of these categories: Beginner, Intermediate, or Advanced.
        Provide only the category name as the response.

        - Age: ${age}
        - Weight: ${weight} kg
        - Height: ${height} cm
        - Self-assessed fitness level: ${fitnessLevel}
        - Goals: ${goals.join(', ')}

        Classification:
    `;
    try {
        const response = await ai.models.generateContent({ model, contents: prompt, config: { temperature: 0.2 } });
        const level = response.text.trim();
        return ['Beginner', 'Intermediate', 'Advanced'].includes(level) ? level : "Could not classify";
    } catch (error) {
        console.error("AI fitness level classification error:", error);
        return "Error classifying";
    }
};

/**
 * Generates meal suggestions based on a meal type.
 */
export const generateMealSuggestions = async (mealType: string): Promise<Recipe[]> => {
    const prompt = `Generate 3 healthy ${mealType} meal suggestions suitable for an active person. For each meal, provide a title, a short description, and details including an estimated calorie count.`;
    try {
        const response = await ai.models.generateContent({
            model, contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            description: { type: Type.STRING },
                            details: { type: Type.STRING, description: "Include calorie estimate, e.g., '~400 calories'" },
                        },
                        required: ["title", "description", "details"],
                    },
                },
            },
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error(`AI meal suggestion for ${mealType} error:`, error);
        return [{ title: "Error", description: "Could not fetch suggestions.", details: "" }];
    }
};

/**
 * Generates a personalized workout library for the user.
 */
export const generateWorkoutLibrary = async (user: User): Promise<Workout[]> => {
    if (!user.profile) return [];
    const prompt = `Generate a list of 5 personalized workout exercises for a user with the following profile:
    - Fitness Level: ${user.profile.fitnessLevel}
    - Goals: ${user.profile.goals.join(', ')}
    
    For each exercise, provide a name, type (e.g., Strength, Cardio), duration or reps (e.g., "3 sets of 12 reps"), intensity (e.g., "Moderate"), and a brief description.
    `;
    try {
        const response = await ai.models.generateContent({
            model, contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            type: { type: Type.STRING },
                            duration: { type: Type.STRING },
                            intensity: { type: Type.STRING },
                            description: { type: Type.STRING },
                        },
                        required: ["name", "type", "duration", "intensity", "description"],
                    }
                }
            }
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("AI workout library generation error:", error);
        return [];
    }
};

/**
 * Generates a short health and wellness article.
 */
export const generateHealthArticle = async (): Promise<Article> => {
    const prompt = "Write a short, engaging, and informative health and wellness article. Provide a catchy title and a few paragraphs of content. The topic should be relevant to general fitness.";
    try {
        const response = await ai.models.generateContent({
            model, contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        content: { type: Type.STRING },
                    },
                    required: ["title", "content"],
                }
            }
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("AI health article generation error:", error);
        return { title: "Error", content: "Could not generate an article at this time." };
    }
};

/**
 * Simulates real-time data processing to generate user recommendations.
 */
export const getRealTimeDataProcessingOutput = async (user: User): Promise<string> => {
    if (!user.profile) return "User profile not found.";
    const { weight, height, goals, avgWorkoutDuration } = user.profile;

    const prompt = `
        Based on the user's data, generate a daily recommendation summary in the following format.
        Provide realistic numbers based on their profile.
        
        User data:
        - Weight: ${weight} kg
        - Height: ${height} cm
        - Goals: ${goals.join(', ')}
        - Average Workout Duration: ${avgWorkoutDuration} min

        Required output format:
"""
🥗 Nutrition:
  - Calories: [number]
  - Protein: [number] g
  - Carbs: [number] g
  - Fat: [number] g

🏋️ Workout:
  - Duration: [number] min
  - Intensity: [number]/4 scale

😴 Sleep:
  - Target duration: [number] hours
"""
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("AI real-time data processing error:", error);
        return "Error processing data.";
    }
};
