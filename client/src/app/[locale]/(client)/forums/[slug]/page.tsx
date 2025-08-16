'use client';
import React, { useState, useEffect } from 'react';
import Title from '@/components/Title';
import { usePathname } from 'next/navigation';
import { ForumService, ForumTopicDetail } from '@/customServices/forms.service';
import { ClientService } from '@/customServices/client.service';
import { getCookie } from 'cookies-next';
import { useUserStore } from '@/stores/userStore';
import { CommentsService } from '@/customServices/comments.service';
import Link from 'next/link';

type ReplyType = {
  id: number;
  user: { id: number; username: string };
  text: string;
  created_at: string;
};

type CommentType = {
  id: number;
  user: { id: number; username: string };
  text: string;
  created_at: string;
  replies: ReplyType[];
};

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((+now - +date) / 1000);
  if (diff < 60) return `${diff} saniye önce`;
  if (diff < 3600) return `${Math.floor(diff / 60)} dakika önce`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} saat önce`;
  return `${Math.floor(diff / 86400)} gün önce`;
}

const ForumDetailPage = () => {
  const pathname = usePathname();
  const slug = pathname?.split('/').pop() || '';
  const [post, setPost] = useState<ForumTopicDetail | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [activeReply, setActiveReply] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const user = useUserStore((s) => s.user);
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editingReply, setEditingReply] = useState<number | null>(null);
  const [editReplyText, setEditReplyText] = useState("");
  const locale = getCookie("NEXT_LOCALE")?.toString() || "tr";
  const type = 'forum-topics';

  useEffect(() => {
    if (!slug) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const topicData = await ClientService.getTopicClient(slug);
        setPost(topicData.data);

        // Yorumları ayrıca çek
        const commentsRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/client/${type}/${topicData.data.id}/comments`
        );
        const commentsData = await commentsRes.json();
        setComments(commentsData);
      } catch (error) {
        console.error('Veri yüklenemedi:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  // Comment ekleme
  const handleAddComment = async () => {
    if (!commentText.trim() || !post?.id) return;
    setCommentsLoading(true);
    try {
      const newComment = await CommentsService.addComment(type, post.id, commentText);
      setComments(prev => [newComment, ...prev]);
      setCommentText('');
    } catch (err) {
      console.error(err);
    } finally {
      setCommentsLoading(false);
    }
  };

  // Reply ekleme
  const handleAddReply = async (commentId: number) => {
    if (!replyText.trim() || !post?.id) return;
    setCommentsLoading(true);
    try {
      const newReply = await CommentsService.addReply(type, post.id, commentId, replyText);
      setComments(prev =>
        prev.map(c =>
          c.id === commentId
            ? { ...c, replies: [...(c.replies || []), newReply] }
            : c
        )
      );
      setReplyText('');
      setActiveReply(null);
    } catch (err) {
      console.error(err);
    } finally {
      setCommentsLoading(false);
    }
  };

  // Comment veya Reply güncelleme
  const handleUpdateCommentOrReply = async (commentId: number, parentId: number | null, text: string) => {
    if (!text.trim() || !post?.id) return;
    try {
      const updated = await CommentsService.updateComment(type, post.id, commentId, text);
      if (parentId === null) {
        // Comment güncelleme
        setComments(prev =>
          prev.map(c => (c.id === commentId ? { ...c, text: updated.text } : c))
        );
        setEditingComment(null);
      } else {
        // Reply güncelleme
        setComments(prev =>
          prev.map(c =>
            c.id === parentId
              ? {
                ...c,
                replies: c.replies?.map(r => r.id === commentId ? { ...r, text: updated.text } : r) || []
              }
              : c
          )
        );
        setEditingReply(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Comment veya Reply silme
  const handleDeleteCommentOrReply = async (commentId: number, parentId: number | null) => {
    if (!confirm("Bu yorumu silmek istediğinize emin misiniz?") || !post?.id) return;
    try {
      await CommentsService.deleteComment(type, post.id, commentId);
      if (parentId === null) {
        // Comment silme
        setComments(prev => prev.filter(c => c.id !== commentId));
      } else {
        // Reply silme
        setComments(prev =>
          prev.map(c =>
            c.id === parentId
              ? { ...c, replies: c.replies?.filter(r => r.id !== commentId) || [] }
              : c
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || postLoading) return <div className="text-center py-20">Yükleniyor...</div>;
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
          <h2 className="text-xl font-semibold mb-4 text-orange-500">
            Yorumlar ({post.comments_count})
          </h2>

          {user ? (
            <div className="mb-6">
              <textarea
                placeholder="Yorumunuzu yazın (max 400 karakter)..."
                className="w-full border border-gray-600 bg-gray-700 rounded-lg p-3 text-sm text-gray-200 resize-none max-h-40"
                maxLength={400}
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <div className="flex justify-between items-center mt-2 text-gray-400">
                <span className="text-sm">{400 - commentText.length} karakter kaldı</span>
                <button
                  onClick={handleAddComment}
                  disabled={commentsLoading}
                  className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition disabled:opacity-50"
                >
                  Gönder
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm italic text-gray-400 mb-5">
              Yorum yapabilmek için <Link href="/auth/login" className="text-orange-500 hover:underline">giriş yapmalısınız</Link>.
            </p>
          )}

          {/* Comment list */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between">
                  <p className="font-semibold text-sm text-orange-400">{comment.user.username}</p>

                  {/* Eğer giriş yapmış kullanıcı kendi yorumunu görüyorsa */}
                  {user && user.id === comment.user.id && (
                    <div className="flex gap-2 text-xs text-gray-400">
                      <button
                        onClick={() => {
                          setActiveReply(null);
                          setReplyText("");
                          setEditingComment(comment.id);
                          setEditText(comment.text);
                        }}
                        className="hover:text-orange-500"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDeleteCommentOrReply(comment.id, null)}
                        className="hover:text-red-500"
                      >
                        Sil
                      </button>
                    </div>
                  )}
                </div>

                {/* Düzenleme modu */}
                {editingComment === comment.id ? (
                  <div className="mt-2">
                    <textarea
                      className="w-full border border-gray-600 bg-gray-800 rounded-lg p-2 text-sm text-gray-200 resize-none"
                      rows={2}
                      maxLength={400}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <div className="flex justify-end gap-2 mt-1">
                      <button
                        onClick={() => handleUpdateCommentOrReply(comment.id, null, editText)}
                        className="px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700"
                      >
                        Kaydet
                      </button>
                      <button
                        onClick={() => setEditingComment(null)}
                        className="px-3 py-1 text-sm text-gray-400 hover:underline"
                      >
                        Vazgeç
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-300 text-sm whitespace-pre-line break-words">{comment.text}</p>
                    <div className="text-xs text-gray-500 mt-1">{timeAgo(comment.created_at)}</div>
                  </>
                )}

                {user && (
                  <button
                    className="text-sm text-orange-500 mt-2 hover:underline"
                    onClick={() => setActiveReply(comment.id)}
                  >
                    Yanıtla
                  </button>
                )}

                {/* Replies */}
                {comment.replies?.map((reply) => (
                  <div key={reply.id} className="border-l-2 border-orange-700 pl-4 mt-3">
                    <p className="font-semibold text-sm text-orange-500">{reply.user.username}</p>

                    {editingReply === reply.id ? (
                      <>
                        <textarea
                          className="w-full border border-gray-600 bg-gray-800 rounded-lg p-2 text-sm text-gray-200 resize-none"
                          rows={2}
                          maxLength={400}
                          value={editReplyText}
                          onChange={(e) => setEditReplyText(e.target.value)}
                        />
                        <div className="flex gap-2 mt-1">
                          <button
                            onClick={() => handleUpdateCommentOrReply(reply.id, comment.id, editReplyText)}
                            className="px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700"
                          >
                            Kaydet
                          </button>
                          <button
                            onClick={() => setEditingReply(null)}
                            className="px-3 py-1 text-sm text-gray-400 hover:underline"
                          >
                            Vazgeç
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-300 text-sm whitespace-pre-line break-words">{reply.text}</p>
                        <div className="text-xs text-gray-500 mt-1">{timeAgo(reply.created_at)}</div>
                      </>
                    )}

                    {reply.user.id === user?.id && editingReply !== reply.id && (
                      <div className="flex gap-3 mt-1">
                        <button
                          onClick={() => {
                            setEditingReply(reply.id);
                            setEditReplyText(reply.text);
                          }}
                          className="text-xs text-blue-400 hover:underline"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDeleteCommentOrReply(reply.id, comment.id)}
                          className="text-xs text-red-400 hover:underline"
                        >
                          Sil
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Reply box */}
                {activeReply === comment.id && (
                  <div className="mt-2">
                    <textarea
                      placeholder="Yanıtınızı yazın (max 400 karakter)..."
                      className="w-full border border-gray-600 bg-gray-800 rounded-lg p-2 text-sm text-gray-200 resize-none max-h-36"
                      rows={2}
                      maxLength={400}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <div className="flex justify-between items-center mt-1 text-gray-400">
                      <span className="text-xs">{400 - replyText.length} karakter kaldı</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddReply(comment.id)}
                          disabled={commentsLoading}
                          className="text-sm px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 transition disabled:opacity-50"
                        >
                          Gönder
                        </button>
                        <button
                          onClick={() => {
                            setActiveReply(null);
                            setReplyText('');
                          }}
                          className="text-sm text-gray-400 hover:underline"
                        >
                          Vazgeç
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumDetailPage;