
import React from 'react';
import type { Recipe } from '../types';

const RecipeItem: React.FC<{ recipe: Recipe, isLast: boolean }> = ({ recipe, isLast }) => (
    <>
        <div>
            <strong className="text-gray-800">{recipe.title}</strong>
            <p className="text-sm text-gray-600">{recipe.description}</p>
            <small className="text-green-600 font-semibold">{recipe.details}</small>
        </div>
        {!isLast && <hr className="my-3" />}
    </>
);

const RecipesCard: React.FC = () => {
    const recipes: Recipe[] = [
        { title: 'Post-Workout Protein Bowl', description: 'Quinoa, grilled chicken, avocado, and mixed greens', details: '⭐ 4.9 rating • 320 calories' },
        { title: 'Energy Smoothie', description: 'Banana, spinach, protein powder, almond milk', details: '⭐ 4.7 rating • 280 calories' },
        { title: 'Recovery Overnight Oats', description: 'Oats, Greek yogurt, berries, chia seeds', details: '⭐ 4.8 rating • 350 calories' },
    ];

    return (
        <div className="card bg-green-50 border-l-4 border-green-500 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-2xl font-bold text-green-600 mb-4">🍎 Healthy Meal Recipes</h3>
            <div>
                {recipes.map((recipe, index) => (
                    <RecipeItem key={recipe.title} recipe={recipe} isLast={index === recipes.length - 1} />
                ))}
            </div>
        </div>
    );
};

export default RecipesCard;
