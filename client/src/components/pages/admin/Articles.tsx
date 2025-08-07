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
import ImgCrop from "antd-img-crop";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { ArticlesService, Article } from "@/customServices/articles.service";
import type { ColumnsType } from "antd/es/table";
import { getCookie } from "cookies-next";
import { GeneralService } from "@/customServices/general.service";

const { Title } = Typography;

interface Props {
  initialData: {
    data: Article[];
    status: boolean;
  };
}

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const Articles: React.FC<Props> = ({ initialData }) => {
  const locale = getCookie("NEXT_LOCALE")?.toString() || "tr";

  const [form] = Form.useForm();
  const [articles, setArticles] = useState<Article[]>(initialData?.data);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [localeFilter, setLocaleFilter] = useState<string>(locale);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [imageRemoved, setImageRemoved] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);

  // Upload dosya listesi değiştiğinde Form'a set et
  const onUploadChange = ({ fileList: newFileList }: { fileList: any[] }) => {
    setFileList(newFileList);
    form.setFieldsValue({ image: newFileList });
  };

  useEffect(() => {
    fetchFilteredCategories();
  }, [localeFilter, pagination.current, pagination.pageSize]);

  const fetchFilteredCategories = async () => {
    try {
      setLoading(true);
      const res = await ArticlesService.getArticles(
        localeFilter,
        pagination.current,
        pagination.pageSize
      );

      setArticles(res.data || []);
      setPagination((prev) => ({
        ...prev,
        total: res.meta?.total || 0,
      }));
    } catch (err: any) {
      message.error(err?.message || "Haberler alınamadı.");
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

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingArticle(null);
    form.resetFields();
    setImageRemoved(false);
    setFileList([]);
  };

  const submitContent = async (values: any) => {
    if (loading) return;

    try {
      setLoading(true);

      console.log("Form values:", values);
      console.log(
        "Image file object:",
        values.image && values.image[0] ? values.image[0].originFileObj : null
      );

      const formData = new FormData();

      formData.append("title", values.title);
      formData.append("locale", values.locale);
      formData.append("status", values.status ? "1" : "0");
      formData.append("excerpt", values.excerpt || "");

      if (
        values.image &&
        values.image.length > 0 &&
        values.image[0].originFileObj
      ) {
        formData.append("image", values.image[0].originFileObj);
      }

      if (editingArticle) {
        formData.append("remove_image", imageRemoved ? "1" : "0");

        const updatedArticle = await ArticlesService.updateArticle(
          formData,
          editingArticle.id
        );
        setArticles((prev) =>
          prev.map((article) =>
            article.id === editingArticle.id
              ? { ...article, ...updatedArticle.data }
              : article
          )
        );
        await fetchFilteredCategories();
        message.success("Haber güncellendi.");
      } else {
        await ArticlesService.createArticle(formData);
        await fetchFilteredCategories();
        message.success("Haber oluşturuldu.");
      }

      closeDrawer();
    } catch (error: any) {
      message.error(error?.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async (id: number) => {
    try {
      await ArticlesService.deleteArticle(id);
      setArticles((prev) => prev.filter((item) => item.id !== id));
      await fetchFilteredCategories();
      message.success("Haber silindi.");
    } catch (error: any) {
      message.error(error?.message || "Silme sırasında hata oluştu.");
    }
  };

  const editArticle = (article: Article) => {
    setEditingArticle(article);

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
      ...article,
      image: convertToFileList(article.image, "image"),
    });
    setFileList(
      convertToFileList(article.image, "image") // Düzenlerken mevcut görseli göster
    );
    setDrawerOpen(true);
  };

  const toggleArticleField = async (
    article: Article,
    field: "status" | "featured"
  ) => {
    if (loading) return;

    try {
      setLoading(true);
      const updated = await GeneralService.toggleField(
        "article",
        article.id,
        field
      );

      setArticles((prev) =>
        prev.map((cat) =>
          cat.id === article.id ? { ...cat, ...updated.data } : cat
        )
      );

      const labels: Record<string, [string, string]> = {
        status: ["Haber aktifleştirildi.", "Haber pasifleştirildi."],
        featured: ["Haber öne çıkarıldı.", "Haber öne çıkarılmadı."],
      };

      const value = updated.data[field];
      message.success(value ? labels[field][0] : labels[field][1]);
    } catch (err: any) {
      message.error("Güncelleme başarısız.");
    } finally {
      setLoading(false);
    }
  };

  const maincolumns: ColumnsType<Article> = [
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
            alt="Haber görseli"
            style={{ borderRadius: 4, width: "100%", maxWidth: 50 }}
          />
        ) : (
          <Tag color="red">
            <CloseOutlined /> Yok
          </Tag>
        ),
    },
    {
      title: "Durum",
      key: "status",
      render: (_, record) => (
        <Button
          size="small"
          type={record.status ? "primary" : "default"}
          onClick={() => toggleArticleField(record, "status")}
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
            onClick={() => editArticle(record)}
            style={{ marginRight: 16, cursor: "pointer", fontSize: 20 }}
            title="Düzenle"
          >
            <EditOutlined />
          </a>
          <Popconfirm
            title="Haberi sil"
            description="Haberi silersen bağlı olan tüm içerikler silinir. Emin misin?"
            onConfirm={() => deleteArticle(record.id)}
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
            setDrawerOpen(true);
          }}
          icon={<PlusOutlined />}
        >
          Haber Ekle
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
      <Title level={3}>Haberler</Title>
      <Table
        columns={maincolumns}
        dataSource={articles}
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
        title={editingArticle ? "Haber Güncelle" : "Haber Ekle"}
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
          <Form.Item label="Açıklama" name="excerpt">
            <Input.TextArea maxLength={400} rows={3} />
          </Form.Item>

          <Form.Item
            label="Dil"
            name="locale"
            rules={[{ required: true, message: "Lütfen dil seçiniz!" }]}
          >
            <Select>
              <Select.Option value="tr">Türkçe</Select.Option>
              <Select.Option value="en">İngilizce</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Görsel"
            name="image"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="Maksimum 1 dosya yükleyebilirsiniz."
          >
            <ImgCrop aspect={4 / 5} cropShape="rect" quality={1}>
              <Upload
                name="image"
                listType="picture-card"
                fileList={fileList}
                onChange={onUploadChange}
                beforeUpload={() => false}
                maxCount={1}
                accept="image/*"
                onRemove={() => {
                  setImageRemoved(true);
                  setFileList([]);
                  return true;
                }}
              >
                {fileList.length < 1 && (
                  <Button icon={<UploadOutlined />}>Görsel Yükle</Button>
                )}
              </Upload>
            </ImgCrop>
          </Form.Item>

          <Form.Item name="status" valuePropName="checked" initialValue={true}>
            <Checkbox>Aktif</Checkbox>
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading}>
            {editingArticle ? "Güncelle" : "Oluştur"}
          </Button>
        </Form>
      </Drawer>
    </>
  );
};

export default Articles;
