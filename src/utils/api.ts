import { projectId, publicAnonKey } from './supabase/info';
import type { WardrobeItem, Event } from '../App';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-6ffccf69`;

function getHeaders() {
  const session = localStorage.getItem('auth_session');
  const accessToken = session ? JSON.parse(session).accessToken : publicAnonKey;
  
  return {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
}

export const wardrobeAPI = {
  async getAll(): Promise<WardrobeItem[]> {
    try {
      const response = await fetch(`${API_BASE}/wardrobe`, { 
        headers: getHeaders() 
      });
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error fetching wardrobe items:', data.error);
        return [];
      }
      
      return data.items || [];
    } catch (error) {
      console.error('Error fetching wardrobe items:', error);
      return [];
    }
  },

  async add(item: WardrobeItem): Promise<WardrobeItem | null> {
    try {
      const response = await fetch(`${API_BASE}/wardrobe`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ item }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error adding wardrobe item:', data.error);
        return null;
      }
      
      return data.item || null;
    } catch (error) {
      console.error('Error adding wardrobe item:', error);
      return null;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/wardrobe/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error deleting wardrobe item:', data.error);
        return false;
      }
      
      return data.success || false;
    } catch (error) {
      console.error('Error deleting wardrobe item:', error);
      return false;
    }
  },
};

export const eventsAPI = {
  async getAll(): Promise<Event[]> {
    try {
      const response = await fetch(`${API_BASE}/events`, { 
        headers: getHeaders() 
      });
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error fetching events:', data.error);
        return [];
      }
      
      return (data.events || []).map((event: any) => ({
        ...event,
        date: new Date(event.date),
      }));
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  },

  async add(event: Event): Promise<Event | null> {
    try {
      const response = await fetch(`${API_BASE}/events`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ event }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error adding event:', data.error);
        return null;
      }
      
      return data.event ? { ...data.event, date: new Date(data.event.date) } : null;
    } catch (error) {
      console.error('Error adding event:', error);
      return null;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/events/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error deleting event:', data.error);
        return false;
      }
      
      return data.success || false;
    } catch (error) {
      console.error('Error deleting event:', error);
      return false;
    }
  },
};
