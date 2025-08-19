'use client';

import React from 'react';
import { Pie, Column } from '@ant-design/charts';

const ChartsDemo = () => {
  const categories = [
    { category: 'Technology', count: 12 },
    { category: 'Gaming', count: 8 },
    { category: 'Travel', count: 5 },
    { category: 'Food', count: 3 },
  ];

  const total = categories.reduce((acc, cur) => acc + cur.count, 0);

  // Pie Chart (şık doughnut)
  const pieConfig = {
    data: categories,
    angleField: 'count',
    colorField: 'category',
    radius: 0.9,
    innerRadius: 0.6, // doughnut görünüm
    color: ['#1677ff', '#52c41a', '#faad14', '#eb2f96'], // AntD renkleri
    legend: {
      position: 'bottom',
      itemName: { style: { fontSize: 14 } },
    },
    label: {
      text: (d: any) => `${d.category}: ${d.count}`,
      position: 'outside',
      style: { fontSize: 12, fontWeight: 500 },
    },
    tooltip: {
      title: 'category',
      formatter: (d: any) => ({ name: 'Count', value: d.count }),
    },
    statistic: {
      title: {
        content: 'Total',
        style: { fontSize: 16, fontWeight: 600 },
      },
      content: {
        content: `${total}`,
        style: { fontSize: 20, fontWeight: 700, color: '#1677ff' },
      },
    },
  };

  // Bar Chart config
  const barConfig = {
    data: categories,
    xField: 'category',
    yField: 'count',
    label: {
      text: 'count',
      position: 'top',
      style: { fontSize: 12 },
    },
    columnStyle: {
      radius: [5, 5, 0, 0],
    },
    color: '#1677ff',
  };

  return (
    <div className="p-6 space-y-12">
      <div>
        <h2 className="text-xl font-bold mb-4">Categories (Pie Chart)</h2>
        <Pie {...pieConfig} />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Categories (Bar Chart)</h2>
        <Column {...barConfig} />
      </div>
    </div>
  );
};

export default ChartsDemo;
