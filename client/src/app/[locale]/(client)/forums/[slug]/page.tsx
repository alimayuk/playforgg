'use client';
import React, { useState, useEffect } from 'react';
import Title from '@/components/Title';
import { usePathname } from 'next/navigation';
import { ClientService } from '@/services/client.service';
import CommentsSection from '@/components/CommentsSection';
import { ForumTopicDetail } from '@/types';
import { getLocale } from '@/utils/localeUtils';


const ForumDetailPage = () => {
  const pathname = usePathname();
  const slug = pathname?.split('/').pop() || '';
  const [post, setPost] = useState<ForumTopicDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(false);
  const locale = getLocale();
  useEffect(() => {
    if (!slug) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const topicData = await ClientService.getTopicClient(slug);
        setPost(topicData.data);
      } catch (error) {
        console.error('Veri yüklenemedi:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  if (loading || postLoading) return <div className="text-center py-20">Yükleniyor...</div>;
  if (!post) return <div className="text-center py-20">Gönderi bulunamadı.</div>;

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-12 space-y-8">
      <Title title1="Forum" title2="Gönderisi" />

      <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-700/50 hover:border-gray-600/50 transition-colors">

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

        <h1 className="text-2xl font-bold text-gray-100 mb-4 leading-tight">
          {post.title}
        </h1>

        <div className="prose prose-invert max-w-none mb-5 prose-p:leading-relaxed prose-p:text-gray-300/90">
          {post.content}
        </div>

        <div className="flex items-center gap-2.5 pt-3 border-t border-gray-800/50">
          <span className="text-sm font-medium text-gray-300/90">
            @{post.user.username}
          </span>
          <span className="text-xs text-gray-500/80 before:content-['•'] before:mx-1.5">
            {post.views.toLocaleString('tr-TR')} görüntülenme
          </span>
        </div>
      </div>
      <CommentsSection
        type="forum-topics"
        contentId={post.id}
      />
    </div>
  );
};

export default ForumDetailPage;