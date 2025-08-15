import HomePage from '@/components/pages/client/homePage';
import { cookies } from 'next/headers';

const fetchHomeData = async () => {
    const cookieStore = cookies();
    const locale = cookieStore.get("NEXT_LOCALE")?.value || "tr";

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/client/home?locale=${locale}`, {
        headers: {
            Accept: 'application/json',
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Veriler alınamadı');
    }

    return res.json();
};

const Page = async () => {
    const home = await fetchHomeData();
    return <HomePage initialData={home} />;
};

export default Page;
