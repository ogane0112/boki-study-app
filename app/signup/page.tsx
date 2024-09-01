import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import Link from 'next/link'
import { SubmitButton } from '../../components/form/submit-button'
import { Input } from '@/components/form/input'
import { Label } from '@/components/form/label'
import { FormMessage, Message } from '@/components/form/form-message'
import { encodedRedirect } from '@/utils/utils'

export default function Signup({ searchParams }: { searchParams: Message }) {
  const signUp = async (formData: FormData) => {
    'use server'
    const email = formData.get('email')?.toString()
    const confirmEmail = formData.get('confirmEmail')?.toString()
    const password = formData.get('password')?.toString()
    const confirmPassword = formData.get('confirmPassword')?.toString()
    const supabase = createClient()
    const origin = headers().get('origin')

    if (!email || !password) {
      return encodedRedirect('error', '/signup', 'メールアドレスとパスワードは必須です')
    }

    if (email !== confirmEmail) {
      return encodedRedirect('error', '/signup', 'メールアドレスが一致しません')
    }

    if (password !== confirmPassword) {
      return encodedRedirect('error', '/signup', 'パスワードが一致しません')
    }

    if (password.length < 8) {
      return encodedRedirect('error', '/signup', 'パスワードは8文字以上である必要があります')
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    })

    if (error) {
      console.error(error.code + ' ' + error.message)
      switch (error.message) {
        case 'User already registered':
          return encodedRedirect('error', '/signup', 'このメールアドレスは既に登録されています')
        case 'Password should be at least 6 characters':
          return encodedRedirect('error', '/signup', 'パスワードは6文字以上である必要があります')
        default:
          return encodedRedirect('error', '/signup', 'サインアップ中にエラーが発生しました')
      }
    } else {
      return encodedRedirect(
        'success',
        '/signup',
        'サインアップありがとうございます！確認リンクをメールで送信しました。'
      )
    }
  }

  return (
    <div className='flex flex-col min-h-screen bg-gray-900 text-white'>
      <nav className='p-4'>
        <Link
          href='/'
          className='inline-flex items-center py-2 px-4 rounded-md no-underline text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors text-sm'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1'
          >
            <polyline points='15 18 9 12 15 6' />
          </svg>{' '}
          戻る
        </Link>
      </nav>

      <main className='flex-1 flex justify-center items-center p-4'>
        <section className='w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg'>
          <form className='flex flex-col w-full gap-4'>
            <h1 className='text-2xl font-bold mb-2'>サインアップ</h1>
            <p className='text-sm text-gray-400'>
              アカウントを既に持っていますか?{' '}
              <Link className='text-blue-400 hover:underline font-medium' href='/login'>
                ログイン
              </Link>
            </p>
            <div>
              <Label htmlFor='email' className='block mb-1'>
                メールアドレス
              </Label>
              <Input
                name='email'
                type='email'
                placeholder='you@example.com'
                required
                className='w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              />
              <Label htmlFor='confirmEmail' className='block mb-1 mt-2'>
                確認用メールアドレス
              </Label>
              <Input
                name='confirmEmail'
                type='email'
                placeholder='you@example.com'
                required
                className='w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              />
            </div>
            <div>
              <Label htmlFor='password' className='block mb-1'>
                パスワード
              </Label>
              <Input
                type='password'
                name='password'
                placeholder='••••••••'
                required
                className='w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              />
              <Label htmlFor='confirmPassword' className='block mb-1 mt-2'>
                確認用パスワード
              </Label>
              <Input
                type='password'
                name='confirmPassword'
                placeholder='••••••••'
                required
                className='w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              />
            </div>
            <SubmitButton
              formAction={signUp}
              pendingText='サインアップ中...'
              className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors'
            >
              サインアップ
            </SubmitButton>
            <FormMessage message={searchParams} />
          </form>
        </section>
      </main>
    </div>
  )
}
