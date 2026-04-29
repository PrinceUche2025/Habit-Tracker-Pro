export const signup = (email, password) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  if (users.find(u => u.email === email)) {
    throw new Error('Duplicate signup email');
  }
  const newUser = { email, password, id: Date.now().toString() };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  return newUser;
};

export const login = (email, password) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    throw new Error('Invalid login credentials');
  }
  localStorage.setItem('activeSession', JSON.stringify(user));
  return user;
};

export const logout = () => {
  localStorage.removeItem('activeSession');
};

export const getSession = () => {
  const session = localStorage.getItem('activeSession');
  return session ? JSON.parse(session) : null;
};