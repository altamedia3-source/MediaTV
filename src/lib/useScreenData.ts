import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { ScreenData, MediaItem, TextItem, AppSettings } from '../types';
import { defaultSettings } from '../db/db';

export function useScreenData(screenId: string) {
  const [data, setData] = useState<ScreenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!screenId) return;
    
    let unsubscribe: () => void;

    const initialize = async () => {

      const docRef = doc(db, 'screens', screenId);
      
      unsubscribe = onSnapshot(docRef, async (snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.data() as ScreenData);
        } else {
          // Create initial data if it doesn't exist
          const initialData: ScreenData = {
            settings: defaultSettings,
            media: [],
            texts: []
          };
          await setDoc(docRef, initialData);
          // Snapshot listener will catch the creation
        }
        setLoading(false);
      }, (err) => {
        console.error("Firebase listen error:", err);
        setError(err);
        setLoading(false);
      });
    };

    initialize();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [screenId]);

  const updateScreenData = async (newData: Partial<ScreenData>) => {
    if (!screenId) return;
    const docRef = doc(db, 'screens', screenId);
    // use setDoc with merge to update fields
    await setDoc(docRef, newData, { merge: true });
  };

  return { data, loading, error, updateScreenData };
}
