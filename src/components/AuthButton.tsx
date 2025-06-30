import React from 'react';
import { motion } from 'framer-motion';
import { Github, User, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AuthButton: React.FC = () => {
  const { user, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-lg">
        <Loader2 className="w-4 h-4 text-white animate-spin" />
        <span className="text-white text-sm">Authenticating...</span>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-lg">
          <img 
            src={user.avatar_url} 
            alt={user.name || user.login}
            className="w-6 h-6 rounded-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const userIcon = target.nextElementSibling as HTMLElement;
              if (userIcon) userIcon.style.display = 'block';
            }}
          />
          <User className="w-4 h-4 text-white hidden" />
          <span className="text-white text-sm font-medium">
            {user.name || user.login}
          </span>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
          title="Logout"
        >
          <LogOut className="w-4 h-4 text-red-400" />
        </motion.button>
      </div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={login}
      className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-600"
    >
      <Github className="w-4 h-4 text-white" />
      <span className="text-white text-sm font-medium">Sign in with GitHub</span>
    </motion.button>
  );
};

export default AuthButton;