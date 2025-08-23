'use client';
import React, { useState, useEffect } from "react";
import Title from "@/components/Title";
import { ClientService } from "@/services/client.service";
import { ForumService } from "@/services/forms.service";
import { useUserStore } from "@/stores/userStore";
import { useSearchParams, useRouter } from 'next/navigation';
import Empty from "@/components/Empty";
import Loading from "@/components/Loading";
import { ForumListResponse } from "@/types";
interface Props {
    initialData: ForumListResponse;
}
const ForumPage: React.FC<Props> = () => {
  const { user, clearUser } = useUserStore();
  const [posts, setPosts] = useState<Props['initialData']['data']>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category_id: ""
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({
    title: "",
    content: "",
    category_id: ""
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = parseInt(searchParams.get('page') || '1');
  const initialCategory = searchParams.get('category') || 'all';

  const [pagination, setPagination] = useState({
    current_page: initialPage,
    last_page: 1,
    per_page: 5,
    total: 0
  });
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // Fetch forum topics and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await ClientService.getAllTopicsClient({
          page: currentPage,
          category: selectedCategory !== 'all' ? selectedCategory : undefined
        });

        setPosts(data?.data || []);
        setCategories(data?.categories || []);
        setPagination({
          current_page: data?.meta?.current_page || 1,
          last_page: data?.meta?.last_page || 1,
          per_page: data?.meta?.per_page || 5,
          total: data?.meta?.total || 0
        });
      } catch (error) {
        console.error("Forum data loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, selectedCategory]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set('page', currentPage.toString());
    if (selectedCategory !== 'all') params.set('category', selectedCategory);

    router.push(`?${params.toString()}`, { scroll: false });
  }, [currentPage, selectedCategory]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const errors = {
      title: !formData.title.trim() ? "Başlık gereklidir" : "",
      content: !formData.content.trim() ? "İçerik gereklidir" : "",
      category_id: !formData.category_id ? "Kategori seçmelisiniz" : ""
    };

    setFormErrors(errors);
    return !errors.title && !errors.content && !errors.category_id;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const createdTopic = await ForumService.createTopic({
        title: formData.title.trim(),
        content: formData.content.trim(),
        category_id: formData.category_id
      });

      setPosts([createdTopic, ...posts]);
      setFormData({
        title: "",
        content: "",
        category_id: ""
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create topic:", error);
      alert(error.error);
    }
  };

  const changePage = (direction: 'prev' | 'next') => {
    setCurrentPage(prev => {
      if (direction === 'prev') return Math.max(prev - 1, 1);
      if (direction === 'next') return Math.min(prev + 1, pagination.last_page);
      return prev;
    });
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-12 space-y-8">
      <Title title1="Topluluk" title2="Forumları" />

      <div className="flex justify-between items-center">
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-gray-800 text-white py-2 px-4 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">Tüm Kategoriler</option>
          {categories.map(category => (
            <option key={category.id} value={category.slug}>
              {category.title}
            </option>
          ))}
        </select>

        {user ? (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition"
          >
            + Yeni Gönderi
          </button>
        ) : (
          <p className="text-gray-500">
            Gönderi oluşturabilmek için giriş yapınız.
          </p>
        )}
      </div>

      {/* New Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-2xl shadow-xl relative">
            <button
              aria-label="Close modal"
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-4xl"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Yeni Gönderi Oluştur
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Başlık*
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  maxLength={100}
                  className={`w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white border ${formErrors.title ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                    } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="Gönderi başlığı (maks. 100 karakter)"
                />
                {formErrors.title && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>
                )}
              </div>

              <div>
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kategori*
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className={`w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white border ${formErrors.category_id ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                    } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                >
                  <option value="">Kategori seçiniz</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
                {formErrors.category_id && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.category_id}</p>
                )}
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  İçerik*
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={6}
                  maxLength={2000}
                  className={`w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white border ${formErrors.content ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                    } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="Gönderi içeriğinizi yazın (maks. 2000 karakter)"
                />
                {formErrors.content && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.content}</p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
                  {formData.content.length}/2000
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition"
                >
                  Paylaş
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Forum Posts */}
      <div className="space-y-4">
        {loading ? (
          <Loading />
        ) : posts.length === 0 ? (
          <Empty
            title="Gönderi bulunamadı"
            description="Seçtiğiniz kriterlere uygun gönderi bulunamadı."
          />
        ) : (
          posts.map((post) => (
            <a
              key={post.id}
              href={`/forums/${post.slug}`}
              className="block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-sm font-semibold text-orange-600">
                    {post.category?.title || "Genel"}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-800 flex gap-2 dark:text-white mt-1">
                    <span className="text-gray-600">@{post.user?.username || "Bilinmeyen"}</span>
                    {post.title}
                  </h3>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {new Date(post.created_at).toLocaleDateString("tr-TR")}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed break-words line-clamp-3">
                {post.content}
              </p>
            </a>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.last_page > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => changePage('prev')}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded bg-gray-700 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed text-gray-300 hover:bg-gray-600 transition"
          >
            ← Önceki
          </button>
          <span className="text-sm text-gray-300">
            Sayfa {currentPage} / {pagination.last_page}
          </span>
          <button
            onClick={() => changePage('next')}
            disabled={currentPage === pagination.last_page}
            className="px-4 py-2 rounded bg-gray-700 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed text-gray-300 hover:bg-gray-600 transition"
          >
            Sonraki →
          </button>
        </div>
      )}
    </div>
  );
};

export default ForumPage;