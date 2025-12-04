import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '@constants/config';

const UserProgressContext = createContext();

export const useUserProgress = () => {
  const context = useContext(UserProgressContext);
  if (!context) {
    throw new Error('useUserProgress must be used within UserProgressProvider');
  }
  return context;
};

export const UserProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState({
    chatbotCompleted: 0,
    imageRecognitionCompleted: 0,
    textClassificationCompleted: 0,
    totalExperiments: 0,
    achievements: [],
    streak: 1
  });

  useEffect(() => {
    // Charger la progression depuis le localStorage
    const savedProgress = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setProgress((prev) => ({ ...prev, ...parsed }));
      } catch {}
    }
    // Gestion simple du streak quotidien
    try {
      const today = new Date();
      const key = `${STORAGE_KEYS.USER_PROGRESS}:last_visit`;
      const last = localStorage.getItem(key);
      let newStreak = 1;
      if (last) {
        const lastDate = new Date(last);
        const startOf = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const diffDays = Math.floor((startOf(today) - startOf(lastDate)) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) {
          newStreak = progress.streak || 1; // unchanged
        } else if (diffDays === 1) {
          newStreak = (progress.streak || 1) + 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
      }
      localStorage.setItem(key, today.toISOString());
      setProgress((prev) => {
        const updated = { ...prev, streak: newStreak };
        localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(updated));
        return updated;
      });
    } catch {}
  }, []);

  const updateProgress = (module, value) => {
    setProgress(prev => {
      const updated = { ...prev, [module]: value };
      localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(updated));
      return updated;
    });
  };

  const incrementExperiments = () => {
    updateProgress('totalExperiments', progress.totalExperiments + 1);
  };

  const addAchievement = (achievement) => {
    if (!progress.achievements.includes(achievement)) {
      setProgress(prev => {
        const updated = {
          ...prev,
          achievements: [...prev.achievements, achievement]
        };
        localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(updated));
        return updated;
      });
    }
  };

  const resetProgress = () => {
    const initialProgress = {
      chatbotCompleted: 0,
      imageRecognitionCompleted: 0,
      textClassificationCompleted: 0,
      totalExperiments: 0,
      achievements: []
    };
    setProgress(initialProgress);
    localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(initialProgress));
  };

  const value = {
    progress,
    updateProgress,
    incrementExperiments,
    addAchievement,
    resetProgress
  };

  return (
    <UserProgressContext.Provider value={value}>
      {children}
    </UserProgressContext.Provider>
  );
};