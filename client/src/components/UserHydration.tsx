'use client';
import { useEffect } from 'react';
import { useUserStore, User } from '@/stores/userStore';

export default function UserHydration({ user }: { user: User | null }) {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user]);

  return null;
}
