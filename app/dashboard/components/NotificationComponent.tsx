"use client";

import { useEffect, useState } from "react";
import { NotificationBell } from "./notifications/notification-bell";

export default function NotificationComponent() {
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const userData = await response.json();
        
        if (userData?.idUsers) {
          setUserId(typeof userData.idUsers === 'string' ? parseInt(userData.idUsers, 10) : userData.idUsers);
        }
      } catch (error) {
        console.error('Error fetching user session:', error);
      }
    };
    
    fetchUserData();
  }, []);

  if (!userId) return null;

  return <NotificationBell userId={userId} />;
}