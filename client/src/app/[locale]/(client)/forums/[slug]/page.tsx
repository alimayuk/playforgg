'use client';
import React, { useState, useEffect } from 'react';
import Title from '@/components/Title';
import {usePathname } from 'next/navigation'; // sayfa parametresi için
import { ForumComment, ForumService, ForumTopicDetail } from '@/customServices/forms.service';
import { ClientService } from '@/customServices/client.service';

const ForumDetailPage = () => {
  const pathname = usePathname(); // örn: /forums/1
  const topicId = Number(pathname?.split('/').pop());
  const [post, setPost] = useState<ForumTopicDetail | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyInputs, setReplyInputs] = useState<{ [key: number]: string }>({});
  const [replyVisibility, setReplyVisibility] = useState<{ [key: number]: boolean }>({});
  const [filter, setFilter] = useState<'newest' | 'oldest'>('newest');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!topicId) return;
    setLoading(true);
    ClientService.getTopicClient(topicId)
      .then((data) => {
        setPost(data);
        setComments(data.comments);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [topicId]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !topicId) return;
    try {
      const createdComment = await ForumService.addComment(topicId, newComment.trim());
      setComments([createdComment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Yorum eklenemedi:', error);
    }
  };

  const handleAddReply = async (commentId: number) => {
    const replyText = replyInputs[commentId];
    if (!replyText?.trim() || !topicId) return;
    try {
      const createdReply = await ForumService.addComment(topicId, replyText.trim(), commentId);
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, replies: [...c.replies, createdReply] } : c
        )
      );
      setReplyInputs({ ...replyInputs, [commentId]: '' });
      setReplyVisibility({ ...replyVisibility, [commentId]: false });
    } catch (error) {
      console.error('Yanıt eklenemedi:', error);
    }
  };

  const toggleReplyVisibility = (commentId: number) => {
    setReplyVisibility((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const sortedComments =
    filter === 'newest'
      ? [...comments].sort((a, b) => b.id - a.id)
      : [...comments].sort((a, b) => a.id - b.id);

  if (loading) return <p className="text-center py-20">Yükleniyor...</p>;
  if (!post) return <p className="text-center py-20">Gönderi bulunamadı.</p>;

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-12 space-y-8">
      <Title title1="Forum" title2="Gönderisi" />

      {/* Gönderi */}
      <div className="bg-gray-900 text-white rounded-lg p-6 shadow border border-gray-700">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>@{post.user?.username || 'Bilinmeyen'}</span>
          <span>{new Date(post.created_at).toLocaleDateString('tr-TR')}</span>
        </div>
        <h1 className="text-xl font-semibold mb-2">{post.title}</h1>
        <p className="text-lg">{post.content}</p>
      </div>

      {/* Yorum Ekle */}
      <div className="bg-gray-800 p-4 rounded-lg space-y-3 border border-gray-700">
        <textarea
          className="w-full bg-gray-700 text-white p-3 rounded-md resize-none"
          rows={3}
          placeholder="Yorum ekle (en fazla 400 karakter)..."
          maxLength={400}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>{newComment.length}/400</span>
          <button
            onClick={handleAddComment}
            className="bg-orange-600 hover:bg-orange-700 px-4 py-2 text-white rounded-md"
          >
            Paylaş
          </button>
        </div>
      </div>

      {/* Filtreleme */}
      <div className="flex justify-end space-x-3 text-sm text-gray-400">
        <span>Sırala:</span>
        <button
          onClick={() => setFilter('newest')}
          className={`hover:underline ${filter === 'newest' ? 'text-orange-500' : ''}`}
        >
          En Yeni
        </button>
        <button
          onClick={() => setFilter('oldest')}
          className={`hover:underline ${filter === 'oldest' ? 'text-orange-500' : ''}`}
        >
          En Eski
        </button>
      </div>

      {/* Yorumlar */}
      <div className="space-y-6">
        {sortedComments.map((comment) => (
          <div
            key={comment.id}
            className="bg-gray-800 p-4 rounded-lg border border-gray-700 space-y-3"
          >
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>@{comment.user?.name || 'Bilinmeyen'}</span>
              <span>{new Date(comment.date).toLocaleDateString('tr-TR')}</span>
            </div>
            <p className="text-white">{comment.message}</p>

            {/* Yanıtlar */}
            {comment.replies.map((reply) => (
              <div
                key={reply.id}
                className="ml-4 mt-3 border-l-2 border-orange-500 pl-4 text-sm text-gray-300"
              >
                <div className="flex justify-between text-xs mb-1">
                  <span>@{reply.user?.name || 'Bilinmeyen'}</span>
                  <span>{new Date(reply.date).toLocaleDateString('tr-TR')}</span>
                </div>
                <p>{reply.message}</p>
              </div>
            ))}

            {/* Yanıtla butonu */}
            <button
              onClick={() => toggleReplyVisibility(comment.id)}
              className="text-sm text-orange-500 mt-2 hover:underline"
            >
              {replyVisibility[comment.id] ? 'İptal' : 'Yanıtla'}
            </button>

            {/* Yanıtla alanı */}
            {replyVisibility[comment.id] && (
              <div className="mt-2 space-y-2">
                <textarea
                  rows={2}
                  maxLength={400}
                  placeholder="Yanıtınızı yazın..."
                  className="w-full bg-gray-700 text-white p-2 rounded-md text-sm"
                  value={replyInputs[comment.id] || ''}
                  onChange={(e) =>
                    setReplyInputs({ ...replyInputs, [comment.id]: e.target.value })
                  }
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{(replyInputs[comment.id]?.length || 0)}/400</span>
                  <button
                    onClick={() => handleAddReply(comment.id)}
                    className="text-orange-500 hover:underline"
                  >
                    Yanıtı Gönder
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForumDetailPage;
