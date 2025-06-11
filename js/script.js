// Confirm the script is loading
console.log('🛠️ script.js loaded')

// Import Supabase client from the CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Supabase credentials
const supabase = createClient(window.SUPABASE_URL,
                              window.SUPABASE_ANON_KEY)

// Helper to slugify a string for element IDs
const slug = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-\$/g, '')

// Build the HTML for a single design card
function buildCardHTML(d) {
  const slotIcons = Array.from({ length: 4 })
    .map((_, i) => i < (d.slots || 0) ? '<i class="fas fa-circle"></i>' : '<i class="far fa-circle"></i>')
    .join('')

  const previews = [d.img1, d.img2, d.img3, d.img4]
    .filter(Boolean)
    .map((url, i) => `<img src="${url}" alt="Thumb ${i + 1}" referrerpolicy="no-referrer"/>`)
    .join('')
  const previewRow = previews ? `<div class="preview-row">${previews}</div>` : ''

  const section = (title, value) => {
    if (!value) return ''
    return `<div class="section"><h2>${title}</h2><ul><li>${value}</li></ul></div>`
  }

  const inspo = d.inspo ? `<div class="section"><h2><a href="${d.inspo}" target="_blank" rel="noopener noreferrer">Inspiration</a></h2></div>` : ''
  const notes = d.notes ? `<div class="section"><h2>Notes</h2><ul><li>${d.notes}</li></ul></div>` : ''

  return `
<div class="design-card" id="available-${slug(d.name)}">
  <div class="design-card-header">
    <span class="design-name">${d.name}</span>
    <span class="token-slots">${slotIcons}</span>
  </div>
  <div class="design-card-body">
    <div class="card-images">
      <div class="main-image">
        <img src="${d.img1}" alt="Full view" referrerpolicy="no-referrer"/>
      </div>
      ${previewRow}
    </div>
    <div class="description-box">
      ${section('Dyes', d.dyes)}
      ${section('DNAs', d.dnas)}
      ${section('Brushes', d.brushes)}
      ${inspo}
      ${notes}
    </div>
  </div>
  <div class="design-card-footer">
    <i class="fas fa-up-right-and-down-left-from-center toggle-expand"></i>
  </div>
</div>`
}

function renderDesigns(designs) {
  const list = document.getElementById('available')
    list.innerHTML = designs.map(d => buildCardHTML(d)).join('')
  if (window.setupDesignCards) window.setupDesignCards(list)
}

// Load initial data
async function loadInitial() {
  const { data, error } = await supabase
    .from('designs')
    .select('*')
    .eq('status', 'available')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error loading designs:', error)
    return
  }
  renderDesigns(data)
}
loadInitial()

// Listen for real-time INSERT events
supabase
  .channel('designs-channel')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'designs' }, (payload) => {
    const d = payload.new
    if (d.status !== 'available') return
    const list = document.getElementById('available')
    list.insertAdjacentHTML('afterbegin', buildCardHTML(d))
    if (window.setupDesignCards) window.setupDesignCards(list)
  })
  .subscribe()

// Form submit handler
document.getElementById('design-form').addEventListener('submit', async (e) => {
  e.preventDefault()
  const f = e.target
  console.log('🛠️ form submit event —', { name: f.name.value, img1: f.img1.value, slots: f.slots.value })
  const formData = { name: f.name.value, img1: f.img1.value, slots: +(f.slots.value || 0), status: 'available' }
  const { error } = await supabase.from('designs').insert([formData])
  if (error) console.error('Insert error:', error)
  else f.reset()
})

const authStatusEl = document.getElementById('auth-status')

async function renderAuthStatus() {
  // 1) Check if there's a signed-in user:
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // 2) If so, fetch their username from your users table:
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

    // 3) Render “Signed in as …” with a Sign out link:
    authStatusEl.innerHTML = `
      <div>signed in as <b>${profile.username}</b></div>
      <a class="small" href="#" id="sign-out">sign out</a>
    `
    document
      .getElementById('sign-out')
      .addEventListener('click', async (e) => {
        e.preventDefault()
        await supabase.auth.signOut()
        // reload or re-render
        renderAuthStatus()
      })

  } else {
    // 4) No user → show login / signup links
    authStatusEl.innerHTML = `
      <div><a href="/login.html">log in</a>
      &nbsp;|&nbsp;
      <a href="/signup.html">sign up</a></div>
    `
  }
}

// 5) Initial render:
renderAuthStatus()

// 6) Re-render on auth changes (optional but handy)
supabase.auth.onAuthStateChange((event, session) => {
  renderAuthStatus()
})

document.addEventListener('DOMContentLoaded', async () => {
  const { data: { user } } = await supabase.auth.getUser()
  const ownerId = "{{ ownerId }}"            // from front matter

  if (user && user.id === ownerId) {
    // show the controls
    document.getElementById('owner-controls-wrapper').style.display = 'block'
  }
})
