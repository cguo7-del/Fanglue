'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
}

interface Favorite {
  id?: string;
  question: string;
  answer: string;
  category: string;
  books: string[];
  notes?: string;
  created_at?: string;
}

function AnswerContent() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('');
  const [books, setBooks] = useState<string[]>([]);
  const [bookDetails, setBookDetails] = useState<Book[]>([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const allBooks: Book[] = [
    { id: '1', title: '论语', author: '孔子', category: '人生哲学', description: '儒家经典，讲述做人做事的道理' },
    { id: '2', title: '道德经', author: '老子', category: '人生哲学', description: '道家经典，阐述自然之道' },
    { id: '3', title: '孙子兵法', author: '孙武', category: '军事战略', description: '兵家经典，战略智慧的集大成者' },
    { id: '4', title: '大学', author: '曾子', category: '修身养性', description: '四书之一，讲述修身治国之道' },
    { id: '5', title: '中庸', author: '子思', category: '修身养性', description: '儒家经典，阐述中庸之道' },
    { id: '6', title: '孟子', author: '孟子', category: '治国理政', description: '儒家经典，论述仁政思想' },
    { id: '7', title: '史记', author: '司马迁', category: '治国理政', description: '史学经典，记录历史兴衰' },
    { id: '8', title: '资治通鉴', author: '司马光', category: '治国理政', description: '编年体史书，治国理政的智慧宝库' }
  ];

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
      return;
    }

    // 从URL参数获取数据
    const questionParam = searchParams.get('question');
    const answerParam = searchParams.get('answer');
    const categoryParam = searchParams.get('category');
    const booksParam = searchParams.get('books');

    if (questionParam) setQuestion(questionParam);
    if (answerParam) setAnswer(answerParam);
    if (categoryParam) setCategory(categoryParam);
    if (booksParam) {
      const bookIds = booksParam.split(',').filter(id => id.trim());
      setBooks(bookIds);
      
      // 获取书籍详情
      const selectedBooks = allBooks.filter(book => bookIds.includes(book.id));
      setBookDetails(selectedBooks);
    }

    // 检查是否已收藏
    if (user && questionParam) {
      checkIfFavorited(questionParam);
    }
  }, [user, authLoading, router, searchParams]);

  const checkIfFavorited = async (questionText: string) => {
    try {
      const response = await fetch('/api/favorites');
      if (response.ok) {
        const data = await response.json();
        const existing = data.favorites.find((fav: Favorite) => fav.question === questionText);
        if (existing) {
          setIsFavorited(true);
          setNotes(existing.notes || '');
        }
      }
    } catch (err) {
      console.error('检查收藏状态失败:', err);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      router.push('/auth');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isFavorited) {
        // 取消收藏
        const response = await fetch('/api/favorites', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question }),
        });

        if (response.ok) {
          setIsFavorited(false);
          setNotes('');
          setShowNotes(false);
          setSuccess('已取消收藏');
        } else {
          const data = await response.json();
          setError(data.error || '取消收藏失败');
        }
      } else {
        // 添加收藏
        const favoriteData: Favorite = {
          question,
          answer,
          category,
          books,
          notes: notes.trim() || undefined
        };

        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(favoriteData),
        });

        if (response.ok) {
          setIsFavorited(true);
          setSuccess('已添加到收藏');
        } else {
          const data = await response.json();
          setError(data.error || '添加收藏失败');
        }
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNotes = async () => {
    if (!isFavorited) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/favorites', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          notes: notes.trim() || undefined
        }),
      });

      if (response.ok) {
        setSuccess('笔记已更新');
        setShowNotes(false);
      } else {
        const data = await response.json();
        setError(data.error || '更新笔记失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '方略 - 古籍智慧',
          text: `问题：${question}\n\n答案：${answer.substring(0, 100)}...`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('分享取消');
      }
    } else {
      // 复制到剪贴板
      try {
        await navigator.clipboard.writeText(`问题：${question}\n\n答案：${answer}\n\n来源：方略 - 古籍智慧现代应用`);
        setSuccess('内容已复制到剪贴板');
      } catch (err) {
        setError('复制失败');
      }
    }
  };

  const formatAnswer = (text: string) => {
    // 简单的格式化：将换行符转换为段落
    return text.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-4 leading-relaxed">
        {paragraph.trim()}
      </p>
    ));
  };

  if (authLoading) {
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

  if (!question || !answer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">未找到答案内容</h1>
          <Link 
            href="/ask-question" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700"
          >
            重新提问
          </Link>
        </div>
      </div>
    );
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
              <Link href="/profile" className="text-gray-600 hover:text-amber-800 transition-colors">
                个人中心
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-green-700">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Question */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900 flex-1">{question}</h1>
                {category && (
                  <span className="ml-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                    {category}
                  </span>
                )}
              </div>
              
              {bookDetails.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">参考典籍：</h3>
                  <div className="flex flex-wrap gap-2">
                    {bookDetails.map(book => (
                      <span key={book.id} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {book.title} - {book.author}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Answer */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">智慧解答</h2>
                <div className="flex space-x-3">
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    分享
                  </button>
                  <button
                    onClick={handleFavorite}
                    disabled={loading}
                    className={`inline-flex items-center px-3 py-2 border shadow-sm text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                      isFavorited
                        ? 'border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100'
                        : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <svg className={`w-4 h-4 mr-2 ${isFavorited ? 'fill-current' : ''}`} fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {isFavorited ? '已收藏' : '收藏'}
                  </button>
                </div>
              </div>
              
              <div className="prose prose-amber max-w-none">
                {formatAnswer(answer)}
              </div>
            </div>

            {/* Notes Section */}
            {isFavorited && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">我的笔记</h3>
                  <button
                    onClick={() => setShowNotes(!showNotes)}
                    className="text-sm text-amber-600 hover:text-amber-700"
                  >
                    {showNotes ? '收起' : '编辑笔记'}
                  </button>
                </div>
                
                {showNotes ? (
                  <div>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="记录您的思考和感悟..."
                    />
                    <div className="mt-3 flex justify-end space-x-3">
                      <button
                        onClick={() => setShowNotes(false)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        取消
                      </button>
                      <button
                        onClick={handleUpdateNotes}
                        disabled={loading}
                        className="px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
                      >
                        {loading ? '保存中...' : '保存笔记'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-600">
                    {notes ? (
                      <p className="whitespace-pre-wrap">{notes}</p>
                    ) : (
                      <p className="italic">暂无笔记，点击"编辑笔记"添加您的思考</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">相关操作</h3>
              <div className="space-y-3">
                <Link
                  href="/ask-question"
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700"
                >
                  继续提问
                </Link>
                <Link
                  href="/favorites"
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  查看收藏
                </Link>
                <Link
                  href="/smart-search"
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  智能搜索
                </Link>
              </div>
            </div>

            {/* Related Categories */}
            {category && (
              <div className="bg-amber-50 rounded-lg border border-amber-200 p-6">
                <h3 className="text-lg font-medium text-amber-900 mb-4">相关分类</h3>
                <div className="space-y-2">
                  <Link
                    href={`/smart-search?category=${encodeURIComponent(category)}`}
                    className="block text-sm text-amber-700 hover:text-amber-900 hover:underline"
                  >
                    探索更多{category}相关内容
                  </Link>
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">使用建议</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  收藏有价值的问答以便日后查看
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  添加笔记记录您的思考和感悟
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  分享给朋友一起探讨古籍智慧
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  从不同角度继续深入提问
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AnswerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-amber-800">加载中...</p>
        </div>
      </div>
    }>
      <AnswerContent />
    </Suspense>
  );
}