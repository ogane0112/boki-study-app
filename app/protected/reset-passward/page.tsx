import { FormMessage, Message } from '@/components/form/form-message'
import { Input } from '@/components/form/input'
import { Label } from '@/components/form/label'
import { SubmitButton } from '@/components/form/submit-button'
import { createClient } from '@/utils/supabase/server'
import { encodedRedirect } from '@/utils/utils'

export default async function ResetPassword({ searchParams }: { searchParams: Message }) {
  const resetPassword = async (formData: FormData) => {
    'use server'
    const supabase = createClient()

    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!password || !confirmPassword) {
      encodedRedirect(
        'error',
        '/protected/reset-password',
        'パスワードとパスワード確認の入力が必要です'
      )
    }

    if (password !== confirmPassword) {
      encodedRedirect(
        'error',
        '/protected/reset-password',
        'パスワードと確認用パスワードが一致しません'
      )
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    if (error) {
      encodedRedirect('error', '/protected/reset-password', 'パスワードの更新に失敗しました')
    }

    encodedRedirect('success', '/protected/reset-password', 'パスワードを正常に更新しました')
  }

  return (
    <div className='flex-1 flex flex-col items-center justify-center w-full'>
      <form className='flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4'>
        <h1 className='text-2xl font-medium'>Reset password</h1>
        <p className='text-sm text-foreground/60'>Please enter your new password below.</p>

        <Label htmlFor='password'>New password</Label>
        <Input type='password' name='password' placeholder='New password' required />
        <Label htmlFor='confirmPassword'>Confirm password</Label>
        <Input type='password' name='confirmPassword' placeholder='Confirm password' required />
        <SubmitButton formAction={resetPassword}>Reset password</SubmitButton>
        <FormMessage message={searchParams} />
      </form>
    </div>
  )
}
