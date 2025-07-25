'use client';

import { useUserStore } from '@/stores/userStore';
import React from 'react'
// import { useEffect, useState } from 'react';
// import { Card, Input, Button, Table, Checkbox, Modal, message } from 'antd';
// import type { ColumnsType } from 'antd/es/table';
// import { PlusOutlined } from '@ant-design/icons';

// interface Role {
//   id: number;
//   name: string;
//   permissions: { name: string }[];
// }

// interface Permission {
//   name: string;
// }

// export default function RolesPage() {
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [permissions, setPermissions] = useState<Permission[]>([]);
//   const [newRoleName, setNewRoleName] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedRole, setSelectedRole] = useState<Role | null>(null);
//   const [checkedPermissions, setCheckedPermissions] = useState<string[]>([]);

//   const token = 'BEARER_TOKEN_HERE'; // Replace with real auth

//   const fetchRoles = async () => {
//     const res = await fetch('/api/roles', {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const data = await res.json();
//     setRoles(data);
//   };

//   const fetchPermissions = async () => {
//     const res = await fetch('/api/permissions', {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const data = await res.json();
//     setPermissions(data);
//   };

//   const handleCreateRole = async () => {
//     if (!newRoleName) return;
//     const res = await fetch('/api/roles', {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ name: newRoleName }),
//     });
//     if (res.ok) {
//       message.success('Rol oluşturuldu');
//       setNewRoleName('');
//       fetchRoles();
//     }
//   };

//   const openPermissionModal = (role: Role) => {
//     setSelectedRole(role);
//     setCheckedPermissions(role.permissions.map(p => p.name));
//     setIsModalOpen(true);
//   };

//   const handlePermissionSave = async () => {
//     if (!selectedRole) return;
//     await fetch(`/api/roles/${selectedRole.id}/permissions`, {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ permissions: checkedPermissions }),
//     });
//     message.success('İzinler güncellendi');
//     setIsModalOpen(false);
//     fetchRoles();
//   };

//   useEffect(() => {
//     fetchRoles();
//     fetchPermissions();
//   }, []);

//   const columns: ColumnsType<Role> = [
//     { title: 'Rol Adı', dataIndex: 'name' },
//     {
//       title: 'İzinler',
//       render: (_, record) => record.permissions.map(p => p.name).join(', '),
//     },
//     {
//       title: 'İşlem',
//       render: (_, record) => (
//         <Button onClick={() => openPermissionModal(record)}>İzinleri Düzenle</Button>
//       ),
//     },
//   ];

//   return (
//     <div className="max-w-5xl mx-auto p-6 space-y-6">
//       <Card title="Yeni Rol Oluştur" className="rounded-2xl shadow">
//         <div className="flex gap-4 items-center">
//           <Input
//             value={newRoleName}
//             onChange={e => setNewRoleName(e.target.value)}
//             placeholder="Rol adı"
//           />
//           <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateRole}>
//             Ekle
//           </Button>
//         </div>
//       </Card>

//       <Card title="Roller Listesi" className="rounded-2xl shadow">
//         <Table columns={columns} dataSource={roles} rowKey="id" />
//       </Card>

//       <Modal
//         title="İzinleri Güncelle"
//         open={isModalOpen}
//         onCancel={() => setIsModalOpen(false)}
//         onOk={handlePermissionSave}
//       >
//         <div className="space-y-2">
//           {permissions.map(p => (
//             <Checkbox
//               key={p.name}
//               checked={checkedPermissions.includes(p.name)}
//               onChange={e => {
//                 const newChecked = e.target.checked
//                   ? [...checkedPermissions, p.name]
//                   : checkedPermissions.filter(item => item !== p.name);
//                 setCheckedPermissions(newChecked);
//               }}
//             >
//               {p.name}
//             </Checkbox>
//           ))}
//         </div>
//       </Modal>
//     </div>
//   );
// }
const page = () => {
  const user = useUserStore((s) => s.user);
  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Kullanıcı: {user?.username || 'Bulunamadı'}</p>
    </div>
  )
}

export default page