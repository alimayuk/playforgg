'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { message } from 'antd'
import BlogForm from '@/components/BlogForm'
import { BlogsService } from '@/customServices/blogs.service'
import LoadingScreen from '@/components/LoadingScreen'

const BlogEdit = () => {
    const { id } = useParams() as { id: string }
    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [initialValues, setInitialValues] = useState<any>(null)

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await BlogsService.getBlogById(Number(id))

                if (res.status !== 'success') {
                    throw new Error(res.message || 'Blog alınamadı')
                }

                setInitialValues({
                    ...res.data,
                    image: convertImageToFileList(res.data.image),
                });
            } catch (err) {
                console.error(err)
                message.error('Blog verisi alınamadı')
                router.push('/blogs')
            }
        }

        if (id) fetchBlog()
    }, [id, router])

    const convertImageToFileList = (imageUrl: string) => {
        if (!imageUrl) return [];
        return [
            {
                uid: '-1',
                name: imageUrl.split('/').pop() || 'image.jpg',
                status: 'done',
                url: `${process.env.NEXT_PUBLIC_GLOBAL_SERVER_URL}/${imageUrl}`,
            },
        ];
    };

    const handleUpdate = async (values: any, content: string) => {
        try {
            setLoading(true)

            const formData = new FormData()
            formData.append('title', values.title)
            formData.append('category_id', values.category_id)
            formData.append('locale', values.locale || 'tr')
            formData.append('status', values.status ? '1' : '0')
            formData.append('excerpt', values.excerpt || '')
            formData.append('content', content)
            formData.append("remove_image", values.imageRemoved ? "1" : "0");

            const isNewFile = values.image?.[0]?.originFileObj
            if (isNewFile) {
                formData.append('image', values.image[0].originFileObj)
            }

            const res = await BlogsService.updateBlog(Number(id), formData)

            if (res.status === 'success' || res.status === 200) {
                message.success('Blog başarıyla güncellendi!')
                router.push('/admin/blogs')
            } else {
                message.error(res.message || 'Bir hata oluştu')
            }
        } catch (err) {
            console.error(err)
            message.error('Sunucu hatası')
        } finally {
            setLoading(false)
        }
    }

    if (!initialValues) return <LoadingScreen />

    return (
        <div className="p-6 bg-white rounded-xl shadow">
            <h1 className="text-2xl font-bold mb-4">Blogu Güncelle</h1>
            <BlogForm initialValues={initialValues} onSubmit={handleUpdate} loading={loading} />
        </div>
    )
}

export default BlogEdit
