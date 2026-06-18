import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './Login.module.css'
import { LoginForm } from './components/LoginForm'
import { SocialLogin } from './components/SocialLogin'
import { validateEmail, validatePassword } from './utils/loginValidation'
import supabase from '../../lib/supabase'

export function Login() {
  const navigate = useNavigate()
  const location = useLocation();
  const from = location.state?.from?.pathname ?? '/';
  navigate(from, { replace: true });




  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [authError, setAuthError] = useState('')



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

  async function handleSubmit(e) {
    e.preventDefault()

    const emailErr = validateEmail(email)
    const passwordErr = validatePassword(password)

    setEmailError(emailErr)
    setPasswordError(passwordErr)

    if (!emailErr && !passwordErr) {
      // If login fails: error has a message
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setAuthError(error.message)
        return
      }

      console.log('logged in user:', data.user)
      navigate('/profile/')
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
          authError={authError}
          onEmailChange={handleEmailChange}
          onPasswordChange={handlePasswordChange}
          onSubmit={handleSubmit}
        />

        <SocialLogin />

      </div>
    </div>
  )
}
