import React, { useState } from 'react';
import type { Meal, Recipe } from '../types';
import { generateMealSuggestions } from '../services/customAIService';

const MealCard: React.FC<{ meal: Meal }> = ({ meal }) => (
    <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
        <div>
            <p className="font-bold text-gray-800">{meal.name}</p>
            <p className="text-sm text-gray-500">{meal.type}</p>
        </div>
        <p className="font-semibold text-indigo-600">{meal.calories} cal</p>
    </div>
);

const NutritionPage: React.FC = () => {
    const initialMeals: Meal[] = [
        { id: 1, name: 'Oatmeal with Berries', calories: 350, type: 'Breakfast' },
        { id: 2, name: 'Grilled Chicken Salad', calories: 450, type: 'Lunch' },
        { id: 3, name: 'Salmon with Quinoa', calories: 550, type: 'Dinner' },
        { id: 4, name: 'Greek Yogurt', calories: 150, type: 'Snack' },
    ];
    const [meals] = useState<Meal[]>(initialMeals);
    const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);

    const [aiSuggestions, setAiSuggestions] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [suggestionType, setSuggestionType] = useState('');

    const handleGetSuggestions = async (mealType: string) => {
        setIsLoading(true);
        setSuggestionType(mealType);
        setAiSuggestions([]);
        const suggestions = await generateMealSuggestions(mealType);
        setAiSuggestions(suggestions);
        setIsLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            <header className="text-center">
                <h1 className="text-4xl font-bold text-gray-800">🥗 Nutrition Tracker</h1>
                <p className="text-lg text-gray-500">Log your meals and get AI-powered suggestions.</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-xl">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Today's Meals</h2>
                    <div className="space-y-4 mb-4">
                        {meals.map(meal => <MealCard key={meal.id} meal={meal} />)}
                    </div>
                    <div className="text-right font-bold text-xl text-gray-800 pt-4 border-t">
                        Total: {totalCalories} / 2000 calories
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-xl">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">🤖 AI Meal Suggester</h2>
                    <p className="text-gray-600 mb-4">Need inspiration? Get healthy meal ideas from our AI.</p>
                    <div className="flex gap-2 mb-4">
                        {['Breakfast', 'Lunch', 'Dinner'].map(type => (
                             <button key={type} onClick={() => handleGetSuggestions(type)} disabled={isLoading} className="flex-1 py-2 font-semibold text-indigo-600 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition disabled:opacity-50">
                                Get {type}
                            </button>
                        ))}
                    </div>
                    {isLoading && <p className="text-center">Generating ideas for {suggestionType}...</p>}
                    <div className="space-y-3">
                        {aiSuggestions.map((recipe, index) => (
                            <div key={index} className="bg-gray-100 p-3 rounded-md">
                                <p className="font-bold">{recipe.title}</p>
                                <p className="text-sm text-gray-600">{recipe.description}</p>
                                <p className="text-xs font-semibold text-green-600">{recipe.details}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NutritionPage;
