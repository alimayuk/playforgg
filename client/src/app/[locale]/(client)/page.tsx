import { getLocale } from '@/utils/localeUtils';
import HomePage from '@/components/pages/client/homePage';
import { generateHomeMetadata } from '@/utils/metadataUtils';
import { Metadata } from 'next';

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

export async function generateMetadata(): Promise<Metadata> {
    const locale = getLocale();
    return generateHomeMetadata(locale);
}

const Page = async () => {
    const home = await fetchHomeData();
    return <HomePage initialData={home} />;
};

export default Page;
