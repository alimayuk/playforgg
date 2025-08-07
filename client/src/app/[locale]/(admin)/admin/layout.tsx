"use client";
import React, { useState, useEffect } from "react";
import {
  AndroidOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Button, Drawer, Layout, Menu, theme } from "antd";
import { usePathname } from "next/navigation";
import { deleteCookie, getCookie } from "cookies-next";
import { useUserStore } from "@/stores/userStore";
import '../../../globals.css';
import LoadingScreen from "@/components/LoadingScreen";

const { Header, Content } = Layout;
type MenuItem = {
  key: string;
  children?: MenuItem[];
  icon?: React.ReactNode;
  label: React.ReactNode;
};

type LevelKeys = {
  [key: string]: number;
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [stateOpenKeys, setStateOpenKeys] = useState<string[]>([]);
  const pathname = usePathname();
  const user = useUserStore((s) => s.user);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Mobil ekran kontrolü
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Logout fonksiyonu
  const handleLogout = () => {
    const token = getCookie("token");
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/logout/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === true) {
          deleteCookie("token", { path: "/" });
          deleteCookie("a_token", { path: "/" });
          window.location.href = "/";
        } else {
          console.error("Logout failed:", data.message);
        }
      })
      .catch((err) => console.error("Error:", err));
  };

  // Menü elemanları
  const pathSegments = pathname?.split("/") ?? [];
  const locale = pathSegments[1] || "tr"; // default 'tr' yapabilirsin

  // Menü elemanları
  const menuItems: MenuItem[] = [
    {
      key: `/${locale}/admin`,
      icon: <UserOutlined />,
      label: <a className="text-inherit" href={`/${locale}/admin`}>Ana Sayfa</a>,
    },
    {
      key: `/${locale}/admin/blogs`,
      icon: <UploadOutlined />,
      label: <p>Bloglar</p>,
      children: [
        {
          key: `/${locale}/admin/blogs/`,
          label: <a className="text-inherit" href={`/${locale}/admin/blogs`}>Blog Listesi</a>,
        },
        {
          key: `/${locale}/admin/blogs/create`,
          label: <a className="text-inherit" href={`/${locale}/admin/blogs/create`}>Blog Oluştur</a>,
        },
      ],
    },
    {
      key: `/${locale}/admin/categories`,
      icon: <UploadOutlined />,
      label: <a className="text-inherit" href={`/${locale}/admin/categories`}>Kategoriler</a>,
    },
    {
      key: `/${locale}/admin/games`,
      icon: <AndroidOutlined />,
      label: <p>Oyunlar</p>,
      children: [
        {
          key: `/${locale}/admin/games/`,
          label: <a className="text-inherit" href={`/${locale}/admin/games`}>Oyun Listesi</a>,
        },
        {
          key: `/${locale}/admin/games/create`,
          label: <a className="text-inherit" href={`/${locale}/admin/games/create`}>Oyun Oluştur</a>,
        },
      ],
    },
    {
      key: `/${locale}/admin/news`,
      icon: <AndroidOutlined />,
      label: <p>Haberler</p>,
      children: [
        {
          key: `/${locale}/admin/news/`,
          label: <a className="text-inherit" href={`/${locale}/admin/news`}>Haber Listesi</a>,
        },
        {
          key: `/${locale}/admin/news/create`,
          label: <a className="text-inherit" href={`/${locale}/admin/news/create`}>Haber Oluştur</a>,
        },
      ],
    },
    ...(user?.roles?.includes("admin")
      ? [(
        {
          key: `/${locale}/admin/settings`,
          icon: <UploadOutlined />,
          label: <a className="text-inherit" href={`/${locale}/admin/settings`}>Ayarlar</a>,
        }
      )] : []),
    ...(user ? [
      {
        key: `/${locale}/admin/logout`,
        icon: <LogoutOutlined />,
        label: (
          <a className="text-inherit" href={`/${locale}/admin/logout`}>
            Çıkış Yap
          </a>
        ),
      }
    ] : []),
  ];

  // Menü seviyeleri
  const getLevelKeys = (items: MenuItem[]): LevelKeys => {
    const keys: LevelKeys = {};
    const traverse = (items: MenuItem[], level = 1) => {
      items.forEach((item) => {
        keys[item.key] = level;
        if (item.children) {
          traverse(item.children, level + 1);
        }
      });
    };
    traverse(items);
    return keys;
  };

  const levelKeys = getLevelKeys(menuItems);

  const onOpenChange = (openKeys: string[]) => {
    const currentOpenKey = openKeys.find((key) => !stateOpenKeys.includes(key));

    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);

      setStateOpenKeys(
        openKeys
          .filter((_, index) => index !== repeatIndex)
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey])
      );
    } else {
      setStateOpenKeys(openKeys);
    }
  };

  if (!user) {
    return <LoadingScreen />;
  }

  return (
    <Layout>
      {!isMobile ? (
        <Layout.Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          className="h-screen"
        >
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[pathname]}
            items={menuItems}
            openKeys={stateOpenKeys}
            onOpenChange={onOpenChange}
          />
        </Layout.Sider>
      ) : (
        <Drawer
          placement="left"
          closable
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          styles={{ body: { padding: 0, height: "100%" } }}
        >
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[pathname]}
            items={menuItems}
            openKeys={stateOpenKeys}
            onOpenChange={onOpenChange}
            style={{ height: "100%", borderRight: 0 }}
          />
        </Drawer>
      )}
      <Layout>
        <div className="h-screen overflow-auto">
          <Header
            style={{
              padding: "0 15px",
              background: colorBgContainer,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Button
              type="text"
              icon={
                collapsed || drawerVisible ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
              }
              onClick={() =>
                isMobile ? setDrawerVisible(true) : setCollapsed(!collapsed)
              }
              style={{ fontSize: "16px", width: 64, height: 64 }}
            />
            <Badge dot>
              <Avatar shape="square" icon={<UserOutlined />} />
            </Badge>
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </Content>
        </div>
      </Layout>
    </Layout>
  );
}
