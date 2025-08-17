import { getLocale } from '@/utils/localeUtils';
import HomePage from '@/components/pages/client/homePage';

const fetchHomeData = async () => {
    const locale = getLocale();
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
