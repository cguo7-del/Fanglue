'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  source: string;
  category: string;
  relevance: number;
}

interface SearchFilters {
  category: string;
  source: string;
  sortBy: 'relevance' | 'date' | 'title';
}

export default function SmartSearchPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'all',
    source: 'all',
    sortBy: 'relevance'
  });
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    // 加载搜索历史
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch('/api/smart-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery.trim(),
          filters
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
        
        // 保存到搜索历史
        const newHistory = [searchQuery.trim(), ...searchHistory.filter(h => h !== searchQuery.trim())].slice(0, 10);
        setSearchHistory(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      } else {
        console.error('搜索失败');
        setResults([]);
      }
    } catch (error) {
      console.error('搜索错误:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">智能搜索</h1>
          <p className="text-amber-700">在古籍智慧中寻找您需要的答案</p>
        </div>

        {/* 搜索框 */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="请输入您想搜索的内容..."
                  className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg"
                />
              </div>
              <button
                onClick={() => handleSearch()}
                disabled={isSearching || !query.trim()}
                className="px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                {isSearching ? '搜索中...' : '搜索'}
              </button>
            </div>

            {/* 筛选器切换 */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="text-amber-600 hover:text-amber-700 font-medium"
              >
                {showFilters ? '隐藏筛选' : '显示筛选'}
              </button>
              
              {results.length > 0 && (
                <p className="text-amber-700">找到 {results.length} 个相关结果</p>
              )}
            </div>

            {/* 筛选器 */}
            {showFilters && (
              <div className="mt-4 p-4 bg-amber-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-700 mb-2">分类</label>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters({...filters, category: e.target.value})}
                      className="w-full px-3 py-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="all">全部分类</option>
                      <option value="philosophy">人生哲学</option>
                      <option value="politics">治国理政</option>
                      <option value="military">军事战略</option>
                      <option value="business">商业智慧</option>
                      <option value="cultivation">修身养性</option>
                      <option value="relationships">人际关系</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-amber-700 mb-2">典籍来源</label>
                    <select
                      value={filters.source}
                      onChange={(e) => setFilters({...filters, source: e.target.value})}
                      className="w-full px-3 py-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="all">全部典籍</option>
                      <option value="analects">论语</option>
                      <option value="tao">道德经</option>
                      <option value="sunzi">孙子兵法</option>
                      <option value="daxue">大学</option>
                      <option value="zhongyong">中庸</option>
                      <option value="mencius">孟子</option>
                      <option value="shiji">史记</option>
                      <option value="zizhi">资治通鉴</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-amber-700 mb-2">排序方式</label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters({...filters, sortBy: e.target.value as 'relevance' | 'date' | 'title'})}
                      className="w-full px-3 py-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="relevance">相关度</option>
                      <option value="date">时间</option>
                      <option value="title">标题</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 搜索历史 */}
        {searchHistory.length > 0 && results.length === 0 && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-amber-900">搜索历史</h3>
                <button
                  onClick={clearHistory}
                  className="text-amber-600 hover:text-amber-700 text-sm"
                >
                  清空历史
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((historyItem, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(historyItem);
                      handleSearch(historyItem);
                    }}
                    className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full hover:bg-amber-200 transition-colors text-sm"
                  >
                    {historyItem}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 搜索结果 */}
        {results.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {results.map((result) => (
                <div key={result.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-amber-900 mb-2">{result.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">
                        {result.category}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {result.source}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-amber-800 mb-4 leading-relaxed">{result.content}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-amber-600">相关度: {Math.round(result.relevance * 100)}%</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-sm">
                        查看详情
                      </button>
                      <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                        收藏
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 空状态 */}
        {!isSearching && query && results.length === 0 && (
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-amber-900 mb-2">未找到相关结果</h3>
              <p className="text-amber-700 mb-6">尝试使用不同的关键词或调整筛选条件</p>
              <div className="space-y-2 text-sm text-amber-600">
                <p>搜索建议：</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>使用更通用的关键词</li>
                  <li>检查拼写是否正确</li>
                  <li>尝试使用同义词</li>
                  <li>减少筛选条件</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 搜索提示 */}
        {!query && results.length === 0 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold text-amber-900 mb-4">搜索提示</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-amber-800 mb-2">热门搜索</h4>
                  <div className="space-y-2">
                    {['如何面对困难', '领导力智慧', '人际关系处理', '商业经营之道', '修身养性方法'].map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setQuery(suggestion);
                          handleSearch(suggestion);
                        }}
                        className="block w-full text-left px-3 py-2 text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-amber-800 mb-2">搜索技巧</h4>
                  <ul className="space-y-2 text-sm text-amber-700">
                    <li>• 使用具体的问题或场景进行搜索</li>
                    <li>• 可以搜索古代名言或典故</li>
                    <li>• 支持模糊匹配和语义搜索</li>
                    <li>• 使用筛选器缩小搜索范围</li>
                    <li>• 尝试不同的关键词组合</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}