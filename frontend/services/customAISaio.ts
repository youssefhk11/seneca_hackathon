import { GoogleGenAI, Type } from "@google/genai";
import type { User, Recipe } from "../types";

// FIX: Initialize GoogleGenAI with API key from environment variables.
// The API key MUST be obtained exclusively from the environment variable `process.env.API_KEY`.
const apiKey = process.env.API_KEY;
if (!apiKey) {
    // In a real app, you might want to show a more user-friendly error message
    // or disable AI features. For this context, throwing an error is clear.
    throw new Error("API_KEY environment variable is not set. Please set it in your environment.");
}
const ai = new GoogleGenAI({ apiKey });

const model = 'gemini-2.5-flash';

/**
 * Generates a chat response from the AI based on the user's prompt and profile.
 * @param prompt - The user's message.
 * @param user - The current user object.
 * @returns The AI's text response.
 */
export const getAIChatResponse = async (prompt: string, user: User): Promise<string> => {
    // FIX: Removed check for placeholder API key.
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
        
        // FIX: Use the .text property to get the response text, as per guidelines.
        return response.text;
    } catch (error) {
        console.error("AI chat response error:", error);
        return "Sorry, I'm having trouble connecting to the AI service. Please try again later.";
    }
};

/**
 * Classifies the user's fitness level based on their profile data using an AI model.
 * @param user - The user object with profile data.
 * @returns A string representing the classified fitness level.
 */
export const classifyUserLevel = async (user: User): Promise<string> => {
    // FIX: Removed check for placeholder API key.
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
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                temperature: 0.2,
            }
        });
        
        // FIX: Use .text property and trim whitespace.
        const level = response.text.trim();
        const validLevels = ['Beginner', 'Intermediate', 'Advanced'];
        return validLevels.includes(level) ? level : "Could not classify";
    } catch (error) {
        console.error("AI fitness level classification error:", error);
        return "Error classifying";
    }
};

/**
 * Generates a workout plan for a community event.
 * @param eventTitle - The title of the event.
 * @param eventDetails - The details of the event.
 * @returns A string containing the AI-generated workout plan.
 */
export const generateWorkoutPlanForEvent = async (eventTitle: string, eventDetails: string): Promise<string> => {
    // FIX: Removed check for placeholder API key.
    const prompt = `
        Create a simple, fun, and safe group workout plan for a community fitness event.
        The event is called "${eventTitle}" and the details are: "${eventDetails}".
        The plan should be suitable for a mix of fitness levels.
        Structure it with a warm-up, main workout, and cool-down.
        Keep the descriptions brief and clear.
    `;
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                systemInstruction: "You are an expert fitness trainer creating engaging group workout plans."
            }
        });
        // FIX: Use .text property to get the response text.
        return response.text;
    } catch (error) {
        console.error("AI workout plan generation error:", error);
        return "Could not generate a workout plan at this time.";
    }
};

/**
 * Generates meal suggestions based on a meal type (e.g., breakfast).
 * @param mealType - The type of meal.
 * @returns An array of Recipe objects.
 */
export const generateMealSuggestions = async (mealType: string): Promise<Recipe[]> => {
    // FIX: Removed check for placeholder API key.
    const prompt = `Generate 3 healthy ${mealType} meal suggestions suitable for an active person. For each meal, provide a title, a short description, and details including an estimated calorie count.`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
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
        
        // FIX: Use .text property to get the JSON string.
        const jsonStr = response.text;
        const recipes: Recipe[] = JSON.parse(jsonStr);
        return recipes;
    } catch (error) {
        console.error(`AI meal suggestion for ${mealType} error:`, error);
        return [{ title: "Error", description: "Could not fetch suggestions.", details: "" }];
    }
};
