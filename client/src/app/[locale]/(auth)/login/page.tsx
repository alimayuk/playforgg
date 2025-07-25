'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UsersService } from '@/customServices/users.service';
import { jwtTokenCreate } from '@/utils/jwtTokenCreate';

const LoginPage = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123123asd');
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await UsersService.login({ username, password });
      if (res.status === 'success' && res.user) {
        await jwtTokenCreate(res.user);
        const urlParams = new URLSearchParams(window.location.search);
        const nextPath = urlParams.get("next") || "/admin";
        window.location.href = nextPath;
      } else {
        setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
      }
    } catch (err: any) {
      setError(err?.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-black">Giriş Yap</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Kullanıcı Adı"
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Şifre"
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded"
          >
            Giriş Yap
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-black">
          Hesabınız yok mu?{' '}
          <a href="/register" className="text-orange-500 hover:underline">
            Kayıt Ol
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
