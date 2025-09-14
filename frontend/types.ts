export interface RegistrationData {
    username: string;
    surname: string;
    phone: string;
    password: string;
}

export interface Progress {
    workoutsLogged: number;
    caloriesBurned: number;
    activeMinutes: number;
}

export interface Profile {
    age: number;
    weight: number;
    height: number;
    fitnessLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Not Set';
    goals: string[];
    city: string;
    bmi?: string;
    progress: Progress;
    avgWorkoutDuration: number;
    preferredWorkoutTime: string;
}

export interface User {
    id: string;
    username: string;
    surname: string;
    phone: string;
    profile?: Profile;
}

export interface Stat {
    label: string;
    value: string | number;
}

export interface Recipe {
    title: string;
    description: string;
    details: string;
}

export interface Event {
    id: number;
    title: string;
    date: string;
    location: string;
    type: 'run' | 'yoga' | 'workshop';
}

export interface Challenge {
    id: number;
    title: string;
    description: string;
    progress: number;
    reward: string;
}

export interface LeaderboardUser {
    rank: number;
    username: string;
    points: number;
    avatar: string;
}

export interface Meal {
    id: number;
    name: string;
    calories: number;
    type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
}

export interface ReportData {
    weeklyProgress: { day: string; value: number }[];
    monthlyProgress: { month: string; value: number }[];
}

export interface Workout {
    name: string;
    type: string;
    duration: string;
    intensity: string;
    description: string;
}

export interface Article {
    title: string;
    content: string;
}
