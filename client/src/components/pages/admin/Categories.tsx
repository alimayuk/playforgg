"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Drawer,
  Form,
  Image,
  Input,
  Popconfirm,
  Select,
  Table,
  Tag,
  Typography,
  Upload,
  message,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  InboxOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { CategoriesService } from "@/services/categories.service";
import type { ColumnsType } from "antd/es/table";
import { getCookie } from "cookies-next";
import Dragger from "antd/es/upload/Dragger";
import { GeneralService } from "@/services/general.service";
import { getLocale } from "@/utils/localeUtils";
import { Category } from "@/types";

const { Title } = Typography;

interface Props {
  cats: {
    data: Category[];
    status: boolean;
  };
}
const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
const Categories: React.FC<Props> = ({ cats }) => {
  const locale = getLocale();

  const [form] = Form.useForm();
  const [categories, setCategories] = useState<Category[]>(cats?.data);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [localeFilter, setLocaleFilter] = useState<string>(locale);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
  const [allLocaleCategories, setAllLocaleCategories] = useState<Category[]>([]);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [iconRemoved, setIconRemoved] = useState(false);

  const handleLocaleChange = async (value: string) => {
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

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingCategory(null);
    form.resetFields();
    setImageRemoved(false);
    setIconRemoved(false);
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

      const formData = new FormData();

      formData.append("title", values.title);
      formData.append("locale", values.locale);
      formData.append("parent_id", values.parent_id || "");
      formData.append("featured", values.featured ? "1" : "0");
      formData.append("status", values.status ? "1" : "0");

      if (
        values.image &&
        values.image.length > 0 &&
        values.image[0].originFileObj
      ) {
        formData.append("image", values.image[0].originFileObj);
      }

      if (
        values.icon &&
        values.icon.length > 0 &&
        values.icon[0].originFileObj
      ) {
        formData.append("icon", values.icon[0].originFileObj);
      }


      if (editingCategory) {
        formData.append("remove_image", imageRemoved ? "1" : "0");
        formData.append("remove_icon", iconRemoved ? "1" : "0");
        const updatedCategory = await CategoriesService.updateCategory(formData, editingCategory.id);
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === editingCategory.id ? { ...cat, ...updatedCategory.data } : cat
          )
        );
        await fetchFilteredCategories();
        message.success("Kategori güncellendi.");
      } else {
        await CategoriesService.createCategory(formData);
        await fetchFilteredCategories();
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
      await fetchFilteredCategories();
      message.success("Kategori silindi.");
    } catch (error: any) {
      message.error(error?.message || "Silme sırasında hata oluştu.");
    }
  };

  const editCategory = (category: Category) => {
    setEditingCategory(category);
    const convertToFileList = (filePath: string | null, name: string) =>
      filePath
        ? [
          {
            uid: "-1",
            name: filePath.split("/").pop() || name,
            status: "done",
            url: `${process.env.NEXT_PUBLIC_GLOBAL_SERVER_URL}/${filePath}`,
          },
        ]
        : [];

    form.setFieldsValue({
      ...category,
      image: convertToFileList(category.image ?? null, "image"),
      icon: convertToFileList(category.icon ?? null, "icon"),
    });
    handleLocaleChange(category.locale);
    setDrawerOpen(true);
  };

  const toggleCategoryField = async (category: Category, field: "status" | "featured") => {
    if (loading) return;

    try {
      setLoading(true);
      const updated = await GeneralService.toggleField("category", category.id, field);

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === category.id ? { ...cat, ...updated.data } : cat
        )
      );

      const labels: Record<string, [string, string]> = {
        status: ["Kategori aktifleştirildi.", "Kategori pasifleştirildi."],
        featured: ["Kategori öne çıkarıldı.", "Kategori öne çıkarılmadı."],
      };

      const value = updated.data[field];
      message.success(value ? labels[field][0] : labels[field][1]);

    } catch (err: any) {
      message.error("Güncelleme başarısız.");
    } finally {
      setLoading(false);
    }
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
      title: "İkon",
      dataIndex: "icon",
      key: "icon",
      render: (icon: string | null) => {
        return icon ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_GLOBAL_SERVER_URL}/${icon}`}
            alt="Kategori ikonu"
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
      title: "Öne Çıkan",
      key: "featured",
      render: (_, record) => (
        <Button
          size="small"
          type={record.featured ? "primary" : "default"}
          onClick={() => toggleCategoryField(record, "featured")}
          loading={loading}
          icon={record.featured ? <CheckOutlined /> : <CloseOutlined />}
        >
          {record.featured ? "Evet" : "Hayır"}
        </Button>
      ),
    },
    {
      title: "Durum",
      key: "status",
      render: (_, record) => (
        <Button
          size="small"
          type={record.status ? "primary" : "default"}
          onClick={() => toggleCategoryField(record, "status")}
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
            onClick={() => editCategory(record)}
            style={{ marginRight: 16, cursor: "pointer", fontSize: 20 }}
            title="Düzenle"
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
            setPagination((prev) => ({ ...prev, current: 1 }));
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
          encType="multipart/form-data"
        >
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
                      .filter(
                        (cat) => cat.locale === selectedLocale && cat.id !== editingCategory?.id
                      )
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
                setImageRemoved(true);
                return true;
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

          <Form.Item
            label="İkon"
            name="icon"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="Maksimum 1 dosya yükleyebilirsiniz. (PNG, SVG vb.)"
          >
            <Upload
              name="icon"
              multiple={false}
              beforeUpload={() => false}
              accept="image/*,image/svg+xml"
              maxCount={1}
              listType="picture"
              onRemove={() => {
                setIconRemoved(true);
                return true;
              }}
            >
              <Button icon={<UploadOutlined />}>İkon Yükle</Button>
            </Upload>
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
