import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { SubmitButton } from '../../components/form/submit-button'
import { Label } from '@/components/form/label'
import { Input } from '@/components/form/input'
import { FormMessage, Message } from '@/components/form/form-message'
import { encodedRedirect } from '@/utils/utils'

export default function Login({ searchParams }: { searchParams: Message }) {
  const signIn = async (formData: FormData) => {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return encodedRedirect('error', '/login', 'Could not authenticate user')
    }

    return redirect('/')
  }

  return (
    <div className='flex flex-col md:flex-row min-h-screen'>
      <nav className='p-4 '>
        <Link
          href='/'
          className='inline-flex items-center py-2 px-4 rounded-md no-underline font-bold bg-blue-700 hover:bg-blue-600  text-white   transition-colors text-sm'
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
        <section className='w-full max-w-md bg-white p-8 rounded-lg shadow-lg'>
          <form className='flex flex-col w-full gap-4'>
            <h1 className='text-2xl mb-2 font-bold text-blue-800'>サインイン</h1>
            <div>
              <Label htmlFor='email' className='block mb-1'>
                メールアドレス
              </Label>
              <Input
                name='email'
                type='email'
                placeholder='you@example.com'
                required
                className='w-full px-3 py-2  rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              />
            </div>
            <div>
              <div className='flex justify-between items-center mb-1'>
                <Label htmlFor='password'className='block mb-1 '>パスワード</Label>
                <Link className='text-sm text-blue-400 hover:underline' href='/forgot-password'>
                  パスワードをお忘れですか?
                </Link>
              </div>
              <Input
                type='password'
                name='password'
                placeholder='••••••••'
                required
                className='w-full px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              />
            </div>
            <div className='flex items-center mb-4'>
            </div>
            <SubmitButton
              formAction={signIn}
              pendingText='サインイン中...'
              className='w-full bg-blue-600 hover:bg-blue-700  text-white font-bold block py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors'
            >
              サインイン
            </SubmitButton>
            <FormMessage message={searchParams} />
            <p className='text-sm text-center mt-4'>
              アカウントをお持ちでないですか?{' '}
              <Link className='text-blue-400 hover:underline font-medium' href='/signup'>
                新規登録
              </Link>
            </p>
          </form>
        </section>
      </main>
    </div>
  )
}
