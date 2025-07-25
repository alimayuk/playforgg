import Categories from '@/components/adminPages/Categories';
import { cookies } from 'next/headers';

const fetchCategories = async () => {
  const token = cookies().get('token')?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/categories`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Kategori alınamadı');
  }
  return res.json();
};

const Page = async () => {
  const categories = await fetchCategories();

  return <Categories cats={categories} />;
};

export default Page;
