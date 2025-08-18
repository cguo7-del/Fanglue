'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '../components/Footer';

interface FeaturedQuestion {
  id: string;
  question: string;
  category: string;
  preview: string;
}

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [featuredQuestions, setFeaturedQuestions] = useState<FeaturedQuestion[]>([]);
  const [quickQuestion, setQuickQuestion] = useState('');

  useEffect(() => {
    // 模拟获取精选问答
    const mockFeaturedQuestions: FeaturedQuestion[] = [
      {
        id: '1',
        question: '如何在困难面前保持内心平静？',
        category: '人生哲学',
        preview: '老子在《道德经》中说："上善若水，水善利万物而不争。"面对困难时，我们应该像水一样...'
      },
      {
        id: '2',
        question: '什么是真正的领导力？',
        category: '治国理政',
        preview: '孔子曰："为政以德，譬如北辰，居其所而众星共之。"真正的领导者应该以德服人...'
      },
      {
        id: '3',
        question: '如何处理商业竞争中的挑战？',
        category: '商业智慧',
        preview: '《孙子兵法》中说："知己知彼，百战不殆。"在商业竞争中，深入了解自己和对手...'
      },
      {
        id: '4',
        question: '怎样建立良好的人际关系？',
        category: '人际关系',
        preview: '孔子说："己所不欲，勿施于人。"建立良好人际关系的基础是换位思考和真诚待人...'
      }
    ];
    setFeaturedQuestions(mockFeaturedQuestions);
  }, []);

  const handleQuickAsk = () => {
    if (quickQuestion.trim()) {
      if (!user) {
        router.push('/auth');
        return;
      }
      router.push(`/ask-question?q=${encodeURIComponent(quickQuestion.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleQuickAsk();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-800">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* 导航栏 */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">方</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-amber-900">方略</h1>
                <p className="text-amber-700 text-xs">古籍智慧现代应用</p>
              </div>
            </div>
            
            <div className="hidden md:flex space-x-6">
              <Link href="/" className="text-amber-700 hover:text-amber-900 font-medium">
                首页
              </Link>
              <Link href="/ask-question" className="text-amber-700 hover:text-amber-900 font-medium">
                智能问答
              </Link>
              <Link href="/smart-search" className="text-amber-700 hover:text-amber-900 font-medium">
                智能搜索
              </Link>
              {user && (
                <Link href="/favorites" className="text-amber-700 hover:text-amber-900 font-medium">
                  我的收藏
                </Link>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-amber-700">欢迎，{user.email}</span>
                  <Link 
                    href="/profile" 
                    className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    个人中心
                  </Link>
                </div>
              ) : (
                <Link 
                  href="/auth" 
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                >
                  登录/注册
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main>
        {/* 英雄区域 */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-amber-900 mb-6">
              古籍智慧
              <span className="block text-amber-700">现代应用</span>
            </h1>
            <p className="text-xl text-amber-800 mb-8 max-w-2xl mx-auto leading-relaxed">
              让千年古籍中的智慧为您的现代生活提供指导，通过AI技术连接古代先贤与现代思维
            </p>
            
            {/* 快速提问 */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-amber-900 mb-4">快速提问</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={quickQuestion}
                    onChange={(e) => setQuickQuestion(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="请输入您的问题，让古代智慧为您解答..."
                    className="flex-1 px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleQuickAsk}
                    disabled={!quickQuestion.trim()}
                    className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                  >
                    提问
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/ask-question" 
                className="bg-amber-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-amber-700 transition-colors shadow-lg"
              >
                开始智能问答
              </Link>
              <Link 
                href="/smart-search" 
                className="bg-white text-amber-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-amber-50 transition-colors shadow-lg border border-amber-200"
              >
                智能搜索古籍
              </Link>
            </div>
          </div>
        </section>

        {/* 特色功能 */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-amber-900 text-center mb-12">核心功能</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-amber-900 mb-3">智能问答</h3>
                <p className="text-amber-700">基于古代典籍的AI问答系统，为您的人生困惑提供古代智慧的指导</p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-amber-900 mb-3">智能搜索</h3>
                <p className="text-amber-700">在海量古籍中快速找到相关内容，支持语义搜索和精确匹配</p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-amber-900 mb-3">个人收藏</h3>
                <p className="text-amber-700">收藏喜欢的问答内容，添加个人笔记，建立专属的智慧库</p>
              </div>
            </div>
          </div>
        </section>

        {/* 精选问答 */}
        <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-amber-900 text-center mb-12">精选问答</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredQuestions.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-amber-900 flex-1">{item.question}</h3>
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm ml-3">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-amber-800 mb-4 leading-relaxed">{item.preview}</p>
                  <div className="flex justify-between items-center">
                    <button className="text-amber-600 hover:text-amber-700 font-medium">
                      阅读全文
                    </button>
                    <button className="text-amber-600 hover:text-amber-700">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link 
                href="/ask-question" 
                className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium"
              >
                查看更多问答
              </Link>
            </div>
          </div>
        </section>

        {/* 古籍典藏 */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-amber-900 text-center mb-12">古籍典藏</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: '论语', author: '孔子', desc: '儒家经典' },
                { name: '道德经', author: '老子', desc: '道家经典' },
                { name: '孙子兵法', author: '孙武', desc: '兵家经典' },
                { name: '大学', author: '曾子', desc: '四书之一' },
                { name: '中庸', author: '子思', desc: '儒家经典' },
                { name: '孟子', author: '孟子', desc: '儒家经典' },
                { name: '史记', author: '司马迁', desc: '史学经典' },
                { name: '资治通鉴', author: '司马光', desc: '编年史书' }
              ].map((book, index) => (
                <div key={index} className="text-center p-4 border border-amber-200 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="w-12 h-16 bg-amber-100 rounded mx-auto mb-3 flex items-center justify-center">
                    <span className="text-amber-700 font-bold text-lg">书</span>
                  </div>
                  <h3 className="font-semibold text-amber-900 mb-1">{book.name}</h3>
                  <p className="text-amber-700 text-sm mb-1">{book.author}</p>
                  <p className="text-amber-600 text-xs">{book.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 使用统计 */}
        <section className="py-16 bg-amber-900 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">8+</div>
                <div className="text-amber-200">古籍典藏</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">1000+</div>
                <div className="text-amber-200">智慧问答</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">5000+</div>
                <div className="text-amber-200">用户收藏</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-amber-200">智能服务</div>
              </div>
            </div>
          </div>
        </section>

        {/* 名言警句 */}
        <section className="py-16 bg-gradient-to-r from-amber-100 to-orange-100">
          <div className="container mx-auto px-4 text-center">
            <blockquote className="text-2xl md:text-3xl font-bold text-amber-900 mb-4">
              "学而时习之，不亦说乎？"
            </blockquote>
            <p className="text-amber-700 text-lg">—— 《论语·学而》</p>
            <p className="text-amber-600 mt-4 max-w-2xl mx-auto">
              学习古代智慧，并在现代生活中实践，这本身就是一种快乐。方略致力于让古籍智慧在现代焕发新的生命力。
            </p>
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <Footer />
    </div>
  );
}