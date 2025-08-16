'use client';
import React, { useState, useEffect } from "react";
import Title from "@/components/Title";
import { ClientService } from "@/customServices/client.service";
import { ForumService, ForumTopic } from "@/customServices/forms.service";

const ForumPage = () => {
  const [posts, setPosts] = useState<ForumTopic[]>([]);
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

  // Fetch forum topics and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await ClientService.getAllTopicsClient();
        setPosts(data?.data || []);
        setCategories(data?.categories || []);
      } catch (error) {
        console.error("Forum data loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
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

      // Add new topic to the beginning of the list
      setPosts([createdTopic, ...posts]);
      
      // Reset form and close modal
      setFormData({
        title: "",
        content: "",
        category_id: ""
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create topic:", error);
      alert("Gönderi oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-12 space-y-8">
      <Title title1="Topluluk" title2="Forumları" />

      <div className="flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition"
        >
          + Yeni Gönderi
        </button>
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
                  className={`w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white border ${
                    formErrors.title ? "border-red-500" : "border-gray-300 dark:border-gray-700"
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
                  className={`w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white border ${
                    formErrors.category_id ? "border-red-500" : "border-gray-300 dark:border-gray-700"
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
                  className={`w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white border ${
                    formErrors.content ? "border-red-500" : "border-gray-300 dark:border-gray-700"
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
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-lg">Henüz gönderi bulunmamaktadır.</p>
            <p className="mt-2">İlk gönderiyi siz oluşturun!</p>
          </div>
        ) : (
          posts.map((post) => (
            <a
              key={post.id}
              href={`/forums/${post.id}`}
              className="block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-sm font-semibold text-orange-600">
                    {post.category?.title || "Genel"}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-1">
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
              <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span>@{post.user?.username || "Bilinmeyen"}</span>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
};

export default ForumPage;