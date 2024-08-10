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
    <div>
      <h2>問題 {question.question_id}</h2>
      <p>{question.question_text}</p>
      {question.explanation && <p>解説: {question.explanation}</p>}

      <form onSubmit={handleSubmit}> {/* handleSubmit を直接渡す */}
        <h3>借方</h3>
        <div>
          <label htmlFor="debitAccountName">勘定科目:</label>
          <input type="text" id="debitAccountName" name="debitAccountName" onChange={handleDebitEntryChange} />
        </div>
        <div>
          <label htmlFor="debitAmount">金額:</label>
          <input type="number" id="debitAmount" name="debitAmount" onChange={handleDebitEntryChange} />
        </div>

        <h3>貸方</h3>
        <div>
          <label htmlFor="creditAccountName">勘定科目:</label>
          <input type="text" id="creditAccountName" name="creditAccountName" onChange={handleCreditEntryChange} />
        </div>
        <div>
          <label htmlFor="creditAmount">金額:</label>
          <input type="number" id="creditAmount" name="creditAmount" onChange={handleCreditEntryChange} />
        </div>

        <button type="submit">回答する</button>
      </form>

      {isCorrect !== null && (
        <div>
          <p>{isCorrect ? '正解です！' : '不正解です...'}</p>
          <p>累計回答数: {totalAnswers}</p>
          <p>累計正答数: {correctAnswers}</p>
          <button onClick={handleNextQuestion}>次の問題へ</button>
        </div>
      )}
    </div>
  );
}


