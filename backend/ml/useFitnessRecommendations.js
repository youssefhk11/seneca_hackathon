import { useState } from 'react';

/**
 * Custom React hook for fitness recommendations
 * Integrate this into your existing React app
 */
export const useFitnessRecommendation = (apiBaseUrl) => {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState(null);

  const getRecommendation = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${apiBaseUrl}/api/fitness/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add your existing auth headers here if needed
          // 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get recommendation');
      }

      const result = await response.json();
      setRecommendation(result);
      return result;

    } catch (err) {
      setError(err.message);
      console.error('Fitness recommendation error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const predictCategory = async (userData) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/fitness/predict-category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const result = await response.json();
      return result;
    } catch (err) {
      console.error('Category prediction error:', err);
      return null;
    }
  };

  const predictGoal = async (userData) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/fitness/predict-goal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const result = await response.json();
      return result;
    } catch (err) {
      console.error('Goal prediction error:', err);
      return null;
    }
  };

  const clearRecommendation = () => {
    setRecommendation(null);
    setError(null);
  };

  return {
    loading,
    recommendation,
    error,
    getRecommendation,
    predictCategory,
    predictGoal,
    clearRecommendation
  };
};

// Example React component using the hook
export const FitnessRecommendationForm = ({ apiBaseUrl, onRecommendation }) => {
  const { loading, recommendation, error, getRecommendation } = useFitnessRecommendation(apiBaseUrl);
  const [formData, setFormData] = useState({
    age: '',
    bmi: '',
    fitness_level_num: '',
    avg_calories_consumed: '',
    avg_calories_burned: '',
    protein_g: '',
    carbs_g: '',
    fat_g: '',
    avg_workout_duration: '',
    avg_workout_intensity: '',
    avg_sleep_hours: '', // Will convert to minutes
    avg_steps: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.age || !formData.bmi || !formData.fitness_level_num) {
      alert('Please fill in age, BMI, and fitness level');
      return;
    }

    // Prepare data for API
    const userData = {
      age: parseInt(formData.age),
      bmi: parseFloat(formData.bmi),
      fitness_level_num: parseInt(formData.fitness_level_num),
    };

    // Add optional fields if they exist
    if (formData.avg_calories_consumed) userData.avg_calories_consumed = parseInt(formData.avg_calories_consumed);
    if (formData.avg_calories_burned) userData.avg_calories_burned = parseInt(formData.avg_calories_burned);
    if (formData.protein_g) userData.protein_g = parseInt(formData.protein_g);
    if (formData.carbs_g) userData.carbs_g = parseInt(formData.carbs_g);
    if (formData.fat_g) userData.fat_g = parseInt(formData.fat_g);
    if (formData.avg_workout_duration) userData.avg_workout_duration = parseInt(formData.avg_workout_duration);
    if (formData.avg_workout_intensity) userData.avg_workout_intensity = parseFloat(formData.avg_workout_intensity);
    if (formData.avg_sleep_hours) userData.avg_sleep_duration = parseFloat(formData.avg_sleep_hours) * 60; // Convert to minutes
    if (formData.avg_steps) userData.avg_steps = parseInt(formData.avg_steps);

    const result = await getRecommendation(userData);
    if (result && onRecommendation) {
      onRecommendation(result);
    }
  };

  return (
    <div className="fitness-recommendation-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Age *</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            min="13"
            max="100"
            required
          />
        </div>

        <div className="form-group">
          <label>BMI *</label>
          <input
            type="number"
            name="bmi"
            value={formData.bmi}
            onChange={handleInputChange}
            min="10"
            max="50"
            step="0.1"
            required
          />
        </div>

        <div className="form-group">
          <label>Fitness Level *</label>
          <select
            name="fitness_level_num"
            value={formData.fitness_level_num}
            onChange={handleInputChange}
            required
          >
            <option value="">Select level</option>
            <option value="0">Beginner</option>
            <option value="1">Intermediate</option>
            <option value="2">Advanced</option>
          </select>
        </div>

        <div className="form-group">
          <label>Daily Calories Consumed</label>
          <input
            type="number"
            name="avg_calories_consumed"
            value={formData.avg_calories_consumed}
            onChange={handleInputChange}
            placeholder="2000"
          />
        </div>

        <div className="form-group">
          <label>Daily Calories Burned</label>
          <input
            type="number"
            name="avg_calories_burned"
            value={formData.avg_calories_burned}
            onChange={handleInputChange}
            placeholder="200"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Protein (g)</label>
            <input
              type="number"
              name="protein_g"
              value={formData.protein_g}
              onChange={handleInputChange}
              placeholder="100"
            />
          </div>

          <div className="form-group">
            <label>Carbs (g)</label>
            <input
              type="number"
              name="carbs_g"
              value={formData.carbs_g}
              onChange={handleInputChange}
              placeholder="250"
            />
          </div>

          <div className="form-group">
            <label>Fat (g)</label>
            <input
              type="number"
              name="fat_g"
              value={formData.fat_g}
              onChange={handleInputChange}
              placeholder="70"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Sleep Hours</label>
          <input
            type="number"
            name="avg_sleep_hours"
            value={formData.avg_sleep_hours}
            onChange={handleInputChange}
            min="3"
            max="12"
            step="0.5"
            placeholder="7"
          />
        </div>

        <div className="form-group">
          <label>Daily Steps</label>
          <input
            type="number"
            name="avg_steps"
            value={formData.avg_steps}
            onChange={handleInputChange}
            placeholder="8000"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Workout Duration (min)</label>
            <input
              type="number"
              name="avg_workout_duration"
              value={formData.avg_workout_duration}
              onChange={handleInputChange}
              placeholder="30"
            />
          </div>

          <div className="form-group">
            <label>Workout Intensity (1-4)</label>
            <input
              type="number"
              name="avg_workout_intensity"
              value={formData.avg_workout_intensity}
              onChange={handleInputChange}
              min="1"
              max="4"
              step="0.1"
              placeholder="2"
            />
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Getting Recommendation...' : 'Get Fitness Recommendation'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}

      {recommendation && (
        <div className="recommendation-result">
          <h3>Your Fitness Recommendation</h3>
          <div className="recommendation-content">
            <pre>{recommendation.recommendation}</pre>
          </div>
          
          <div className="recommendation-summary">
            <div className="summary-item">
              <strong>Category:</strong> {recommendation.category}
            </div>
            <div className="summary-item">
              <strong>Goal:</strong> {recommendation.goal}
            </div>
            <div className="summary-item">
              <strong>Target Calories:</strong> {recommendation.nutrition.calories}
            </div>
            <div className="summary-item">
              <strong>Workout Duration:</strong> {recommendation.workout.duration} minutes
            </div>
          </div>
        </div>
      )}
    </div>
  );
};