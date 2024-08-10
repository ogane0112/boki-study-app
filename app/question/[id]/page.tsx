import { createClient } from '@/utils/supabase/server';
import type { PostgrestResponse } from '@supabase/supabase-js'; 
import Question from "@/components/Question"

interface QuestionProps {
    props: { 
        question_id: number; 
        question_text: string; 
        correct_debit_entries: { [key: string]: number }; 
        correct_credit_entries: { [key: string]: number }; 
        explanation?: string; 
    }[] 
}

export default async function QuestionPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { id } = params;

  const { data: userAnswers, error } = await supabase
    .from('questions')
    .select('*')
    .eq('question_id', id);

  if (error || userAnswers.length === 0) {
    return <div>問題が見つかりませんでした</div>;
  }

  return (
    <>
        <Question props={userAnswers} />
    </>
  );
}

