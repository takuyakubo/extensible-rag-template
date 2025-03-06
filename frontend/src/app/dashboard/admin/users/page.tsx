'use client';

import { useState, useEffect } from 'react';
import { getUsers, deleteUser } from '@/lib/api/users';
import { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical, UserCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error('ユーザー取得エラー:', err);
      setError('ユーザーの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('このユーザーを削除してもよろしいですか？')) {
      return;
    }

    try {
      await deleteUser(id);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
    } catch (err) {
      console.error('ユーザー削除エラー:', err);
      alert('ユーザーの削除に失敗しました');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">読み込み中...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={fetchUsers}>再試行</Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">ユーザー管理</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          ユーザーを追加
        </Button>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          ユーザーがありません
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">ユーザー</th>
                <th className="px-4 py-3 text-left text-sm font-medium">メールアドレス</th>
                <th className="px-4 py-3 text-left text-sm font-medium">ロール</th>
                <th className="px-4 py-3 text-left text-sm font-medium">登録日</th>
                <th className="px-4 py-3 text-left text-sm font-medium w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <UserCircle className="h-6 w-6 mr-3 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{user.fullName}</div>
                        <div className="text-xs text-muted-foreground">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{user.email}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map(role => (
                        <span key={role.id} className="px-2 py-0.5 text-xs rounded-full bg-muted">
                          {role.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                      
                      {selectedUser === user.id && (
                        <div className="absolute right-0 z-10 mt-1 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="py-1">
                            <button
                              className="w-full px-4 py-2 text-left text-sm hover:bg-muted"
                              onClick={() => {
                                // 編集ページに遷移
                              }}
                            >
                              編集
                            </button>
                            <button
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-muted"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              削除
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}