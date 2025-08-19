'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { message } from 'antd'
import { BlogsService } from '@/services/blogs.service'
import LoadingScreen from '@/components/LoadingScreen'
import GameForm from '@/components/GameForm'
import { GamesService } from '@/services/games.service'

const GameEdit = () => {
    const { id } = useParams() as { id: string }
    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [initialValues, setInitialValues] = useState<any>(null)

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const res = await GamesService.getGameById(Number(id))

                if (res.status !== 'success') {
                    throw new Error(res.message || 'Oyun alınamadı')
                }

                setInitialValues({
                    ...res.data,
                    image: convertImageToFileList(res.data.image),
                });
            } catch (err) {
                console.error(err)
                message.error('Oyun verisi alınamadı')
                router.push('/blogs')
            }
        }

        if (id) fetchGame()
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

            const res = await GamesService.updateGame(Number(id), formData)

            if (res.status === 'success' || res.status === 200) {
                message.success('Oyun başarıyla güncellendi!')
                router.push('/admin/games')
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
            <h1 className="text-2xl font-bold mb-4">Oyunu Güncelle</h1>
            <GameForm initialValues={initialValues} onSubmit={handleUpdate} loading={loading} />
        </div>
    )
}

export default GameEdit
