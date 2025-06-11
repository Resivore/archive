// js/authStatus.js
import { supabase } from './supabase.js'

document.addEventListener('DOMContentLoaded', () => {
  const authStatusEl = document.getElementById('auth-status')

  async function renderAuthStatus() {
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data: profile, error } = await supabase
        .from('users')
        .select('username')
        .eq('archiveid', user.id)
        .single()

      if (error) {
        console.error('Error loading profile:', error)
        authStatusEl.textContent = 'Error loading user'
        return
      }

      authStatusEl.innerHTML = `
        <div>signed in as <b>${profile.username}</b></div>
        <a class="small" href="#" id="sign-out">sign out</a>
      `
      document.getElementById('sign-out').addEventListener('click', async (e) => {
        e.preventDefault()
        await supabase.auth.signOut()
        renderAuthStatus()
      })

    } else {
      authStatusEl.innerHTML = `
        <div>
          <a href="/login.html">log in</a>
          &nbsp;|&nbsp;
          <a href="/signup.html">sign up</a>
        </div>
      `
    }
  }

  renderAuthStatus()

  supabase.auth.onAuthStateChange(() => {
    renderAuthStatus()
  })
})
