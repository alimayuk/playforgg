"use client";
import React, { useState, useEffect } from "react";
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Button, Drawer, Layout, Menu, theme } from "antd";
import { usePathname } from "next/navigation";
import { deleteCookie, getCookie } from "cookies-next";

const { Header, Content } = Layout;

type MenuItem = {
  key: string;
  children?: MenuItem[];
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
  const menuItems = [
    {
      key: "/admin",
      icon: <UserOutlined />,
      label: <a className="text-inherit" href="/admin">Ana Sayfa</a>,
    },
    {
      key: "/admin/technologies",
      icon: <UploadOutlined />,
      label: <a className="text-inherit" href="/admin/technologies">Teknolojiler</a>,
    },
    {
      key: "/admin/categories",
      icon: <UploadOutlined />,
      label: <a className="text-inherit" href="/admin/categories">Kategoriler</a>,
    },
    {
      key: "/admin/portfolios",
      icon: <UploadOutlined />,
      label: <a className="text-inherit" href="/admin/portfolios">Portföyler</a>,
    },
    {
      key: "/admin/settings",
      icon: <UploadOutlined />,
      label: <a className="text-inherit" href="/admin/settings">Ayarlar</a>,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: <div className="text-inherit" onClick={handleLogout}>Çıkış Yap</div>,
    },
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
