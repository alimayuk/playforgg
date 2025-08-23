'use client'

import React, { useEffect, useState } from 'react'
import {
    Form, Input, Select, Switch, Button,
} from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { getCookie } from 'cookies-next'
import { CategoriesService } from '@/services/categories.service'
import Dragger from 'antd/es/upload/Dragger'
import dynamic from 'next/dynamic'
import 'suneditor/dist/css/suneditor.min.css'
import plugins from 'suneditor/src/plugins'
import { Category } from '@/types'

const SunEditor = dynamic(() => import('suneditor-react'), { ssr: false })

interface BlogFormProps {
    initialValues?: any
    onSubmit: (values: any, content: string) => Promise<void>
    loading?: boolean
}

const normFile = (e: any) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

const BlogForm: React.FC<BlogFormProps> = ({ initialValues, onSubmit, loading = false }) => {
    const [form] = Form.useForm()
    const [content, setContent] = useState(initialValues?.content || '')
    const [allLocaleCategories, setAllLocaleCategories] = useState<Category[]>([])
    const [imageRemoved, setImageRemoved] = useState(false)

    const currentLocale = initialValues?.locale || getCookie("NEXT_LOCALE")?.toString() || "tr"

    useEffect(() => {
        const fetchCats = async () => {
            const cats = await CategoriesService.getAllByLocale(currentLocale)
            setAllLocaleCategories(cats)
        }
        fetchCats()
    }, [currentLocale])

    const handleLocaleChange = async (val: string) => {
        const cats = await CategoriesService.getAllByLocale(val)
        setAllLocaleCategories(cats)
        form.setFieldsValue({ category_id: undefined })
    }

    const handleFinish = async (values: any) => {
        await onSubmit({ ...values, imageRemoved }, content)
    }
    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={{ status: true, locale: currentLocale, ...initialValues }}
            onFinish={handleFinish}
        >
            <Form.Item name="title" label="Başlık" rules={[{ required: true }]}>
                <Input placeholder="Blog başlığı girin" />
            </Form.Item>

            <Form.Item name="category_id" label="Kategori" rules={[{ required: true }]}>
                <Select placeholder="Kategori seçin" allowClear>
                    {allLocaleCategories.map((cat) => (
                        <Select.Option key={cat.id} value={cat.id}>
                            {cat.title}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                label="Görsel"
                name="image"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                extra="Maksimum 1 dosya yükleyebilirsiniz."
            >
                <Dragger
                    name="image"
                    multiple={false}
                    beforeUpload={() => false}
                    accept="image/*"
                    maxCount={1}
                    onRemove={() => {
                        setImageRemoved(true)
                        return true
                    }}
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                        Dosyayı buraya sürükleyin veya tıklayarak seçin
                    </p>
                </Dragger>
            </Form.Item>

            <Form.Item label="İçerik">
                <div className="border border-gray-300 rounded overflow-hidden prose max-w-none">
                    <SunEditor
                        setContents={content}
                        defaultValue={content}      // initial content burada verilir
                        onChange={setContent}        // değişiklikleri yakala
                        height="400px"
                        setOptions={{
                            buttonList: [
                                ['undo', 'redo', 'formatBlock'],
                                ['bold', 'italic', 'underline'],
                                ['list', 'align', 'fontSize'],
                                ['link', 'image', 'video'],
                                ['fontColor', 'hiliteColor', 'textStyle'],
                                ['table', 'codeView', 'removeFormat'],
                            ],
                            plugins: plugins,
                        }}

                        onImageUploadBefore={(files, info, uploadHandler) => {

                            const file = files[0]
                            const formData = new FormData()
                            formData.append('file', file)

                            fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/upload-temp`, {
                                method: 'POST',
                                body: formData,
                                credentials: 'include',
                            })
                                .then((res) => res.json())
                                .then((data) => {
                                    console.log('Upload success:', data)
                                    uploadHandler({
                                        result: [
                                            {
                                                url: data.url,
                                                name: file.name,
                                                size: file.size,
                                            },
                                        ],
                                    })
                                })
                                .catch((err) => {
                                    console.error('Upload failed', err)
                                })

                            return false
                        }}

                    />


                </div>
            </Form.Item>

            <Form.Item name="excerpt" label="Özet">
                <Input.TextArea rows={3} placeholder="İçeriğin kısa özeti" />
            </Form.Item>

            <Form.Item name="locale" label="Dil">
                <Select onChange={handleLocaleChange} placeholder="Dil seçin">
                    <Select.Option value="tr">Türkçe</Select.Option>
                    <Select.Option value="en">İngilizce</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item name="status" label="Yayın Durumu" valuePropName="checked">
                <Switch checkedChildren="Yayında" unCheckedChildren="Taslak" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Blogu Kaydet
                </Button>
            </Form.Item>
        </Form>
    )
}

export default BlogForm
