"use client";

import React, { useState } from "react";
import {
  Button,
  Drawer,
  Form,
  Input,
  Popconfirm,
  Table,
  Typography,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { CategoriesService, Category } from "@/customServices/categories.service";
import type { ColumnsType } from "antd/es/table";
import { getCookie } from "cookies-next";

const { Title } = Typography;

interface Props {
  cats: {
    data: Category[];
    status: boolean;
  };
}

const Categories: React.FC<Props> = ({ cats }) => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<Category[]>(cats?.data);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const locale = getCookie("NEXT_LOCALE")?.toString() || "tr"; // locale cookie'den alınır

  const showDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingCategory(null);
    form.resetFields();
  };

  const submitContent = async (values: any) => {
    try {
      setLoading(true);
      if (editingCategory) {
        const updatedCategory = await CategoriesService.updateCategory(
          values,
          editingCategory.id
        );
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === editingCategory.id
              ? { ...cat, ...updatedCategory.data }
              : cat
          )
        );
      } else {
        const newCategory = await CategoriesService.createCategory({
          ...values,
          locale,
        });
        setCategories((prev) => [...prev, newCategory.data]);
      }
      closeDrawer();
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      const deleted = await CategoriesService.deleteCategory(id);
      setCategories((prev) => prev.filter((item) => item.id !== id));
    } catch (error: any) {
      console.error("Kategoriyi silerken hata oluştu:", error);}
  };

  const editCategory = (category: Category) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    showDrawer();
  };

  const maincolumns: ColumnsType<Category> = [
    {
      title: "Başlık",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "İşlem",
      key: "action",
      render: (_, record) => (
        <>
          <a
            onClick={() => editCategory(record)}
            style={{ marginRight: 16, cursor: "pointer", fontSize: 20 }}
          >
            <EditOutlined />
          </a>
          <Popconfirm
            title="Kategoriyi sil"
            description="Kategoriyi silersen bağlı olan tüm içerikler silinir emin misin?"
            onConfirm={() => deleteCategory(record.id)}
            okText="Evet"
            cancelText="Hayır"
          >
            <a style={{ color: "red", cursor: "pointer", fontSize: 20 }}>
              <DeleteOutlined />
            </a>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <Button
        className="block mb-5"
        type="primary"
        onClick={showDrawer}
        icon={<PlusOutlined />}
      >
        Kategori Ekle
      </Button>
      <Title level={3}>Kategoriler</Title>
      <Table columns={maincolumns} dataSource={categories} rowKey="id" />

      <Drawer
        title={editingCategory ? "Kategori Güncelle" : "Kategori Ekle"}
        width={720}
        onClose={closeDrawer}
        open={drawerOpen}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={submitContent}
          autoComplete="off"
        >
          <Form.Item
            label="Başlık"
            name="title"
            rules={[
              { required: true, message: "Lütfen başlık giriniz!" },
              {
                min: 2,
                message: "Kategori adı minimum 2 karakter içermeli.",
              },
            ]}
          >
            <Input placeholder="Başlık giriniz" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {editingCategory ? "Güncelle" : "Oluştur"}
          </Button>
        </Form>
      </Drawer>
    </>
  );
};

export default Categories;
