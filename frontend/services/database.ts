// FIX: Import the 'Progress' type to resolve the 'Cannot find name' error.
import type { User, RegistrationData, Profile, Progress, Stat, Event, Challenge, LeaderboardUser, Meal, ReportData } from '../types';

// --- LocalStorage Keys ---
const USERS_KEY = 'fitconnect_users';
const CURRENT_USER_KEY = 'fitconnect_currentUser';
const CHAT_MESSAGES_KEY_PREFIX = 'fitconnect_chat_';

// --- Default Mock Data (Localized to Tunis, Tunisia) ---
const getDefaultUsers = (): User[] => [
    {
        id: '1',
        username: 'Karim',
        surname: 'Ben Ahmed',
        phone: '1111', // Demo user login
        profile: {
            age: 28,
            weight: 75,
            height: 180,
            fitnessLevel: 'Intermediate',
            goals: ['Build Muscle', 'Improve Endurance'],
            city: 'La Marsa, Tunis',
            bmi: '23.1',
            progress: { workoutsLogged: 12, caloriesBurned: 3500, activeMinutes: 450 },
            avgWorkoutDuration: 60,
            preferredWorkoutTime: 'Evening',
        }
    },
    {
        id: '2',
        username: 'Amina',
        surname: 'Trabelsi',
        phone: '2222',
        profile: {
            age: 24,
            weight: 62,
            height: 165,
            fitnessLevel: 'Beginner',
            goals: ['Lose Weight', 'Stay Active'],
            city: 'Carthage, Tunis',
            bmi: '22.7',
            progress: { workoutsLogged: 5, caloriesBurned: 1200, activeMinutes: 180 },
            avgWorkoutDuration: 45,
            preferredWorkoutTime: 'Morning',
        }
    }
];

const getDefaultEvents = (): Event[] => [
    { id: 1, title: 'Morning Run at Belvédère', date: 'Sat, 9:00 AM', location: 'Parc du Belvédère, Tunis', type: 'run' },
    { id: 2, title: 'Sunset Yoga in Sidi Bou Said', date: 'Sun, 6:00 PM', location: 'Sidi Bou Said', type: 'yoga' },
    { id: 3, title: 'Nutrition Workshop (Online)', date: 'Next Wed, 7:00 PM', location: 'Online', type: 'workshop' },
];


// --- Database Initialization ---
const getDb = <T>(key: string, defaultValue: T): T => {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
        console.error(`Error parsing localStorage key "${key}":`, error);
        return defaultValue;
    }
};

const setDb = <T>(key: string, value: T) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
    }
};

// Initialize DB with default data if it's empty
if (!localStorage.getItem(USERS_KEY)) {
    setDb(USERS_KEY, getDefaultUsers());
}

// --- API Functions ---

export const db_login = (phone: string, pass: string): User | null => {
    const users = getDb<User[]>(USERS_KEY, []);
    const user = users.find(u => u.phone === phone);
    if (user) {
        // Simulating password check
        console.log(`Simulating login for ${user.username} with password ${pass}`);
        setDb(CURRENT_USER_KEY, user);
        return user;
    }
    return null;
};

export const db_register = (data: RegistrationData): User | null => {
    const users = getDb<User[]>(USERS_KEY, []);
    if (users.some(u => u.phone === data.phone)) {
        return null; 
    }
    const newUser: User = {
        id: (Date.now()).toString(),
        username: data.username,
        surname: data.surname,
        phone: data.phone,
    };
    users.push(newUser);
    setDb(USERS_KEY, users);
    setDb(CURRENT_USER_KEY, newUser);
    return newUser;
};

export const db_logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
};

export const db_getCurrentUser = (): User | null => {
    return getDb<User | null>(CURRENT_USER_KEY, null);
};

export const db_updateUserProfile = (userId: string, profileData: Omit<Profile, 'bmi' | 'progress'>): User | null => {
    const users = getDb<User[]>(USERS_KEY, []);
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        const bmi = (profileData.weight / ((profileData.height / 100) ** 2)).toFixed(1);
        const progress: Progress = { // Initialize progress to zero for new users
            workoutsLogged: 0,
            caloriesBurned: 0,
            activeMinutes: 0,
        };
        users[userIndex].profile = { ...profileData, bmi, progress };
        setDb(USERS_KEY, users);
        setDb(CURRENT_USER_KEY, users[userIndex]);
        return users[userIndex];
    }
    return null;
};

// --- Data Fetching Functions ---

export const db_getCommunityStats = (): Stat[] => {
    const users = getDb<User[]>(USERS_KEY, []);
    const events = getDefaultEvents();
    return [
      { label: "Active Members", value: users.length },
      { label: "Community Events", value: events.length },
      { label: "Workouts Logged Today", value: "87" }, // Mocked for realism
      { label: "Community Goal", value: "75%" },
    ];
};

export const db_getCommunityMembers = (): User[] => {
    return getDb<User[]>(USERS_KEY, []);
};

export const db_getCommunityEvents = (): Event[] => {
    return getDefaultEvents();
};

export const db_getChallenges = (): Challenge[] => [
    { id: 1, title: 'Weekly Step Goal', description: 'Walk 50,000 steps this week.', progress: 75, reward: '+50 pts' },
    { id: 2, title: 'Consistency King', description: 'Log a workout 5 days in a row.', progress: 40, reward: '+100 pts' },
];

export const db_getLeaderboard = (): LeaderboardUser[] => {
    const users = getDb<User[]>(USERS_KEY, []);
    return users.map((user, index) => ({
        rank: index + 1,
        username: user.username,
        points: 1250 - (index * 70), // Simulate points
        avatar: user.username.charAt(0).toUpperCase()
    })).sort((a,b) => a.rank - b.rank);
};

export const db_getMeals = (): Meal[] => [
    { id: 1, name: 'Oatmeal with Berries', calories: 350, type: 'Breakfast' },
    { id: 2, name: 'Grilled Chicken Salad', calories: 450, type: 'Lunch' },
    { id: 3, name: 'Salmon with Quinoa', calories: 550, type: 'Dinner' },
    { id: 4, name: 'Greek Yogurt', calories: 150, type: 'Snack' },
];

export const db_getReportData = (): ReportData => ({
    weeklyProgress: [
        { day: 'Mon', value: 30 }, { day: 'Tue', value: 45 }, { day: 'Wed', value: 60 },
        { day: 'Thu', value: 50 }, { day: 'Fri', value: 75 }, { day: 'Sat', value: 90 },
        { day: 'Sun', value: 20 },
    ],
    monthlyProgress: [
        { month: 'Jan', value: 1200 }, { month: 'Feb', value: 1500 },
        { month: 'Mar', value: 1400 }, { month: 'Apr', value: 1800 },
    ],
});

// --- Chat Functions ---
interface ChatMessage {
    id: number;
    sender: string;
    avatar: string;
    text: string;
    isMe: boolean;
}

export const db_getChatMessages = (groupId: string): ChatMessage[] => {
    return getDb<ChatMessage[]>(`${CHAT_MESSAGES_KEY_PREFIX}${groupId}`, [
        { id: 1, sender: 'Amina', avatar: 'A', text: "Hey everyone! Who's up for the run at Belvédère this Saturday?", isMe: false },
        { id: 2, sender: 'Karim', avatar: 'K', text: "I'm in! What time?", isMe: false },
    ]);
};

export const db_addChatMessage = (groupId: string, message: ChatMessage): ChatMessage[] => {
    const messages = db_getChatMessages(groupId);
    messages.push(message);
    setDb(`${CHAT_MESSAGES_KEY_PREFIX}${groupId}`, messages);
    return messages;
}