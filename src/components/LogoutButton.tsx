'use client';

import { useLogout } from '@/hooks/useLogout';

export default function LogoutButton() {
  const logout = useLogout();
  return (
    <button
      onClick={logout}
      className="ml-4 text-gray-700 hover:text-teal-900"
    >
      Logout
    </button>
  );
}
