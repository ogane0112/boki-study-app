import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { SubmitButton } from '../../components/form/submit-button'
import { Label } from '@/components/form/label'
import { Input } from '@/components/form/input'
import { FormMessage, Message } from '@/components/form/form-message'
import { headers } from 'next/headers'
import { encodedRedirect } from '@/utils/utils'

export default function ForgotPassword({ searchParams }: { searchParams: Message }) {
  const forgotPassword = async (formData: FormData) => {
    'use server'

    const email = formData.get('email')?.toString()
    const confirmEmail = formData.get('confirmEmail')?.toString()
    const supabase = createClient()
    const origin = headers().get('origin')
    const callbackUrl = formData.get('callbackUrl')?.toString()

    if (!email) {
      return encodedRedirect('error', '/forgot-password', 'メールアドレスを入力してください')
    }
    if (email != confirmEmail) {
      return encodedRedirect('error', '/forgot-password', 'メールアドレスが一致しません')
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
    })

    if (error) {
      console.error(error.message)
      return encodedRedirect('error', '/forgot-password', 'パスワードをリセットできませんでした')
    }

    if (callbackUrl) {
      return redirect(callbackUrl)
    }

    return encodedRedirect(
      'success',
      '/forgot-password',
      'パスワードリセット用のリンクをメールで送信しました。'
    )
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
            <h1 className='text-2xl font-bold mb-2'>パスワードリセット</h1>
            <p className='text-sm text-gray-400'>
              アカウントをお持ちですか?{' '}
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
            </div>
            <div>
              <Label htmlFor='confirmEmail' className='block mb-1'>
                メールアドレス（確認）
              </Label>
              <Input
                name='confirmEmail'
                type='email'
                placeholder='you@example.com'
                required
                className='w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              />
            </div>
            <SubmitButton
              formAction={forgotPassword}
              className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors'
            >
              パスワードをリセット
            </SubmitButton>
            <FormMessage message={searchParams} />
          </form>
        </section>
      </main>
    </div>
  )
}
