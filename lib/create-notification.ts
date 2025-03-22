// lib/create-notification.ts

type NotificationParams = {
    userId: number;
    type: string;
    message: string;
  };
  
  export async function createNotification({ userId, type, message }: NotificationParams) {
    try {
      // Get the base URL for the API
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 
                      (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
      
      // Create the full URL for the notifications endpoint
      const url = new URL('/api/notifications', baseUrl).toString();
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          type,
          message,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to create notification: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error creating notification:', error);
      // Don't throw the error to prevent breaking the main transaction
      return null;
    }
  }