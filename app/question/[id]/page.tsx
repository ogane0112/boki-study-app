// app/question/[id]/page.tsx
//ログインなしで解くことのできる
import { createClient } from '@/utils/supabase/server';
import type { PostgrestResponse } from '@supabase/supabase-js'; 
import Question from "@/components/Question"
export default async function QuestionPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { id } = params;

  const { data: userAnswers, error } = await supabase
    .from('questions')
    .select('*')
    .eq('question_id', id);

  if (error) {
    console.error(error);
  }else{
    console.log("よくここ見てくれたね( ´∀｀ )")
    console.log(userAnswers)
  }

  return (
    <>
        <Question props = {userAnswers} />
    </>
  );
}
