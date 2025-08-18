'use client';

import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* 顶部导航栏 */}
      <nav className="flex justify-between items-center p-6">
        <div className="text-2xl font-bold text-blue-900">
          方略 <span className="text-lg font-normal">Fanglue</span>
        </div>
        <div className="space-x-6">
          <button className="text-blue-900 hover:text-blue-700">登录</button>
          <button className="text-blue-900 hover:text-blue-700">注册</button>
        </div>
      </nav>

      {/* 主标题区域 */}
      <div className="text-center py-16">
        <h1 className="text-5xl font-bold text-blue-900 mb-4">
          三十息，问古今
          <br />
          千年略，解一念
        </h1>
        <p className="text-xl text-blue-900 mb-8">
          从经史到兵法，古智与算法，同答一问
        </p>
        
        {/* 主要行动按钮 */}
        <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-colors">
          立即寻策
        </button>
      </div>

      {/* 功能模块 */}
      <div className="max-w-4xl mx-auto px-6 py-12">
         <div className="grid grid-cols-3 gap-4 md:gap-8">
          {/* 探源 */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 6h28c2 0 4 2 4 4v28c0 2-2 4-4 4H8c-2 0-4-2-4-4V10c0-2 2-4 4-4z" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 14h20M12 20h20M12 26h16" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="40" cy="8" r="3" fill="#dc2626"/>
                <path d="M38 6l4 4M42 6l-4 4" stroke="white" strokeWidth="1"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-blue-900 mb-2">探源</h3>
            <p className="text-blue-900 text-sm">
              溯古问道<br />
              择智珠以为引
            </p>
          </div>

          {/* 析局 */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="6" width="12" height="12" rx="2" fill="none" stroke="#1e3a8a" strokeWidth="2"/>
                <rect x="30" y="6" width="12" height="12" rx="2" fill="none" stroke="#1e3a8a" strokeWidth="2"/>
                <rect x="6" y="30" width="12" height="12" rx="2" fill="none" stroke="#1e3a8a" strokeWidth="2"/>
                <rect x="30" y="30" width="12" height="12" rx="2" fill="none" stroke="#1e3a8a" strokeWidth="2"/>
                <path d="M18 12h12M18 36h12M12 18v12M36 18v12" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="24" cy="24" r="3" fill="#1e3a8a"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-blue-900 mb-2">析局</h3>
            <p className="text-blue-900 text-sm">
              洞察机枢<br />
              见万变之本脉
            </p>
          </div>

          {/* 行策 */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 6l18 36H6L24 6z" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M24 6v36" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round"/>
                <path d="M16 28l8-8 8 8" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="24" cy="16" r="2" fill="#1e3a8a"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-blue-900 mb-2">行策</h3>
            <p className="text-blue-900 text-sm">
              授你谋纲<br />
              行于九地八方
            </p>
          </div>
        </div>
      </div>

      {/* 底部标语 */}
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold text-blue-900">
          让千载经略，为你今日一策
        </h2>
      </div>
    </div>
  );
}