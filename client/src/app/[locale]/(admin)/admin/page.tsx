'use client';

import React, { useState, useMemo } from 'react';
import { Card, DatePicker } from 'antd';
import { Pie, Column, Line, Bar } from '@ant-design/charts';
import { useUserStore } from '@/stores/userStore';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween'; // ✅ import plugin
dayjs.extend(isBetween); // ✅ extend plugin

const { RangePicker } = DatePicker;

// 🔹 Fake uzun tarih verisi (1 yıl)
const generateFakeDailyData = (days: number) => {
  const data = [];
  const start = dayjs().subtract(days, 'day');
  for (let i = 0; i <= days; i++) {
    data.push({
      date: start.add(i, 'day').format('YYYY-MM-DD'),
      users: Math.floor(Math.random() * 20) + 1,
      blogs: Math.floor(Math.random() * 10) + 1,
    });
  }
  return data;
};

const dailyData = generateFakeDailyData(365);

const categories = [
  { category: 'Technology', count: 14 },
  { category: 'Gaming', count: 20 },
  { category: 'Travel', count: 7 },
  { category: 'Food', count: 5 },
];

const blogViews = [
  { title: 'Next.js 14 Yeni Özellikler', views: 150 },
  { title: 'Oyun Haberleri: GTA 6', views: 320 },
  { title: 'En İyi Tatil Rotaları', views: 95 },
  { title: 'React Server Components', views: 210 },
];

const gameNews = [
  { title: 'Cyberpunk 2077 Expansion', views: 180 },
  { title: 'GTA 6 Çıkış Tarihi', views: 320 },
  { title: 'Valorant Yeni Harita', views: 140 },
];

const Page = () => {
  const user = useUserStore((s) => s.user);

  // Range filter state
  const [range, setRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);

  const filteredData = useMemo(() => {
    return dailyData.filter((d) =>
      dayjs(d.date).isBetween(range[0], range[1], 'day', '[]')
    );
  }, [range]);

  // Chart Configs
  const userLineConfig = {
    data: filteredData,
    xField: 'date',
    yField: 'users',
    smooth: true,
    color: '#1677ff',
    xAxis: { label: { formatter: (text: string) => dayjs(text).format('MM-DD') } },
  };

  const blogLineConfig = {
    data: filteredData,
    xField: 'date',
    yField: 'blogs',
    smooth: true,
    color: '#52c41a',
    xAxis: { label: { formatter: (text: string) => dayjs(text).format('MM-DD') } },
  };

  const categoryPieConfig = {
    data: categories,
    angleField: 'count',
    colorField: 'category',
    radius: 0.9,
    innerRadius: 0.6,
    legend: { position: 'bottom' },
    label: { text: 'count', position: 'outside' },
  };

  const viewsBarConfig = {
    data: blogViews,
    xField: 'views',
    yField: 'title',
    seriesField: 'title',
    legend: false,
    color: '#faad14',
    barWidthRatio: 0.6,
  };

  const gameNewsConfig = {
    data: gameNews,
    xField: 'title',
    yField: 'views',
    color: '#eb2f96',
    columnStyle: { radius: [5, 5, 0, 0] },
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-6">📊 Admin Dashboard</h1>
      <p className="mb-4">Kullanıcı: {user?.username || 'Bulunamadı'}</p>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl shadow">
          <h2 className="text-lg font-semibold">Bugün Yeni Kullanıcı</h2>
          <p className="text-2xl font-bold text-blue-600">20</p>
        </Card>
        <Card className="rounded-2xl shadow">
          <h2 className="text-lg font-semibold">Bugün Paylaşılan Blog</h2>
          <p className="text-2xl font-bold text-green-600">6</p>
        </Card>
        <Card className="rounded-2xl shadow">
          <h2 className="text-lg font-semibold">Toplam Kategori</h2>
          <p className="text-2xl font-bold text-purple-600">4</p>
        </Card>
      </div>

      {/* Range Picker + Line Charts */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <span>Tarih Aralığı:</span>
        <RangePicker
          value={range}
          onChange={(dates) => {
            if (dates && dates[0] && dates[1]) setRange([dates[0], dates[1]]);
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow">
          <h2 className="mb-4 font-semibold">Günlük Yeni Kullanıcılar</h2>
          <Line {...userLineConfig} />
        </Card>
        <Card className="rounded-2xl shadow">
          <h2 className="mb-4 font-semibold">Günlük Blog Paylaşımları</h2>
          <Line {...blogLineConfig} />
        </Card>
      </div>

      {/* Categories Pie */}
      <Card className="rounded-2xl shadow">
        <h2 className="mb-4 font-semibold">Kategorilere Göre Bloglar</h2>
        <Pie {...categoryPieConfig} />
      </Card>

      {/* Blog Views Ranking */}
      <Card className="rounded-2xl shadow">
        <h2 className="mb-4 font-semibold">En Çok Okunan Bloglar</h2>
        <Bar {...viewsBarConfig} />
      </Card>

      {/* Game News */}
      <Card className="rounded-2xl shadow">
        <h2 className="mb-4 font-semibold">Oyun Haberleri</h2>
        <Column {...gameNewsConfig} />
      </Card>
    </div>
  );
};

export default Page;
