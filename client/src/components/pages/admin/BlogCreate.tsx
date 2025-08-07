'use client'

import React, { useEffect, useState } from 'react'
import {
    Form, Input, Select, Upload, Switch, Button, message,
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import {
    MDXEditor,linkDialogPlugin,
    headingsPlugin, quotePlugin, listsPlugin, codeBlockPlugin, linkPlugin, imagePlugin, tablePlugin, markdownShortcutPlugin, frontmatterPlugin, toolbarPlugin, BoldItalicUnderlineToggles, BlockTypeSelect, ListsToggle, CodeToggle, CreateLink, InsertImage, InsertTable, Separator,
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { getCookie } from 'cookies-next'
import { CategoriesService, Category } from '@/customServices/categories.service'
import { BlogsService } from '@/customServices/blogs.service'

const BlogCreate = () => {
    const locale = getCookie("NEXT_LOCALE")?.toString() || "tr";

    const [content, setContent] = useState('')
    const [editorKey, setEditorKey] = useState(0);
    const [loading, setLoading] = useState(false)
    const [allLocaleCategories, setAllLocaleCategories] = useState<Category[]>([]);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const allCats = await CategoriesService.getAllByLocale(locale);
                setAllLocaleCategories(allCats);
            } catch (error) {
                message.error('Kategoriler alınırken hata oluştu');
            }
        }
        fetchCategories();
    }, [locale]);
    const handleLocaleChange = async (value: string) => {
        if (value) {
            const allCats = await CategoriesService.getAllByLocale(value);
            setAllLocaleCategories(allCats);
            form.setFieldsValue({ category_id: undefined });
        }

    };

    const onFinish = async (values: any) => {
        try {
            setLoading(true)
            const formData = new FormData()
            formData.append('title', values.title)
            formData.append('category_id', values.category_id)
            formData.append('locale', values.locale || 'tr')
            formData.append('status', values.status ? '1' : '0')
            formData.append('excerpt', values.excerpt || '')
            formData.append('content', content)
            if (
                values.image &&
                values.image.length > 0 &&
                values.image[0].originFileObj
            ) {
                formData.append("image", values.image[0].originFileObj);
            }
            const res = await BlogsService.createBlog(formData);
            if (res.status === 'success' || res.status === 201) {
                message.success('Blog başarıyla oluşturuldu!')
                form.resetFields();
                setContent('');
                setEditorKey(prev => prev + 1);
            } else {
                message.error(res.message || 'Bir hata oluştu')
            }
        } catch (err) {
            message.error('Sunucu hatası')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6 bg-white rounded-xl shadow">
            <h1 className="text-2xl font-bold mb-4">Yeni Blog Ekle</h1>

            <Form form={form} layout="vertical" onFinish={onFinish}>

                <Form.Item name="title" label="Başlık"
                    rules={[{ required: true, message: 'Başlık alanı zorunludur.' }, { max: 255, message: 'Başlık 255 karakterden fazla olamaz.' }]}>
                    <Input placeholder="Blog başlığı girin" />
                </Form.Item>

                <Form.Item name="category_id" label="Kategori" rules={[{ required: true, message: 'Kategori alanı zorunludur.' }]}>
                    <Select placeholder="Kategori seçin" allowClear>
                        {allLocaleCategories.map((cat) => (
                            <Select.Option key={cat.id} value={cat.id}>
                                {cat.title}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="image"
                    label="Kapak Görseli"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
                >
                    <Upload
                        name="image"
                        listType="picture"
                        maxCount={1}
                        accept="image/*"
                        multiple={false}
                        beforeUpload={() => false}
                    >
                        <Button icon={<UploadOutlined />}>Görsel Yükle</Button>
                    </Upload>
                </Form.Item>
                <Form.Item shouldUpdate>
                    {({ setFields, getFieldValue }) => {
                        const contentValue = getFieldValue('content');
                        return (
                            <Form.Item name="content" label="İçerik" rules={[{ required: true, message: 'İçerik alanı zorunludur.' }]}>
                                <div className="border border-gray-300 rounded">
                                    <div className="prose max-w-none">
                                        <MDXEditor
                                            markdown={content}
                                            key={editorKey}
                                            onChange={(val) => {
                                                form.setFieldsValue({ content: val });
                                                setContent(val);
                                            }}
                                            plugins={[
                                                linkDialogPlugin(),
                                                headingsPlugin(),
                                                quotePlugin(),
                                                listsPlugin(),
                                                codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
                                                linkPlugin(),
                                                imagePlugin({
                                                    imageUploadHandler: async (file) => {
                                                        const formData = new FormData()
                                                        formData.append('file', file)
                                                        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/upload-temp`, {
                                                            method: 'POST',
                                                            body: formData,
                                                            credentials: 'include',
                                                        })
                                                        const data = await res.json()
                                                        return data.url
                                                    },
                                                }),
                                                tablePlugin(),
                                                markdownShortcutPlugin(),
                                                frontmatterPlugin(),
                                                toolbarPlugin({
                                                    toolbarContents: () => (
                                                        <>
                                                            <BoldItalicUnderlineToggles />
                                                            <Separator />
                                                            <BlockTypeSelect />
                                                            <Separator />
                                                            <ListsToggle />
                                                            <Separator />
                                                            <CodeToggle />
                                                            <Separator />
                                                            <CreateLink />
                                                            <InsertImage />
                                                            <InsertTable />
                                                        </>
                                                    ),
                                                }),
                                            ]}
                                        /></div>
                                </div>
                            </Form.Item>
                        );
                    }
                    }
                </Form.Item>
                <Form.Item name="excerpt" label="Özet" rules={[{ max: 500, message: 'Özet 400 karakterden fazla olamaz.' }]}>
                    <Input.TextArea rows={3} placeholder="İçeriğin kısa özeti" />
                </Form.Item>

                <Form.Item name="locale" label="Dil" initialValue={locale}>
                    <Select onChange={handleLocaleChange} placeholder="Dil seçin">
                        <Select.Option value="tr">Türkçe</Select.Option>
                        <Select.Option value="en">İngilizce</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item name="status" label="Yayın Durumu" valuePropName="checked" initialValue={true}>
                    <Switch checkedChildren="Yayında" unCheckedChildren="Taslak" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Blogu Kaydet
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default BlogCreate
