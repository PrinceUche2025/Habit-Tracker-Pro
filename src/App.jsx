import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getSession, signup, login, logout } from './utils/auth';
import { getHabitSlug } from './utils/slug';
import { validateHabitName } from './utils/validators';
import { calculateCurrentStreak } from './utils/streaks';
import { toggleHabitCompletion } from './utils/habits';

// --- 1. SIGNUP COMPONENT ---
const Signup = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const user = signup(email, password);
      onAuthSuccess(user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div data-testid="signup-page" style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Create Account</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px', margin: '0 auto', gap: '10px' }}>
        <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
};

// --- 2. LOGIN COMPONENT ---
const Login = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const user = login(email, password);
      onAuthSuccess(user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div data-testid="login-page" style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px', margin: '0 auto', gap: '10px' }}>
        <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <a href="/signup">Sign Up</a></p>
    </div>
  );
};

// --- 3. DASHBOARD COMPONENT ---
const Dashboard = ({ user, onLogout }) => {
  const [habits, setHabits] = useState([]);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedHabits = JSON.parse(localStorage.getItem(`habits_${user.id}`) || '[]');
    setHabits(savedHabits);
  }, [user.id]);

  const saveHabits = (updatedHabits) => {
    setHabits(updatedHabits);
    localStorage.setItem(`habits_${user.id}`, JSON.stringify(updatedHabits));
  };

  const handleAddHabit = (e) => {
    e.preventDefault();
    const validation = validateHabitName(newName);
    if (validation.error) {
      setError(validation.error);
      return;
    }
    const newHabit = {
      id: Date.now().toString(),
      name: validation.value,
      slug: getHabitSlug(validation.value),
      completions: [],
      createdAt: new Date().toISOString()
    };
    saveHabits([...habits, newHabit]);
    setNewName('');
    setError('');
  };

  const handleToggle = (habit) => {
    const today = new Date().toISOString().split('T')[0];
    const updatedHabit = toggleHabitCompletion(habit, today);
    const updatedHabits = habits.map(h => h.id === habit.id ? updatedHabit : h);
    saveHabits(updatedHabits);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      saveHabits(habits.filter(h => h.id !== id));
    }
  };

  return (
    <div data-testid="dashboard" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Habit Tracker</h2>
        <button onClick={onLogout} style={{ background: '#ff4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px' }}>Logout</button>
      </div>
      <p>Welcome, {user.email}</p>
      
      <form onSubmit={handleAddHabit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="New Habit (e.g. Gym)" 
          value={newName} 
          onChange={(e) => setNewName(e.target.value)}
          style={{ flex: 1, padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px' }}>Add</button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '-15px', fontSize: '0.8rem' }}>{error}</p>}

      <div className="habit-list">
        {habits.map(habit => (
          <div key={habit.id} data-testid="habit-item" style={{ border: '1px solid #555', padding: '10px', marginBottom: '10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ display: 'block' }}>{habit.name}</strong>
              <small>Streak: {calculateCurrentStreak(habit.completions)} days</small>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => handleToggle(habit)}
                style={{ backgroundColor: habit.completions.includes(new Date().toISOString().split('T')[0]) ? '#2ecc71' : '#555', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px' }}
              >
                {habit.completions.includes(new Date().toISOString().split('T')[0]) ? 'Done' : 'Check'}
              </button>
              <button onClick={() => handleDelete(habit.id)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 4. MAIN APP ---
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getSession());
    setLoading(false);
  }, []);

  const handleAuth = (userData) => setUser(userData);
  const handleLogout = () => { logout(); setUser(null); };

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onAuthSuccess={handleAuth} />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup onAuthSuccess={handleAuth} />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}