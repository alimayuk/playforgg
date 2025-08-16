'use client';
import React, { useState, useEffect } from 'react';
import Title from '@/components/Title';
import { usePathname } from 'next/navigation';
import { ForumService, ForumTopicDetail } from '@/customServices/forms.service';
import { ClientService } from '@/customServices/client.service';
import CommentItem from '@/components/CommentItem';
import { getCookie } from 'cookies-next';

const ForumDetailPage = () => {
  const pathname = usePathname();
  const slug = pathname?.split('/').pop() || '';
  const [post, setPost] = useState<ForumTopicDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const locale = getCookie("NEXT_LOCALE")?.toString() || "tr";
  useEffect(() => {
    if (!slug) return;

    const loadData = async () => {
      try {
        const topicData = await ClientService.getTopicClient(slug);
        setPost(topicData.data);
        setComments(topicData.data.comments || []);
      } catch (error) {
        console.error('Gönderi yüklenemedi:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !post?.id) return;
    try {
      const createdComment = await ForumService.addComment(post.id, newComment.trim());
      setComments([createdComment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Yorum eklenemedi:', error);
    }
  };

  if (loading) return <div className="text-center py-20">Yükleniyor...</div>;
  if (!post) return <div className="text-center py-20">Gönderi bulunamadı.</div>;

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-12 space-y-8">
      <Title title1="Forum" title2="Gönderisi" />

      {/* Gönderi Detayları */}
      <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-700/50 hover:border-gray-600/50 transition-colors">
        {/* Kategori ve Tarih */}
        <div className="flex justify-between items-start mb-4">
          <span className="inline-block px-2.5 py-1 text-xs font-medium bg-orange-500/10 text-orange-400 rounded-full">
            {post.category?.title}
          </span>
          <span className="text-xs text-gray-400/80 font-medium">
            {new Date(post.created_at).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>

        {/* Başlık */}
        <h1 className="text-2xl font-bold text-gray-100 mb-4 leading-tight">
          {post.title}
        </h1>

        {/* İçerik */}
        <div className="prose prose-invert max-w-none mb-5 prose-p:leading-relaxed prose-p:text-gray-300/90">
          {post.content}
        </div>

        {/* Kullanıcı Bilgileri */}
        <div className="flex items-center gap-2.5 pt-3 border-t border-gray-800/50">
          <span className="text-sm font-medium text-gray-300/90">
            @{post.user.username}
          </span>
          <span className="text-xs text-gray-500/80 before:content-['•'] before:mx-1.5">
            {post.views.toLocaleString('tr-TR')} görüntülenme
          </span>
        </div>
      </div>

      {/* Yorum Bölümü */}
      <div className="space-y-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            Yorumlar ({post.comments_count})
          </h2>

          {/* Yorum Ekleme */}
          <div className="mb-6">
            <textarea
              className="w-full bg-gray-700 text-white p-3 rounded-md"
              rows={3}
              placeholder="Yorumunuzu yazın..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              onClick={handleAddComment}
              className="mt-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md"
            >
              Yorum Gönder
            </button>
          </div>

          {/* Yorum Listesi */}
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={(reply) => {
                setComments(comments.map(c =>
                  c.id === comment.id
                    ? { ...c, replies: [...c.replies, reply] }
                    : c
                ));
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForumDetailPage;