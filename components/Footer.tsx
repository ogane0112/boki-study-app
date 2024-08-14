import React from 'react';
import Link from 'next/link';
import { Github, MessageCircle, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">簿記３級対策サイト</h3>
            <p className="text-sm">
              簿記の学習をサポートする総合プラットフォーム。
              初心者から上級者まで、あなたの簿記スキルを磨きます。
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">クイックリンク</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-indigo-300 transition-colors">当サイトについて</Link></li>
              <li><Link href="/contact" className="hover:text-indigo-300 transition-colors">お問い合わせ</Link></li>
              <li><Link href="/privacy" className="hover:text-indigo-300 transition-colors">プライバシーポリシー</Link></li>
              <li><Link href="/terms" className="hover:text-indigo-300 transition-colors">利用規約</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">今日の簿記用語</h3>
            <p className="text-sm italic">
              &quot;仕訳&quot; - 取引を借方と貸方に分けて記録すること。
              簿記の基本中の基本です！
            </p>
            <div className="mt-4 flex space-x-4">
              <Link href="https://github.com" className="text-gray-400 hover:text-white transition-colors" aria-label="GitHub">
                <Github size={24} />
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors" aria-label="お問い合わせ">
                <MessageCircle size={24} />
              </Link>
              <Link href="mailto:info@example.com" className="text-gray-400 hover:text-white transition-colors" aria-label="メール">
                <Mail size={24} />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-gray-700 text-center text-sm">
          © {new Date().getFullYear()} 簿記マスター. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;