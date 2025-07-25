// hooks/useUser.ts
import { useUserStore } from '@/stores/userStore';

export function useUser() {
  return useUserStore((s) => s.user);
}
