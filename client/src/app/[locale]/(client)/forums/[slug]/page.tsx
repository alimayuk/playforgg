'use client';
import React, { useState } from 'react';
import Title from '@/components/Title';

const ForumDetailPage = () => {
  const post = {
    id: 1,
    user: 'GamerTR',
    date: '04.07.2025',
    message: "CS2'de AWP nerf'ü hakkında ne düşünüyorsunuz?",
  };

  const [comments, setComments] = useState([
    {
      id: 1,
      user: 'CSFan',
      date: '04.07.2025',
      message: 'Gerçekten AWP çok zayıfladı...',
      replies: [
        {
          id: 101,
          user: 'SniperKing',
          date: '04.07.2025',
          message: 'Katılıyorum, eski gücü kalmadı.',
        },
      ],
    },
  ]);

  const [newComment, setNewComment] = useState('');
  const [replyInputs, setReplyInputs] = useState<{ [key: number]: string }>({});
  const [replyVisibility, setReplyVisibility] = useState<{ [key: number]: boolean }>({});
  const [filter, setFilter] = useState<'newest' | 'oldest'>('newest');

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const newEntry = {
      id: Date.now(),
      user: 'Kullanıcı',
      date: new Date().toLocaleDateString('tr-TR'),
      message: newComment,
      replies: [],
    };
    setComments([newEntry, ...comments]);
    setNewComment('');
  };

  const handleAddReply = (commentId: number) => {
    const replyText = replyInputs[commentId];
    if (!replyText?.trim()) return;

    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              replies: [
                ...c.replies,
                {
                  id: Date.now(),
                  user: 'Yanıtlayan',
                  date: new Date().toLocaleDateString('tr-TR'),
                  message: replyText,
                },
              ],
            }
          : c
      )
    );

    setReplyInputs({ ...replyInputs, [commentId]: '' });
    setReplyVisibility({ ...replyVisibility, [commentId]: false });
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

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-12 space-y-8">
      <Title title1="Forum" title2="Gönderisi" />

      {/* Gönderi */}
      <div className="bg-gray-900 text-white rounded-lg p-6 shadow border border-gray-700">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>@{post.user}</span>
          <span>{post.date}</span>
        </div>
        <p className="text-lg">{post.message}</p>
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
          <div key={comment.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 space-y-3">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>@{comment.user}</span>
              <span>{comment.date}</span>
            </div>
            <p className="text-white">{comment.message}</p>

            {/* Yanıtlar */}
            {comment.replies.map((reply) => (
              <div
                key={reply.id}
                className="ml-4 mt-3 border-l-2 border-orange-500 pl-4 text-sm text-gray-300"
              >
                <div className="flex justify-between text-xs mb-1">
                  <span>@{reply.user}</span>
                  <span>{reply.date}</span>
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

            {/* Yanıtla alanı (gizli/görünür) */}
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
