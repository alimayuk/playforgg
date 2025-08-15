import React from 'react';
import Link from 'next/link';

export interface BlogPost {
  id: string | number;
  author: string;
  slug: string;
  title: string;
  image: string;
  date: string;
}

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <article
      key={post.id}
      className="relative rounded-xl overflow-hidden cursor-pointer group shadow-lg isolate bg-gray-900 h-64"
    >
      {/* Arka plan resmi */}
      <img
        src={`${process.env.NEXT_PUBLIC_GLOBAL_SERVER_URL}/${post.image}`}
        alt={post.title}
        className="absolute inset-0 w-full h-full object-cover -z-10 transition-transform duration-500 group-hover:scale-105"
      />

      {/* Karartma overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/70 to-transparent -z-10 rounded-xl" />

      {/* Alt içerik */}
      <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 bg-gradient-to-t from-gray-900/90 to-transparent rounded-b-xl flex flex-col">
        {/* Başlık */}
        <div className="text-white text-xl font-semibold leading-tight transition-transform duration-500 group-hover:-translate-y-2 space-y-1">
          <h3>{post.title}</h3>
          <p className="text-gray-400 text-sm">{post.author}</p>
        </div>
        {/* Tarih ve link */}
        <div
          className="flex items-center justify-between mt-1 opacity-0 max-h-0 overflow-hidden transition-all duration-500 group-hover:opacity-100 group-hover:max-h-10"
          style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
          <time className="text-gray-300 text-sm select-none" dateTime={post.date}>
            {post.date}
          </time>
          <Link
            href={`/blogs/${post.slug}`}
            className="text-orange-400 hover:text-orange-200 font-medium text-sm transition"
          >
            Devamını Oku →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
