'use client';

import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 relative overflow-hidden">
      {/* 背景装饰元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-200/30 to-orange-300/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-200/30 to-indigo-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-amber-100/20 to-orange-100/20 rounded-full blur-3xl"></div>
      </div>
      
      {/* 顶部导航栏 */}
      <nav className="relative z-10 flex justify-between items-center p-6 backdrop-blur-sm bg-white/10 border-b border-white/20">
        <div className="text-3xl font-bold bg-gradient-to-r from-amber-800 via-orange-700 to-red-700 bg-clip-text text-transparent">
          方略 <span className="text-xl font-light text-slate-600">Fanglue</span>
        </div>
        <div className="space-x-4">
          <button className="px-4 py-2 text-slate-700 hover:text-amber-700 font-medium transition-all duration-300 hover:scale-105">登录</button>
          <button className="px-6 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:from-amber-700 hover:to-orange-700">注册</button>
        </div>
      </nav>

      {/* 主标题区域 */}
      <div className="relative z-10 text-center py-20 px-6">
        <div className="animate-fade-in-up">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-amber-800 via-orange-700 to-red-700 bg-clip-text text-transparent drop-shadow-sm">
              三十息，问古今
            </span>
            <br />
            <span className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 bg-clip-text text-transparent">
              千年略，解一念
            </span>
          </h1>
          <p className="text-2xl text-slate-600 mb-12 font-light leading-relaxed max-w-2xl mx-auto">
            从经史到兵法，古智与算法，同答一问
          </p>
          
          {/* 主要行动按钮 */}
          <Link href="/ask-question" className="group relative inline-block px-12 py-4 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white rounded-full text-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 hover:from-amber-700 hover:via-orange-700 hover:to-red-700 transform hover:-translate-y-1">
            <span className="relative z-10">立即寻策</span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
          </Link>
        </div>
      </div>

      {/* 功能模块 */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* 探源 */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-white/50">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl group-hover:from-amber-200 group-hover:to-orange-200 transition-all duration-500">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 6h28c2 0 4 2 4 4v28c0 2-2 4-4 4H8c-2 0-4-2-4-4V10c0-2 2-4 4-4z" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 14h20M12 20h20M12 26h16" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="40" cy="8" r="3" fill="#dc2626"/>
                <path d="M38 6l4 4M42 6l-4 4" stroke="white" strokeWidth="1.5"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent mb-3">探源</h3>
            <p className="text-slate-600 text-base leading-relaxed font-medium">
              溯古问道<br />
              择智珠以为引
            </p>
          </div>

          {/* 析局 */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-white/50">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-500">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="6" width="12" height="12" rx="2" fill="none" stroke="#2563eb" strokeWidth="2.5"/>
                <rect x="30" y="6" width="12" height="12" rx="2" fill="none" stroke="#2563eb" strokeWidth="2.5"/>
                <rect x="6" y="30" width="12" height="12" rx="2" fill="none" stroke="#2563eb" strokeWidth="2.5"/>
                <rect x="30" y="30" width="12" height="12" rx="2" fill="none" stroke="#2563eb" strokeWidth="2.5"/>
                <path d="M18 12h12M18 36h12M12 18v12M36 18v12" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="24" cy="24" r="3" fill="#2563eb"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-3">析局</h3>
            <p className="text-slate-600 text-base leading-relaxed font-medium">
              洞察机枢<br />
              见万变之本脉
            </p>
          </div>

          {/* 行策 */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-white/50">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl group-hover:from-emerald-200 group-hover:to-teal-200 transition-all duration-500">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 6l18 36H6L24 6z" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M24 6v36" stroke="#059669" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M16 28l8-8 8 8" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="24" cy="16" r="2" fill="#059669"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent mb-3">行策</h3>
            <p className="text-slate-600 text-base leading-relaxed font-medium">
              授你谋纲<br />
              行于九地八方
            </p>
          </div>
        </div>
      </div>

      {/* 底部标语 */}
      <div className="relative z-10 text-center py-20">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-700 via-amber-700 to-orange-700 bg-clip-text text-transparent leading-relaxed">
          让千载经略，为你今日一策
        </h2>
        <div className="mt-8 flex justify-center">
          <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}