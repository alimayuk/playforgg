'use client';
import React, { useState, useEffect } from "react";
import Title from "@/components/Title";
import { ClientService } from "@/customServices/client.service";
import { ForumService, ForumTopic } from "@/customServices/forms.service";

const ForumPage = () => {
  const [posts, setPosts] = useState<ForumTopic[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Forum konularını API'den yükle
  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);
      try {
        const data = await ClientService.getAllTopicsClient();
        setPosts(data?.data);
      } catch (error) {
        console.error("Forum konuları yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const createdTopic = await ForumService.createTopic({
        title: newMessage.trim().slice(0, 255), // başlık olarak message kullanılıyor, istersen form geliştirilebilir
        content: newMessage.trim(),
        // category_id ve status eklenebilir
      });

      // Yeni oluşturulan konuyu listeye en başa ekle
      setPosts([createdTopic, ...posts]);
      setNewMessage("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Yeni gönderi oluşturulamadı:", error);
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

      {/* Modal */}
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
              <input type="text"  className="w-full p-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white border dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"/>
              <textarea
                className="w-full p-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white border dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={5}
                maxLength={400}
                placeholder="Başlık ve içerik (maks. 400 karakter)..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {newMessage.length}/400
                </span>
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

      {/* Forum Postları */}
      <div className="space-y-4">
        {loading && <p>Yükleniyor...</p>}
        {!loading && posts.length === 0 && <p>Henüz gönderi yok.</p>}
        {!loading &&
          posts.map((post) => (
            <a
              key={post.id}
              href={`/forums/${post.id}`}
              className="block bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-800 dark:text-white">
                  @{post.user?.username || "Bilinmeyen"}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(post.created_at).toLocaleDateString("tr-TR")}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed break-words line-clamp-4">
                {post.title}
              </p>
            </a>
          ))}
      </div>
    </div>
  );
};

export default ForumPage;
