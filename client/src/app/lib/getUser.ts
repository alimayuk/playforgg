import { cookies } from 'next/headers';

export async function getUser() {
    const token = cookies().get('token')?.value;
    if (!token) return null;

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
        });
        if (!res.ok) return null;
        const user = await res.json();
        return user.user;
    } catch (e) {
        return null;
    }
}
