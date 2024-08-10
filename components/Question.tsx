// components/Question.tsx
'use client'

import { getRandomNumberExcluding } from "@/utils/action"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface QuestionProps {
  props: {
    question_id: number;
    question_text: string;
    correct_debit_entries: { [key: string]: number };
    correct_credit_entries: { [key: string]: number };
    explanation?: string; // 解説はオプション
  }[];
}

export default function Question({ props }: QuestionProps) {
  const question = props[0];

  const [userDebitEntry, setUserDebitEntry] = useState<{ [key: string]: number }>({});
  const [userCreditEntry, setUserCreditEntry] = useState<{ [key: string]: number }>({});
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [lastAnsweredTime, setLastAnsweredTime] = useState<number | null>(null);

  useEffect(() => {
    // ローカルストレージから回答状況を読み込み
    const storedData = localStorage.getItem('quizProgress');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const currentTime = Date.now();
      // 30分以内の回答であれば復元
      if (currentTime - parsedData.lastAnsweredTime < 30 * 1000 * 60) {
        setTotalAnswers(parsedData.totalAnswers || 0);
        setCorrectAnswers(parsedData.correctAnswers || 0);
      } else {
        // ローカルストレージ全体をクリア
        localStorage.clear();
      }
    }
  }, []);

  const router = useRouter();

  const handleNextQuestion = () => {
    const storedData: any = localStorage.getItem('quizProgress');
    const parsedData = JSON.parse(storedData);
    console.log((parsedData))
    const randomQuestionId: number = getRandomNumberExcluding(parsedData.pastAnsQuestion, 1, 5)
    console.log(randomQuestionId)
    router.push(`/question/${randomQuestionId}`); // next/navigation を使用してページ遷移
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // デフォルトの submit 動作をキャンセル

    // 回答の判定
    const storedData: any = localStorage.getItem('quizProgress');
    let parsedData = JSON.parse(storedData);
    try {
      parsedData = JSON.parse(storedData || '{}');
    } catch (error) {
      console.error('Error parsing quizProgress data:', error);
      // エラー処理（例：localStorage をクリアする、デフォルト値を設定するなど）
      localStorage.removeItem('quizProgress');
      parsedData = {};
    }

    const pastAnsQuestion = Array.isArray(parsedData.pastAnsQuestion)
      ? parsedData.pastAnsQuestion
      : [];

    // ここで最新の userDebitEntry と userCreditEntry を取得
    const currentDebitEntry = {
      debitAccountName: (e.currentTarget.elements.namedItem("debitAccountName") as HTMLInputElement)?.value || "",
      debitAmount: parseInt((e.currentTarget.elements.namedItem("debitAmount") as HTMLInputElement)?.value || "0") || 0,
    };
    const currentCreditEntry = {
      creditAccountName: (e.currentTarget.elements.namedItem("creditAccountName") as HTMLInputElement)?.value || "",
      creditAmount: parseInt((e.currentTarget.elements.namedItem("creditAmount") as HTMLInputElement)?.value || "0") || 0,
    };
    console.log(currentDebitEntry)
// キーと値のペアで判定
const isDebitKeyCorrect = currentDebitEntry.debitAccountName === Object.keys(question.correct_debit_entries)[0];
const isDebitValueCorrect = currentDebitEntry.debitAmount === Object.values(question.correct_debit_entries)[0];
const isCreditKeyCorrect = currentCreditEntry.creditAccountName === Object.keys(question.correct_credit_entries)[0];
const isCreditValueCorrect = currentCreditEntry.creditAmount === Object.values(question.correct_credit_entries)[0];

    const questionedList = [...pastAnsQuestion] as any;
    questionedList.push(question.question_id);

    setIsCorrect( (isDebitKeyCorrect&&isDebitValueCorrect)&&(isCreditKeyCorrect&&isCreditValueCorrect) );

    // ローカルストレージの更新
    setTotalAnswers(totalAnswers + 1);
    if ( ( (isDebitKeyCorrect&&isDebitValueCorrect)&&(isCreditKeyCorrect&&isCreditValueCorrect)  )) {
      setCorrectAnswers(correctAnswers + 1);
    }
    localStorage.setItem(
      'quizProgress',
      JSON.stringify({
        totalAnswers: totalAnswers + 1,
        correctAnswers: (isDebitKeyCorrect&&isDebitValueCorrect)&&(isCreditKeyCorrect&&isCreditValueCorrect)  ? correctAnswers + 1 : correctAnswers,
        lastAnsweredTime: Date.now(),
        pastAnsQuestion: questionedList

      })
    );
  };

  const handleDebitEntryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserDebitEntry({ ...userDebitEntry, [name]: parseInt(value) || 0 });
  };

  const handleCreditEntryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserCreditEntry({ ...userCreditEntry, [name]: parseInt(value) || 0 });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600">問題 {question.question_id}</h2>
      <p className="mb-4 text-gray-700">{question.question_text}</p>
      {question.explanation && (
        <p className="mb-6 p-3 bg-gray-100 rounded text-sm text-gray-600">
          解説: {question.explanation}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-indigo-500">借方</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="debitAccountName" className="block text-sm font-medium text-gray-700 mb-1">
                勘定科目:
              </label>
              <input
                type="text"
                id="debitAccountName"
                name="debitAccountName"
                onChange={handleDebitEntryChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="debitAmount" className="block text-sm font-medium text-gray-700 mb-1">
                金額:
              </label>
              <input
                type="number"
                id="debitAmount"
                name="debitAmount"
                onChange={handleDebitEntryChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 text-indigo-500">貸方</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="creditAccountName" className="block text-sm font-medium text-gray-700 mb-1">
                勘定科目:
              </label>
              <input
                type="text"
                id="creditAccountName"
                name="creditAccountName"
                onChange={handleCreditEntryChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="creditAmount" className="block text-sm font-medium text-gray-700 mb-1">
                金額:
              </label>
              <input
                type="number"
                id="creditAmount"
                name="creditAmount"
                onChange={handleCreditEntryChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out"
        >
          回答する
        </button>
      </form>

      {isCorrect !== null && (
        <div className="mt-8 p-4 bg-gray-50 rounded-md">
          <p className={`text-lg font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrect ? '正解です！' : '不正解です...'}
          </p>
          <p className="text-sm text-gray-600 mt-2">累計回答数: {totalAnswers}</p>
          <p className="text-sm text-gray-600">累計正答数: {correctAnswers}</p>
          <button
            onClick={handleNextQuestion}
            className="mt-4 w-full bg-indigo-100 text-indigo-700 py-2 px-4 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          >
            次の問題へ
          </button>
        </div>
      )}
    </div>
  );
}


