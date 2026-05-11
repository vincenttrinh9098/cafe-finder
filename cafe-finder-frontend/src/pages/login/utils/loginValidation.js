export function validateEmail(value) {
  if (value.trim() === '') {
    return 'Email is required'
  }
  if (!value.includes('@') || !value.includes('.')) {
    return 'Enter a valid email address'
  }
  return ''
}

export function validatePassword(value) {
  if (value.trim() === '') {
    return 'Password is required'
  }
  if (value.length < 6) {
    return 'Password must be at least 6 characters'
  }
  return ''
}
