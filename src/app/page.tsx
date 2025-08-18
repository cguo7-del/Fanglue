'use client'

import { useState } from 'react'

export default function Home() {
  const [question, setQuestion] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const tags = ['职场', '人际', '商业', '生活', '其他']

  const handleTagClick = (tag: string) => {
    setSelectedTags((prev: string[]) => 
      prev.includes(tag) 
        ? prev.filter((t: string) => t !== tag)
        : [...prev, tag]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return
    
    setIsLoading(true)
    // TODO: 实现 API 调用
    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-amber-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-amber-800">方略</h1>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-amber-700 hover:text-amber-900 font-medium border-b-2 border-amber-600">首页</a>
              <a href="#ask-section" className="text-amber-700 hover:text-amber-900">提问</a>
              <a href="#examples" className="text-amber-700 hover:text-amber-900">示例</a>
              <a href="#about" className="text-amber-700 hover:text-amber-900">关于</a>
            </nav>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-5xl font-bold text-amber-900 mb-6">古籍智慧，现代应用</h2>
            <p className="text-xl text-amber-700 mb-8 leading-relaxed">
              方略帮助您将中国古代典籍中的智慧应用到现代问题中，提供结构化、可落地的解决方案
            </p>
            <a 
              href="#ask-section" 
              className="inline-block bg-amber-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-amber-700 transition-colors shadow-lg"
            >
              开始提问
            </a>
          </div>
        </section>

        {/* Ask Section */}
        <section id="ask-section" className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-amber-900 mb-12">提出您的问题</h2>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label htmlFor="question" className="block text-lg font-medium text-amber-800 mb-3">
                  您面临什么问题或挑战？
                </label>
                <textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:border-amber-500 focus:outline-none text-gray-700 resize-none"
                  placeholder="例如：如何在团队中处理与同事的冲突？"
                />
              </div>
              
              <div>
                <label className="block text-lg font-medium text-amber-800 mb-3">
                  问题领域（可选）
                </label>
                <div className="flex flex-wrap gap-3">
                  {tags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagClick(tag)}
                      className={`px-4 py-2 rounded-full border-2 transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-white text-amber-700 border-amber-300 hover:border-amber-500'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="text-center">
                <button
                  type="submit"
                  disabled={!question.trim() || isLoading}
                  className="bg-amber-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
                >
                  {isLoading ? '生成中...' : '生成策略'}
                </button>
              </div>
            </form>
            
            {isLoading && (
              <div className="mt-8 text-center">
                <div className="inline-flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
                  <span className="text-amber-700">正在从古籍中寻找智慧...</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Examples Section */}
        <section id="examples" className="py-16 bg-amber-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-amber-900 mb-12">示例解答</h2>
            
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="bg-amber-100 border-l-4 border-amber-600 p-6 mb-8">
                <p className="text-amber-800 text-lg italic mb-2">
                  韩非子曾说："势不可失，失不再来。"又说："明主之道，能因时而制宜。"
                </p>
                <p className="text-amber-600 font-medium">—— 《韩非子》</p>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-amber-900 mb-4">核心逻辑</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    要抓住有利时机，因地制宜，灵活应对。
                  </p>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-amber-900 mb-4">历史案例</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    战国时期，赵国名将赵奢面对秦军入侵，没有立即应战，而是先稳住军心、调动兵力。等秦军深入腹地、补给线拉长时，赵奢突然发起攻击，大破秦军。
                  </p>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-amber-900 mb-4">照进现实</h3>
                  <p className="text-gray-700 text-lg leading-relaxed mb-4">
                    如果竞争对手疯狂降价，你可以笑着看他烧钱，不急着跟进。当他资金链吃紧时，你再推出杀手锏产品，一击制胜。
                  </p>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    比如，你先在内部会议上低调表态"我们保持策略稳定"，同时秘密筹备高性价比新品。等对手露出疲态，你的新品上市直接截胡客户。
                  </p>
                </div>
                
                <div className="bg-red-50 border-l-4 border-red-500 p-6">
                  <h3 className="text-2xl font-bold text-red-800 mb-4">风险提示</h3>
                  <p className="text-red-700 text-lg leading-relaxed">
                    但要记住，等待不是坐以待毙。北宋末年，王安石误判形势，面对辽军挑衅迟迟不动，导致士气低落、失去战略要地。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-amber-900 mb-12">关于方略</h2>
            
            <div className="max-w-4xl mx-auto text-center mb-12">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                方略是一个基于中国古籍智慧的策略生成工具，旨在帮助现代人快速获取古代智慧并应用到当下问题中。
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                我们的目标是在30秒内为您生成可执行的策略，内容基于中国古籍真实内容，并提供对应出处。
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-center text-amber-900 mb-8">书库列表</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-amber-50 rounded-lg p-6">
                  <h4 className="text-xl font-bold text-amber-800 mb-4">行正持礼</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>《论语》</li>
                    <li>《孟子》</li>
                    <li>《礼记》</li>
                    <li>《近思录》</li>
                    <li>《传习录》</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6">
                  <h4 className="text-xl font-bold text-blue-800 mb-4">顺势而为</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>《道德经》</li>
                    <li>《庄子》</li>
                    <li>《淮南子》</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6">
                  <h4 className="text-xl font-bold text-green-800 mb-4">巧谋实战</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>《孙子兵法》</li>
                    <li>《三十六计》</li>
                    <li>《鬼谷子》</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-6">
                  <h4 className="text-xl font-bold text-purple-800 mb-4">运筹帷幄</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>《韩非子》</li>
                    <li>《商君书》</li>
                    <li>《盐铁论》</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-amber-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">方略</h2>
              <p className="text-amber-200">古籍智慧，现代应用</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">快速链接</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-amber-200 hover:text-white">首页</a></li>
                <li><a href="#ask-section" className="text-amber-200 hover:text-white">提问</a></li>
                <li><a href="#examples" className="text-amber-200 hover:text-white">示例</a></li>
                <li><a href="#about" className="text-amber-200 hover:text-white">关于</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-amber-800 mt-8 pt-8 text-center">
            <p className="text-amber-200">&copy; 2024 方略. 保留所有权利。</p>
          </div>
        </div>
      </footer>
    </div>
  )
}