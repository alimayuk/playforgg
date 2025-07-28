"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Drawer,
  Form,
  Input,
  Popconfirm,
  Select,
  Table,
  Typography,
  message,
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
  const locale = getCookie("NEXT_LOCALE")?.toString() || "tr";

  const [form] = Form.useForm();
  const [categories, setCategories] = useState<Category[]>(cats?.data);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [localeFilter, setLocaleFilter] = useState<string>(locale);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
  const [allLocaleCategories, setAllLocaleCategories] = useState<Category[]>([]);

  const handleLocaleChange = async (value: string) => {
    // form.setFieldValue("locale", value); // <-- bunu kaldır
    if (value) {
      const allCats = await CategoriesService.getAllByLocale(value);
      setAllLocaleCategories(allCats);
    }
  };

  useEffect(() => {
    fetchFilteredCategories();
  }, [localeFilter, pagination.current, pagination.pageSize]);
  const fetchFilteredCategories = async () => {
    try {
      setLoading(true);
      const res = await CategoriesService.getCategories(
        localeFilter,
        pagination.current,
        pagination.pageSize
      );

      setCategories(res.data || []);
      setPagination((prev) => ({
        ...prev,
        total: res.meta?.total || 0,
      }));

    } catch (err: any) {
      message.error(err?.message || "Kategoriler alınamadı.");
    } finally {
      setLoading(false);
    }
  };
  // Üst kategorileri sadece locale değiştiğinde getir
  useEffect(() => {
    const fetchAllCats = async () => {
      try {
        const allCats = await CategoriesService.getAllByLocale(localeFilter);
        setAllLocaleCategories(allCats);
      } catch (err: any) {
        message.error("Üst kategoriler alınamadı.");
      }
    };

    fetchAllCats();
  }, [localeFilter]);


  const handleTableChange = (paginationData: any) => {
    setPagination({
      ...pagination,
      current: paginationData.current,
      pageSize: paginationData.pageSize,
    });
  };

  const showDrawer = (category?: Category) => {
    if (!category) {
      const drawerLocale =
        localeFilter === "hepsi"
          ? getCookie("NEXT_LOCALE")?.toString() || "tr"
          : localeFilter;

      form.setFieldsValue({ locale: drawerLocale });
      handleLocaleChange(drawerLocale);
    }
    setDrawerOpen(true);
  };



  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingCategory(null);
    form.resetFields();
  };

  const getParentTitle = (parent_id: number | null): string => {
    if (!parent_id) return "-";
    const parent = allLocaleCategories.find((cat) => cat.id === parent_id);
    return parent ? parent.title : "—";
  };


  const submitContent = async (values: any) => {

    if (loading) return;

    try {
      setLoading(true);

      if (editingCategory) {
        const updatedCategory = await CategoriesService.updateCategory(values, editingCategory.id);
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === editingCategory.id ? { ...cat, ...updatedCategory.data } : cat
          )
        );
        message.success("Kategori güncellendi.");
      } else {
        await CategoriesService.createCategory({ ...values });
        await fetchFilteredCategories(); // listeyi yenile
        message.success("Kategori oluşturuldu.");
      }

      closeDrawer();
    } catch (error: any) {
      message.error(error?.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await CategoriesService.deleteCategory(id);
      setCategories((prev) => prev.filter((item) => item.id !== id));
      await fetchFilteredCategories(); // listeyi yenile
      message.success("Kategori silindi.");
    } catch (error: any) {
      message.error(error?.message || "Silme sırasında hata oluştu.");
    }
  };

  const editCategory = (category: Category) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    handleLocaleChange(category.locale);
    setDrawerOpen(true);
  };

  const maincolumns: ColumnsType<Category> = [
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
      title: "Üst Kategori",
      dataIndex: "parent_id",
      key: "parent_id",
      render: (parent_id: number | null) => getParentTitle(parent_id),
    },

    {
      title: "Dil",
      dataIndex: "locale",
      key: "locale",
      width: 80,
      render: (text: string) => text.toUpperCase(),
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
            description="Kategoriyi silersen bağlı olan tüm içerikler silinir. Emin misin?"
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
      <div className="flex justify-between items-center mb-4">
        <Button
          className="block mb-5"
          type="primary"
          onClick={() => {
            const drawerLocale =
              localeFilter === "hepsi"
                ? getCookie("NEXT_LOCALE")?.toString() || "tr"
                : localeFilter;

            form.setFieldsValue({ locale: drawerLocale });
            handleLocaleChange(drawerLocale);
            setDrawerOpen(true);
          }}
          icon={<PlusOutlined />}
        >
          Kategori Ekle
        </Button>
        <Select
          value={localeFilter}
          onChange={(val) => {
            setLocaleFilter(val);
            setPagination((prev) => ({ ...prev, current: 1 })); // sayfayı resetle
          }}
          style={{ width: 200, marginBottom: 20 }}
        >
          <Select.Option value="hepsi">Tüm Diller</Select.Option>
          <Select.Option value="tr">Türkçe</Select.Option>
          <Select.Option value="en">İngilizce</Select.Option>
        </Select>
      </div>
      <Title level={3}>Kategoriler</Title>
      <Table
        columns={maincolumns}
        dataSource={categories}
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
          {/* Başlık */}
          <Form.Item
            label="Başlık"
            name="title"
            rules={[
              { required: true, message: "Lütfen başlık giriniz!" },
              { min: 2, message: "En az 2 karakter olmalı" },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Dil Seçimi */}
          <Form.Item
            label="Dil"
            name="locale"
            rules={[{ required: true, message: "Lütfen dil seçiniz!" }]}
          >
            <Select onChange={handleLocaleChange}>
              <Select.Option value="tr">Türkçe</Select.Option>
              <Select.Option value="en">İngilizce</Select.Option>
            </Select>
          </Form.Item>


          {/* Üst Kategori Seçimi */}
          <Form.Item shouldUpdate>
            {() => {
              const selectedLocale = form.getFieldValue("locale");
              return (
                <Form.Item label="Üst Kategori" name="parent_id">
                  <Select
                    allowClear
                    placeholder="(Varsa) üst kategori seçin"
                    disabled={!selectedLocale || loading}
                  >
                    {allLocaleCategories
                      .filter((cat) => cat.locale === selectedLocale)
                      .map((cat) => (
                        <Select.Option key={cat.id} value={cat.id}>
                          {cat.title}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              );
            }}
          </Form.Item>

          <Form.Item name="featured" valuePropName="checked">
            <Checkbox>Öne çıkar</Checkbox>
          </Form.Item>

          <Form.Item name="status" valuePropName="checked" initialValue={true}>
            <Checkbox>Aktif</Checkbox>
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
