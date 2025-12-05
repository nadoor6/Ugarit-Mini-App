import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { initData } from '@tma.js/sdk-react';
import { useSignal } from '@tma.js/sdk-react';

export function App() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const initDataValue = useSignal(initData.state);

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);

    if (error) {
      console.error('Error fetching profiles:', error);
    } else {
      setProfiles(data || []);
      console.log('Profiles fetched:', data);
    }
  };

  const saveTelegramUser = async () => {
    const tgUser = initDataValue?.user;

    if (!tgUser) {
      console.log('No Telegram user data found (maybe running in browser).');
      return;
    }

    console.log('Telegram User Data:', tgUser);

    // ✅ CRITICAL: REPLACE THIS URL WITH YOUR REAL FUNCTION URL FROM SUPABASE
    const functionUrl = 'https://YOUR-PROJECT-ID.supabase.co/functions/v1/telegram-auth';

    try {
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegram_id: tgUser.id,
          username: tgUser.username,
          first_name: tgUser.first_name,
          last_name: tgUser.last_name,
        }),
      });
      const result = await response.json();
      console.log('User save result:', result);
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  };

  useEffect(() => {
    fetchProfiles();
    saveTelegramUser();
  }, []);

  return (
    <div>
      <h1>Ugarit Marketplace</h1>
      <p>Testing Supabase Connection...</p>
      <ul>
        {profiles.map((profile) => (
          <li key={profile.id}>
            Telegram ID: {profile.telegram_id} - User: {profile.username}
          </li>
        ))}
      </ul>
    </div>
  );
}