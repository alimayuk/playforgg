'use client';
import { BlogsService } from '@/services/blogs.service';
import { GeneralService } from '@/services/general.service';
import { Blog, PaginationMeta } from '@/types';
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Image, message, Popconfirm, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useState } from 'react';

const fetchBlogs = async (page: number, perPage: number, locale: string): Promise<{
    data: Blog[];
    meta: { current_page: number; per_page: number; total: number };
}> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/blogs?locale=${locale}&page=${page}&perPage=${perPage}`, {
        headers: {
            Accept: 'application/json',
        },
        credentials: 'include',
        cache: 'no-store',
    });

    if (!res.ok) throw new Error("Bloglar alınamadı");

    return res.json();
};

interface Props {
    initialData: Blog[];
    initialMeta: PaginationMeta;
    locale: string;
}

const Blogs: React.FC<Props> = ({ initialData, initialMeta, locale }) => {
    const [blogs, setBlogs] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: initialMeta.current_page,
        pageSize: initialMeta.per_page,
        total: initialMeta.total,
    });

    const loadBlogs = async (page: number, perPage: number) => {
        try {
            setLoading(true);
            const result = await fetchBlogs(page, perPage, locale);
            setBlogs(result.data);
            setPagination({
                current: result.meta.current_page,
                pageSize: result.meta.per_page,
                total: result.meta.total,
            });
        } catch {
            message.error("Bloglar yüklenemedi.");
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange = (paginationData: any) => {
        loadBlogs(paginationData.current, paginationData.pageSize);
    };

    const toggleBlogField = async (blog: Blog, field: "status" | "featured") => {
        if (loading) return;
        try {
            setLoading(true);
            const updated = await GeneralService.toggleField("blog", blog.id, field);
            setBlogs((prev) =>
                prev.map((b) => (b.id === blog.id ? { ...b, ...updated.data } : b))
            );

            const labels: Record<string, [string, string]> = {
                status: ["Blog aktifleştirildi.", "Blog pasifleştirildi."],
                featured: ["Blog öne çıkarıldı.", "Blog öne çıkarılmadı."],
            };

            const value = updated.data[field];
            message.success(value ? labels[field][0] : labels[field][1]);
        } catch {
            message.error("Güncelleme başarısız.");
        } finally {
            setLoading(false);
        }
    };

    const deleteBlog = async (id: number) => {
        if (loading) return;

        try {
            setLoading(true);
            const response = await BlogsService.deleteBlog(id);
            if (response) {
                setBlogs((prev) => prev.filter((b) => b.id !== id));
                message.success("Blog başarıyla silindi.");
            } else {
                message.error("Blog silinirken bir hata oluştu.");
            }
        } catch {
            message.error("Blog silinirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const editBlog = (blog: Blog) => {
        window.location.href = `/admin/blogs/${blog.id}/edit`;
    };

    const columns: ColumnsType<Blog> = [
        {
            title: "Başlık",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Slug",
            dataIndex: "slug",
            key: "slug",
        },
        {
            title: "Dil",
            dataIndex: "locale",
            key: "locale",
            width: 80,
            render: (text: string) => text.toUpperCase(),
        },
        {
            title: "Görsel",
            dataIndex: "image",
            key: "image",
            render: (image: string | null) =>
                image ? (
                    <Image
                        src={`${process.env.NEXT_PUBLIC_GLOBAL_SERVER_URL}/${image}`}
                        alt="Kategori görseli"
                        style={{ borderRadius: 4, width: "100%", maxWidth: 50 }}
                    />
                ) : (
                    <Tag color="red"><CloseOutlined /> Yok</Tag>
                ),
        },
        {
            title: "Durum",
            key: "status",
            render: (_, record) => (
                <Button
                    size="small"
                    type={record.status ? "primary" : "default"}
                    onClick={() => toggleBlogField(record, "status")}
                    loading={loading}
                    icon={record.status ? <CheckOutlined /> : <CloseOutlined />}
                >
                    {record.status ? "Aktif" : "Pasif"}
                </Button>
            ),
        },
        {
            title: "İşlem",
            key: "action",
            render: (_, record) => (
                <>
                    <a
                        onClick={() => editBlog(record)}
                        style={{ marginRight: 16, cursor: "pointer", fontSize: 20 }}
                        title="Düzenle"
                    >
                        <EditOutlined />
                    </a>
                    <Popconfirm
                        title="Blogu sil"
                        description="Blogu silersen bağlı olan tüm içerikler silinir. Emin misin?"
                        onConfirm={() => deleteBlog(record.id)}
                        okText="Evet"
                        cancelText="Hayır"
                    >
                        <a
                            style={{ color: "red", cursor: "pointer", fontSize: 20 }}
                            title="Sil"
                        >
                            <DeleteOutlined />
                        </a>
                    </Popconfirm>
                </>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={blogs}
            rowKey="id"
            bordered
            loading={loading}
            pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                pageSizeOptions: ["5", "10", "20", "50"],
            }}
            onChange={handleTableChange}
        />
    );
};

export default Blogs;
