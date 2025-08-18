'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserProfile {
  user_id: string;
  email: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  preferences: {
    favorite_categories: string[];
    notification_settings: {
      email_notifications: boolean;
      push_notifications: boolean;
    };
  };
  created_at: string;
  updated_at: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    avatar_url: '',
    favorite_categories: [] as string[],
    email_notifications: true,
    push_notifications: false,
  });
  
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();

  const availableCategories = [
    '人生哲学', '治国理政', '军事战略', '商业智慧', 
    '修身养性', '人际关系', '学习方法', '其他'
  ];

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user-profile');
      const data = await response.json();
      
      if (response.ok) {
        setProfile(data.profile);
        setFormData({
          display_name: data.profile.display_name || '',
          bio: data.profile.bio || '',
          avatar_url: data.profile.avatar_url || '',
          favorite_categories: data.profile.preferences?.favorite_categories || [],
          email_notifications: data.profile.preferences?.notification_settings?.email_notifications ?? true,
          push_notifications: data.profile.preferences?.notification_settings?.push_notifications ?? false,
        });
      } else {
        setError(data.error || '获取用户资料失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/user-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          display_name: formData.display_name,
          bio: formData.bio,
          avatar_url: formData.avatar_url,
          preferences: {
            favorite_categories: formData.favorite_categories,
            notification_settings: {
              email_notifications: formData.email_notifications,
              push_notifications: formData.push_notifications,
            }
          }
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setProfile(data.profile);
        setMessage('资料更新成功');
        setIsEditing(false);
      } else {
        setError(data.error || '更新失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    if (confirm('确定要退出登录吗？')) {
      await signOut();
      router.push('/');
    }
  };

  const toggleCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      favorite_categories: prev.favorite_categories.includes(category)
        ? prev.favorite_categories.filter(c => c !== category)
        : [...prev.favorite_categories, category]
    }));
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-amber-800">加载中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold text-amber-800 hover:text-amber-900 transition-colors">
              方略
            </Link>
            <nav className="flex space-x-6">
              <Link href="/" className="text-gray-600 hover:text-amber-800 transition-colors">
                首页
              </Link>
              <Link href="/ask-question" className="text-gray-600 hover:text-amber-800 transition-colors">
                提问
              </Link>
              <Link href="/smart-search" className="text-gray-600 hover:text-amber-800 transition-colors">
                智能搜索
              </Link>
              <Link href="/favorites" className="text-gray-600 hover:text-amber-800 transition-colors">
                我的收藏
              </Link>
              <Link href="/profile" className="text-amber-800 font-medium">
                个人中心
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">个人中心</h1>
          <p className="text-gray-600">管理您的个人资料和偏好设置</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {message && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-green-700">{message}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Profile Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-amber-100 rounded-full flex items-center justify-center">
                  {formData.avatar_url ? (
                    <img 
                      src={formData.avatar_url} 
                      alt="头像" 
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-amber-800">
                      {(formData.display_name || user.email || '用').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {formData.display_name || '未设置昵称'}
                  </h2>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-sm font-medium text-amber-700 bg-amber-100 rounded-md hover:bg-amber-200 transition-colors"
                  >
                    编辑资料
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        // 重置表单数据
                        if (profile) {
                          setFormData({
                            display_name: profile.display_name || '',
                            bio: profile.bio || '',
                            avatar_url: profile.avatar_url || '',
                            favorite_categories: profile.preferences?.favorite_categories || [],
                            email_notifications: profile.preferences?.notification_settings?.email_notifications ?? true,
                            push_notifications: profile.preferences?.notification_settings?.push_notifications ?? false,
                          });
                        }
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700 disabled:opacity-50 transition-colors"
                    >
                      {saving ? '保存中...' : '保存'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-6 py-6 space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">基本信息</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    昵称
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.display_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="请输入昵称"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.display_name || '未设置'}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    个人简介
                  </label>
                  {isEditing ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="介绍一下自己..."
                    />
                  ) : (
                    <p className="text-gray-900 whitespace-pre-wrap">{formData.bio || '未设置'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Favorite Categories */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">感兴趣的分类</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {availableCategories.map(category => (
                  <label key={category} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.favorite_categories.includes(category)}
                      onChange={() => isEditing && toggleCategory(category)}
                      disabled={!isEditing}
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 disabled:opacity-50"
                    />
                    <span className="text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notification Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">通知设置</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.email_notifications}
                    onChange={(e) => setFormData(prev => ({ ...prev, email_notifications: e.target.checked }))}
                    disabled={!isEditing}
                    className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 disabled:opacity-50"
                  />
                  <span className="text-sm text-gray-700">邮件通知</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.push_notifications}
                    onChange={(e) => setFormData(prev => ({ ...prev, push_notifications: e.target.checked }))}
                    disabled={!isEditing}
                    className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 disabled:opacity-50"
                  />
                  <span className="text-sm text-gray-700">推送通知</span>
                </label>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {profile && (
                  <p>账户创建于 {new Date(profile.created_at).toLocaleDateString('zh-CN')}</p>
                )}
              </div>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}