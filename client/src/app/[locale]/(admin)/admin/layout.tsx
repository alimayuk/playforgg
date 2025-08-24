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
import { deleteCookie } from "cookies-next";
import { useUserStore } from "@/stores/userStore";
import '../../../globals.css';
import LoadingScreen from "@/components/LoadingScreen";
import 'suneditor/dist/css/suneditor.min.css'
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        deleteCookie("c", { path: "/" });
        deleteCookie("token", { path: "/" });

        useUserStore.getState().clearUser();

        window.location.href = "/";
      } else {
        console.error("Logout failed:", await response.text());
      }
    } catch (error) {
      console.error("Error during logout:", error);
      deleteCookie("c", { path: "/" });
      deleteCookie("token", { path: "/" });
      window.location.href = "/";
    }
  };

  const menuItems: MenuItem[] = [
    {
      key: `/admin`,
      icon: <UserOutlined />,
      label: <a className="text-inherit" href={`/admin`}>Ana Sayfa</a>,
    },
    {
      key: `/admin/blogs`,
      icon: <UploadOutlined />,
      label: <p>Bloglar</p>,
      children: [
        {
          key: `/admin/blogs/`,
          label: <a className="text-inherit" href={`/admin/blogs`}>Blog Listesi</a>,
        },
        {
          key: `/admin/blogs/create`,
          label: <a className="text-inherit" href={`/admin/blogs/create`}>Blog Oluştur</a>,
        },
      ],
    },
    {
      key: `/admin/categories`,
      icon: <UploadOutlined />,
      label: <a className="text-inherit" href={`/admin/categories`}>Kategoriler</a>,
    },
    {
      key: `/admin/games`,
      icon: <AndroidOutlined />,
      label: <p>Oyunlar</p>,
      children: [
        {
          key: `/admin/games/`,
          label: <a className="text-inherit" href={`/admin/games`}>Oyun Listesi</a>,
        },
        {
          key: `/admin/games/create`,
          label: <a className="text-inherit" href={`/admin/games/create`}>Oyun Oluştur</a>,
        },
      ],
    },
    {
      key: `/admin/news/`,
      icon: <AndroidOutlined />,
      label: <a className="text-inherit" href={`/admin/news`}>Haberler</a>,
    },
    ...(user?.roles?.includes("admin")
      ? [(
        {
          key: `/admin/settings`,
          icon: <UploadOutlined />,
          label: <a className="text-inherit" href={`/admin/settings`}>Ayarlar</a>,
        }
      )] : []),
    ...(user ? [
      {
        key: `/admin/logout`,
        icon: <LogoutOutlined />,
        label: (
          <button className="text-inherit" onClick={handleLogout}>
            Çıkış Yap
          </button>
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
