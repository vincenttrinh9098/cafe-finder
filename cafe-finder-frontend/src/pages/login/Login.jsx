import { useState } from 'react'
import styles from './Login.module.css'
import { LoginForm } from './components/LoginForm'
import { SocialLogin } from './components/SocialLogin'
import { validateEmail, validatePassword } from './utils/loginValidation'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  function handleEmailChange(e) {
    console.log(e)
    const value = e.target.value
    setEmail(value)
    setEmailError(validateEmail(value))
  }

  function handlePasswordChange(e) {
    const value = e.target.value
    setPassword(value)
    setPasswordError(validatePassword(value))
  }

  function handleSubmit(e) {
    e.preventDefault()

    const emailErr = validateEmail(email)
    const passwordErr = validatePassword(password)

    setEmailError(emailErr)
    setPasswordError(passwordErr)

    if (!emailErr && !passwordErr) {
      console.log('Form is valid — ready to connect to Supabase')
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>

        <div className={styles.branding}>
          <h1>SpotFinder</h1>
          <p>Find your perfect study spot</p>
        </div>

        <LoginForm
          email={email}
          password={password}
          emailError={emailError}
          passwordError={passwordError}
          onEmailChange={handleEmailChange}
          onPasswordChange={handlePasswordChange}
          onSubmit={handleSubmit}
        />

        <SocialLogin />

      </div>
    </div>
  )
}
