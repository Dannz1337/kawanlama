
import React, { useState } from 'react';
import { User } from '../types';

interface AuthPanelProps {
  onLogin: (user: User) => void;
}

const AuthPanel: React.FC<AuthPanelProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const users: (User & { password: string })[] = JSON.parse(localStorage.getItem('users') || '[]');

    if (isRegistering) {
      if (users.find(u => u.username === username)) {
        alert('Username already exists');
        return;
      }
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        username,
        fullName,
        password,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('users', JSON.stringify([...users, newUser]));
      onLogin(newUser);
    } else {
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        onLogin(user);
      } else {
        alert('Invalid username or password');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-blue-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-blue-600 p-8 text-white text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">KawanLama Portal</h2>
          <p className="text-blue-100 text-sm mt-1">Sistem Manajemen Nota Digital</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
              <input 
                required
                type="text" 
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="John Doe"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input 
              required
              type="text" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="admin123"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              required
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="••••••••"
            />
          </div>
          
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 mt-4">
            {isRegistering ? 'Daftar Sekarang' : 'Masuk'}
          </button>
          
          <div className="text-center mt-4">
            <button 
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-sm text-blue-600 hover:underline"
            >
              {isRegistering ? 'Sudah punya akun? Masuk di sini' : 'Belum punya akun? Daftar di sini'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPanel;
