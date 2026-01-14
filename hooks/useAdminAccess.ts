// hooks/useAdminAccess.ts
'use client';

import { useState, useEffect } from 'react';

const ADMIN_TOKEN_KEY = 'nextsearch-admin-token';
const ADMIN_TOKEN_EXPIRY_KEY = 'nextsearch-admin-token-expiry';

/**
 * Hook to check if admin access is currently active
 */
export function useAdminAccess() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const expiry = localStorage.getItem(ADMIN_TOKEN_EXPIRY_KEY);
      if (expiry && Date.now() < parseInt(expiry, 10)) {
        setIsAuthenticated(true);
      } else {
        // Clear expired token
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        localStorage.removeItem(ADMIN_TOKEN_EXPIRY_KEY);
        setIsAuthenticated(false);
      }
    };

    // Check on mount
    checkAuth();

    // Listen to localStorage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent | Event) => {
      if (e instanceof StorageEvent) {
        if (e.key === ADMIN_TOKEN_KEY || e.key === ADMIN_TOKEN_EXPIRY_KEY) {
          checkAuth();
        }
      } else {
        // Custom storage event from same tab
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Periodically check (in case of expiry)
    const interval = setInterval(checkAuth, 60000); // Check every minute

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return isAuthenticated;
}
