// js/login.js
import { supabase } from './supabase.js'

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form')
  const messageEl = document.getElementById('message')

  // If already signed in, skip to /
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) window.location.href = '/'
  })

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = form.email.value
    const password = form.password.value

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      messageEl.textContent = error.message
    } else {
      window.location.href = '/'
    }
  })
})
