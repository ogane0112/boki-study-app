import Link from 'next/link';
import { Book, ArrowLeft } from 'lucide-react';

export default function Page() {
    const max = 5;
    const min = 1;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
                <h1 className="text-3xl font-bold text-blue-800 mb-6 flex items-center justify-center">
                    <Book className="mr-2" size={32} />
                    仕訳道場
                </h1>
                <p className="text-gray-600 mb-8">
                    実践的な仕訳問題に挑戦し、あなたの簿記スキルを磨きましょう！
                </p>
                <div className="space-y-4">
                    <Link href={`/question/${randomNumber}`} className="block w-full bg-blue-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-blue-700 transition-colors">
                        仕訳道場開始！！
                    </Link>
                    <Link href="/" className="block w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-full font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center">
                        <ArrowLeft className="mr-2" size={20} />
                        ホームへ戻る
                    </Link>
                </div>
            </div>
        </div>
    );
}