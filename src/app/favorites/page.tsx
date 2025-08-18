'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Favorite {
  id: string;
  question: string;
  answer: string;
  book_title: string;
  category: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');
  
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/favorites');
      const data = await response.json();
      
      if (response.ok) {
        setFavorites(data.favorites || []);
      } else {
        setError(data.error || '获取收藏失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const deleteFavorite = async (id: string) => {
    if (!confirm('确定要删除这个收藏吗？')) {
      return;
    }

    try {
      const response = await fetch(`/api/favorites?id=${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setFavorites(favorites.filter(fav => fav.id !== id));
      } else {
        const data = await response.json();
        setError(data.error || '删除失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    }
  };

  const updateNotes = async (id: string, notes: string) => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, notes }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setFavorites(favorites.map(fav => 
          fav.id === id ? { ...fav, notes: data.favorite.notes } : fav
        ));
        setEditingId(null);
        setEditNotes('');
      } else {
        const data = await response.json();
        setError(data.error || '更新失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    }
  };

  const categories = ['全部', ...Array.from(new Set(favorites.map(fav => fav.category)))];
  
  const filteredFavorites = favorites.filter(fav => {
    const matchesCategory = selectedCategory === '全部' || fav.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      fav.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fav.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fav.book_title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
              <Link href="/favorites" className="text-amber-800 font-medium">
                我的收藏
              </Link>
              <Link href="/profile" className="text-gray-600 hover:text-amber-800 transition-colors">
                个人中心
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">我的收藏</h1>
          <p className="text-gray-600">管理您收藏的智慧问答</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="搜索收藏内容..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Favorites List */}
        {filteredFavorites.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无收藏</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedCategory !== '全部' ? '没有找到匹配的收藏' : '您还没有收藏任何内容'}
            </p>
            <Link
              href="/ask-question"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700"
            >
              开始提问
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredFavorites.map((favorite) => (
              <div key={favorite.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        {favorite.category}
                      </span>
                      {favorite.book_title && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {favorite.book_title}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {favorite.question}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingId(favorite.id);
                        setEditNotes(favorite.notes || '');
                      }}
                      className="text-gray-400 hover:text-amber-600 transition-colors"
                      title="编辑笔记"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteFavorite(favorite.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="删除收藏"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="prose max-w-none mb-4">
                  <div className="text-gray-700 whitespace-pre-wrap">{favorite.answer}</div>
                </div>

                {/* Notes Section */}
                {editingId === favorite.id ? (
                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      个人笔记
                    </label>
                    <textarea
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="添加您的个人笔记..."
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditNotes('');
                        }}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                      >
                        取消
                      </button>
                      <button
                        onClick={() => updateNotes(favorite.id, editNotes)}
                        className="px-3 py-1 text-sm bg-amber-600 text-white rounded hover:bg-amber-700"
                      >
                        保存
                      </button>
                    </div>
                  </div>
                ) : favorite.notes ? (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">个人笔记</h4>
                    <p className="text-gray-600 text-sm whitespace-pre-wrap">{favorite.notes}</p>
                  </div>
                ) : null}

                <div className="text-xs text-gray-500 mt-4">
                  收藏于 {new Date(favorite.created_at).toLocaleString('zh-CN')}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}