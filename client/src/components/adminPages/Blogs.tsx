'use client'
import { Blog, BlogsService } from '@/customServices/blogs.service';
import { GeneralService } from '@/customServices/general.service';
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Image, message, Popconfirm, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useState } from 'react'

interface Props {
    blogsData: {
        data: Blog[];
        status: boolean;
    };
}
const Blogs: React.FC<Props> = ({ blogsData }) => {
    const [blogs, setBlogs] = React.useState(blogsData?.data);
    const [loading, setLoading] = React.useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });

    const toggleBlogField = async (blog: Blog, field: "status" | "featured") => {
        if (loading) return;

        try {
            setLoading(true);
            const updated = await GeneralService.toggleField("blog", blog.id, field);

            setBlogs((prev) =>
                prev.map((b) =>
                    b.id === blog.id ? { ...b, ...updated.data } : b
                )
            );

            const labels: Record<string, [string, string]> = {
                status: ["Blog aktifleştirildi.", "Blog pasifleştirildi."],
                featured: ["Blog öne çıkarıldı.", "Blog öne çıkarılmadı."],
            };

            const value = updated.data[field];
            message.success(value ? labels[field][0] : labels[field][1]);

        } catch (err: any) {
            message.error("Güncelleme başarısız.");
        } finally {
            setLoading(false);
        }
    };
    const handleTableChange = (paginationData: any) => {
        setPagination({
            ...pagination,
            current: paginationData.current,
            pageSize: paginationData.pageSize,
        });
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
        } catch (err: any) {
            message.error("Blog silinirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };
    const editBlog = (blog: Blog) => {
        window.location.href = `/admin/blogs/${blog.id}/edit`;
    };
    const maincolumns: ColumnsType<Blog> = [
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
            render: (image: string | null) => {
                return image ? (
                    <Image
                        src={`${process.env.NEXT_PUBLIC_GLOBAL_SERVER_URL}/${image}`}
                        alt="Kategori görseli"
                        style={{ borderRadius: 4, width: "100%", maxWidth: 50 }}
                    />
                ) : (
                    <Tag color="red">
                        <CloseOutlined /> Yok
                    </Tag>
                );
            },
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
        <div>
            <Table
                columns={maincolumns}
                dataSource={blogs}
                rowKey="id"
                bordered
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: true,
                    pageSizeOptions: ["5", "10", "20", "50"],
                }}
                onChange={handleTableChange}
            />
        </div>
    )
}

export default Blogs