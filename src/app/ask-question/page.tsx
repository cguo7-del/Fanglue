'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
}

export default function AskQuestionPage() {
  const [question, setQuestion] = useState('');
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const categories = [
    '全部', '人生哲学', '治国理政', '军事战略', '商业智慧', 
    '修身养性', '人际关系', '学习方法', '其他'
  ];

  const exampleQuestions = [
    {
      question: "如何在困难时期保持内心的平静？",
      category: "修身养性"
    },
    {
      question: "怎样才能成为一个好的领导者？",
      category: "治国理政"
    },
    {
      question: "在商业竞争中如何制定策略？",
      category: "商业智慧"
    },
    {
      question: "如何处理人际关系中的冲突？",
      category: "人际关系"
    }
  ];

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      // 这里应该从API获取书籍列表，暂时使用模拟数据
      const mockBooks: Book[] = [
        { id: '1', title: '论语', author: '孔子', category: '人生哲学', description: '儒家经典，讲述做人做事的道理' },
        { id: '2', title: '道德经', author: '老子', category: '人生哲学', description: '道家经典，阐述自然之道' },
        { id: '3', title: '孙子兵法', author: '孙武', category: '军事战略', description: '兵家经典，战略智慧的集大成者' },
        { id: '4', title: '大学', author: '曾子', category: '修身养性', description: '四书之一，讲述修身治国之道' },
        { id: '5', title: '中庸', author: '子思', category: '修身养性', description: '儒家经典，阐述中庸之道' },
        { id: '6', title: '孟子', author: '孟子', category: '治国理政', description: '儒家经典，论述仁政思想' },
        { id: '7', title: '史记', author: '司马迁', category: '治国理政', description: '史学经典，记录历史兴衰' },
        { id: '8', title: '资治通鉴', author: '司马光', category: '治国理政', description: '编年体史书，治国理政的智慧宝库' }
      ];
      setBooks(mockBooks);
    } catch (err) {
      setError('获取书籍列表失败');
    } finally {
      setLoadingBooks(false);
    }
  };

  const filteredBooks = selectedCategory === '全部' 
    ? books 
    : books.filter(book => book.category === selectedCategory);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      setError('请输入您的问题');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question.trim(),
          selected_books: selectedBooks,
          category: selectedCategory === '全部' ? '' : selectedCategory
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 跳转到答案页面
        const params = new URLSearchParams({
          question: question.trim(),
          answer: data.answer,
          books: selectedBooks.join(','),
          category: selectedCategory === '全部' ? '' : selectedCategory
        });
        router.push(`/answer?${params.toString()}`);
      } else {
        setError(data.error || '提问失败，请稍后重试');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const toggleBookSelection = (bookId: string) => {
    setSelectedBooks(prev => 
      prev.includes(bookId) 
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

  const handleExampleClick = (exampleQuestion: string) => {
    setQuestion(exampleQuestion);
  };

  if (authLoading || loadingBooks) {
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
              <Link href="/ask-question" className="text-amber-800 font-medium">
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
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">向古籍智慧提问</h1>
          <p className="text-xl text-gray-600">从传统典籍中寻找现代问题的答案</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Question Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                    您的问题
                  </label>
                  <textarea
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="请输入您想要咨询的问题，比如：如何在困难时期保持内心的平静？"
                    required
                  />
                </div>

                {/* Category Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    问题分类
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Book Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    选择参考典籍（可选）
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                    {filteredBooks.map(book => (
                      <label key={book.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedBooks.includes(book.id)}
                          onChange={() => toggleBookSelection(book.id)}
                          className="mt-1 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{book.title}</div>
                          <div className="text-xs text-gray-500">{book.author}</div>
                          <div className="text-xs text-gray-600 mt-1">{book.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {selectedBooks.length > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      已选择 {selectedBooks.length} 本典籍
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      正在思考...
                    </>
                  ) : (
                    '获取智慧解答'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Example Questions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">示例问题</h3>
              <div className="space-y-3">
                {exampleQuestions.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(example.question)}
                    className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-amber-50 hover:border-amber-300 transition-colors"
                  >
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      {example.question}
                    </div>
                    <div className="text-xs text-amber-600">
                      {example.category}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-amber-50 rounded-lg border border-amber-200 p-6">
              <h3 className="text-lg font-medium text-amber-900 mb-4">提问小贴士</h3>
              <ul className="space-y-2 text-sm text-amber-800">
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  问题越具体，答案越精准
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  可以选择相关典籍获得更专业的解答
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  尝试从不同角度思考同一个问题
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  好的答案值得收藏和反复思考
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}