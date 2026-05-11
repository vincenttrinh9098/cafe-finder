import styles from '../Login.module.css'

export function LoginForm({
  email,
  password,
  emailError,
  passwordError,
  onEmailChange,
  onPasswordChange,
  onSubmit
}) {
  return (
    <form onSubmit={onSubmit}>

      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="you@example.com"
          value={email}
          onChange={onEmailChange}
          className={emailError ? styles.inputError : ''}
        />
        <span className={styles.errorMsg}>{emailError}</span>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Enter password"
          value={password}
          onChange={onPasswordChange}
          className={passwordError ? styles.inputError : ''}
        />
        <span className={styles.errorMsg}>{passwordError}</span>
      </div>

      <button type="submit" className={styles.submitBtn}>Log in</button>

    </form>
  )
}