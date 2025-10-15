'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { MessageSquare } from 'lucide-react'
import { timeAgo } from '@/utils/time'
import { useParams } from 'next/navigation'

interface Comment {
    id: number
    text: string
    commentable_type: string
    commentable_id: number
    commentable_slug: string
    commentable_title: string
    created_at: string
}

interface UserType {
    id: number
    username: string
    email: string
    comments: Comment[]
    blog_comments: Comment[]
    forum_comments: Comment[]
    created_at: string
}

const ProfilePage = () => {
    const [user, setUser] = useState<UserType | null>(null);
    const params = useParams<{ username: string }>()
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/profile/${params.username}`, {
                    credentials: 'include',
                })
                const data = await res.json()
                setUser(data.data)
            } catch (err) {
                console.error('Profil alınamadı:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [])

    if (loading) return <div className="p-4 text-center">⏳ Yükleniyor...</div>
    if (!user) return <div className="p-4 text-center text-red-500">❌ Kullanıcı bulunamadı</div>

    // Her tip için 5 yorum al (user.comments boşsa [])
    const blogComments = (user?.blog_comments ?? [])
        .slice(0, 5)

    const forumComments = (user?.forum_comments ?? [])
        .slice(0, 5)


    // Kullanıcı baş harfi
    const avatarLetter = user.username.charAt(0).toUpperCase()

    return (
        <div className="max-w-screen-2xl mx-auto p-6 space-y-10 h-screen">
            {/* Kullanıcı Kartı */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl shadow-lg p-6 flex items-center gap-4 w-1/2">
                <div className="bg-white/30 w-14 h-14 flex items-center justify-center rounded-full text-2xl font-bold text-indigo-700">
                    {avatarLetter}
                </div>
                <div className='space-y-2'>
                    <h1 className="text-2xl font-bold">{user.username}</h1>
                    {/* <p className="text-sm opacity-90">{user.email}</p> */}
                    <p className="text-sm opacity-90">Katılım tarihi: {user.created_at}</p>
                </div>
            </div>

            <div className='flex w-full gap-10'>
                {/* Blog Yorumları */}
                <div className='w-full'>
                    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                        <MessageSquare className="text-indigo-600" /> Blog Yorumları
                    </h2>
                    {blogComments.length === 0 ? (
                        <p className="text-gray-500">Henüz blog yorumu yapmamış.</p>
                    ) : (
                        <div className="space-y-4">
                            {blogComments.map((comment) => (
                                <Link
                                    key={comment.id}
                                    href={`/blogs/${comment.commentable_slug}`}
                                    className="block bg-white shadow-md rounded-xl p-4 hover:shadow-lg hover:bg-gray-50 transition"
                                >
                                    <p className="text-gray-800 font-medium">{comment.commentable_title}</p>
                                    <p className="text-gray-600 mt-1">{comment.text}</p>
                                    <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
                                        <span>Blog</span>
                                        <span>{timeAgo(comment.created_at)}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Forum Yorumları */}
                <div className='w-full'>
                    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                        <MessageSquare className="text-purple-600" /> Forum Yorumları
                    </h2>
                    {forumComments.length === 0 ? (
                        <p className="text-gray-500">Henüz forum yorumu yapmamış.</p>
                    ) : (
                        <div className="space-y-4">
                            {forumComments.map((comment) => (
                                <Link
                                    key={comment.id}
                                    href={`/forums/${comment.commentable_slug}`}
                                    className="block bg-white shadow-md rounded-xl p-4 hover:shadow-lg hover:bg-gray-50 transition"
                                >
                                    <p className="text-gray-800 font-medium">{comment.commentable_title}</p>
                                    <p className="text-gray-600 mt-1">{comment.text}</p>
                                    <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
                                        <span>Forum</span>
                                        <span>{timeAgo(comment.created_at)}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
