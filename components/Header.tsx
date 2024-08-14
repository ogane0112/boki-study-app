"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserCircle, Home, BookOpen, ClipboardList, Menu } from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    // メニューが開いている間はスクロールを無効にする
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
  }, [isMobileMenuOpen]);

  return (
    <header className="bg-indigo-600 text-white shadow-md h-12 relative"> 
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center justify-between">
          <div className="text-xl font-bold">簿記３級対策サイト</div>

          {/* ハンバーガーメニューボタン */}
          <button className="md:hidden z-10" onClick={toggleMobileMenu}> 
            <Menu size={24} />
          </button>

          {/* PC表示時のナビゲーションメニュー */}
          <ul className="hidden md:flex space-x-6">
            <li>
              <Link href="/login" className="flex items-center hover:text-indigo-200 transition-colors">
                <UserCircle className="mr-1" size={20} />
                <span>ログイン/初回登録</span>
              </Link>
            </li>
            <li>
              <Link href="/" className="flex items-center hover:text-indigo-200 transition-colors">
                <Home className="mr-1" size={20} />
                <span>ホーム</span>
              </Link>
            </li>
            <li>
              <Link href="/question" className="flex items-center hover:text-indigo-200 transition-colors">
                <BookOpen className="mr-1" size={20} />
                <span>仕分け道場</span>
              </Link>
            </li>
            <li>
              <Link href="/pastquestions" className="flex items-center hover:text-indigo-200 transition-colors">
                <ClipboardList className="mr-1" size={20} />
                <span>過去問道場</span>
              </Link>
            </li>
          </ul>

          {/* モバイル表示時のナビゲーションメニュー */}
          {isMobileMenuOpen && (
            <ul className="absolute top-0 left-0 w-full bg-indigo-600 p-4 space-y-2 md:hidden">
              <li>
                <Link href="/login" className="flex items-center hover:text-indigo-200 transition-colors" onClick={toggleMobileMenu}> 
                  <UserCircle className="mr-1" size={20} />
                  <span>ログイン/初回登録</span>
                </Link>
              </li>
              <li>
                <Link href="/" className="flex items-center hover:text-indigo-200 transition-colors" onClick={toggleMobileMenu}>
                  <Home className="mr-1" size={20} />
                  <span>ホーム</span>
                </Link>
              </li>
              <li>
                <Link href="/question" className="flex items-center hover:text-indigo-200 transition-colors" onClick={toggleMobileMenu}>
                  <BookOpen className="mr-1" size={20} />
                  <span>仕分け道場</span>
                </Link>
              </li>
              <li>
                <Link href="/pastquestions" className="flex items-center hover:text-indigo-200 transition-colors" onClick={toggleMobileMenu}>
                  <ClipboardList className="mr-1" size={20} />
                  <span>過去問道場</span>
                </Link>
              </li>
            </ul>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;



