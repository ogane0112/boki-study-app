import React from 'react';
import Link from 'next/link';
import { Book, Award, BarChart, Users } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen  from-indigo-100 to-white">
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-indigo-800 mb-4">
            簿記マスターへの道
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            初心者から上級者まで、あなたの簿記スキルを磨くための最高のプラットフォーム
          </p>
          <Link href="/register" className="bg-indigo-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-indigo-700 transition-colors">
            今すぐ始める
          </Link>
        </section>

        {/* Features Section */}
        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            { icon: <Book size={40} />, title: "仕訳道場", description: "実践的な仕訳問題で基礎を固める" },
            { icon: <Award size={40} />, title: "過去問道場", description: "本番さながらの問題で実力を試す" },
            { icon: <BarChart size={40} />, title: "進捗管理", description: "あなたの学習状況を可視化" },
            { icon: <Users size={40} />, title: "コミュニティ", description: "仲間と一緒に成長しよう" },
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="text-indigo-600 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </section>

        {/* CTA Section */}
        <section className="bg-indigo-800 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">あなたの簿記力、今すぐチェック！</h2>
          <p className="mb-6">無料の診断テストで現在のレベルを確認しましょう</p>
          <Link href="/diagnostic-test" className="bg-white text-indigo-800 px-8 py-3 rounded-full text-lg font-semibold hover:bg-indigo-100 transition-colors">
            無料診断テストを受ける
          </Link>
        </section>
      </main>
    </div>
  );
};

export default HomePage;