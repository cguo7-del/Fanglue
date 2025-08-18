'use client';

import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-amber-900 text-amber-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 品牌信息 */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">方</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-amber-100">方略</h3>
                <p className="text-amber-300 text-sm">古籍智慧现代应用</p>
              </div>
            </div>
            <p className="text-amber-200 mb-4 leading-relaxed">
              方略致力于将中华古代典籍的智慧与现代生活相结合，通过AI技术让古代先贤的思想为现代人的生活、工作和学习提供指导。
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-amber-300 hover:text-amber-100 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-amber-300 hover:text-amber-100 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="text-amber-300 hover:text-amber-100 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* 快速链接 */}
          <div>
            <h4 className="text-lg font-semibold text-amber-100 mb-4">快速链接</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-amber-300 hover:text-amber-100 transition-colors">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/ask-question" className="text-amber-300 hover:text-amber-100 transition-colors">
                  智能问答
                </Link>
              </li>
              <li>
                <Link href="/smart-search" className="text-amber-300 hover:text-amber-100 transition-colors">
                  智能搜索
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="text-amber-300 hover:text-amber-100 transition-colors">
                  我的收藏
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-amber-300 hover:text-amber-100 transition-colors">
                  个人中心
                </Link>
              </li>
            </ul>
          </div>

          {/* 古籍典藏 */}
          <div>
            <h4 className="text-lg font-semibold text-amber-100 mb-4">古籍典藏</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-amber-300 hover:text-amber-100 transition-colors">
                  论语
                </a>
              </li>
              <li>
                <a href="#" className="text-amber-300 hover:text-amber-100 transition-colors">
                  道德经
                </a>
              </li>
              <li>
                <a href="#" className="text-amber-300 hover:text-amber-100 transition-colors">
                  孙子兵法
                </a>
              </li>
              <li>
                <a href="#" className="text-amber-300 hover:text-amber-100 transition-colors">
                  大学·中庸
                </a>
              </li>
              <li>
                <a href="#" className="text-amber-300 hover:text-amber-100 transition-colors">
                  孟子
                </a>
              </li>
              <li>
                <a href="#" className="text-amber-300 hover:text-amber-100 transition-colors">
                  史记
                </a>
              </li>
              <li>
                <a href="#" className="text-amber-300 hover:text-amber-100 transition-colors">
                  资治通鉴
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 分割线 */}
        <div className="border-t border-amber-800 my-8"></div>

        {/* 底部信息 */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 mb-4 md:mb-0">
            <p className="text-amber-300 text-sm">
              © {currentYear} 方略. 保留所有权利.
            </p>
            <div className="flex space-x-4 text-sm">
              <a href="#" className="text-amber-300 hover:text-amber-100 transition-colors">
                隐私政策
              </a>
              <a href="#" className="text-amber-300 hover:text-amber-100 transition-colors">
                服务条款
              </a>
              <a href="#" className="text-amber-300 hover:text-amber-100 transition-colors">
                联系我们
              </a>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-amber-300 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>传承古代智慧，服务现代生活</span>
          </div>
        </div>
      </div>

      {/* 装饰性元素 */}
      <div className="bg-amber-950 py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center space-x-8 text-amber-400 text-xs">
            <span>"学而时习之，不亦说乎？"</span>
            <span className="hidden md:inline">·</span>
            <span className="hidden md:inline">"知己知彼，百战不殆"</span>
            <span className="hidden lg:inline">·</span>
            <span className="hidden lg:inline">"上善若水，水善利万物而不争"</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;