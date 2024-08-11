import Link from 'next/link';
export default function Page(){
    const max = 5
    const min = 1
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return(
        <div>
            <h1>仕分け道場</h1>
            <Link href="/">ホームへ戻る</Link>
            <Link href={`/question/${randomNumber}`}>ホームへ戻る</Link>
        </div>
        
    )
}