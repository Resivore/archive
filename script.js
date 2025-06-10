// 🛠️ Confirm the script is loading
console.log('🛠️ script.js loaded')

// 1) Import Supabase client from the CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 2) Paste in your Supabase Project URL & anon-key
const SUPABASE_URL     = 'https://bnwxvoitxucqgtzowrfu.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJud3h2b2l0eHVjcWd0em93cmZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MDQxNjIsImV4cCI6MjA2NTA4MDE2Mn0.PBvgQdcf1ef1aNaSm-_6CYQVIH1JeJGolq8wKOQRyp4'  // :contentReference[oaicite:0]{index=0}

// 3) Create a Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// 4) Render helper
function renderDesigns(designs) {
  const list = document.getElementById('design-list')
  list.innerHTML = designs
    .map(d => `
      <div class="card">
        <h3>${d.name}</h3>
        <img src="${d.img1}" width="150" /><br/>
        <small>Slots: ${d.slots}</small>
      </div>`)
    .join('')
}

// 5) Load initial data
async function loadInitial() {
  const { data, error } = await supabase
    .from('designs')            // your table name
    .select('*')
    .order('createdat', { ascending: false })

  if (error) {
    console.error('Error loading designs:', error)
    return
  }
  renderDesigns(data)
}
loadInitial()

// 6) Subscribe to real-time INSERT events (v2 API)
supabase
  .channel('designs-channel')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'designs' },
    (payload) => {
      const d = payload.new
      const newCard = `
        <div class="card">
          <h3>${d.name}</h3>
          <img src="${d.img1}" width="150" /><br/>
          <small>Slots: ${d.slots}</small>
        </div>`
      document
        .getElementById('design-list')
        .insertAdjacentHTML('afterbegin', newCard)
    }
  )
  .subscribe()

// 7) Wire up the form to INSERT into Supabase
document
  .getElementById('design-form')
  .addEventListener('submit', async e => {
    // 1) stop the browser from reloading
    e.preventDefault()
    // 2) grab the form
    const f = e.target

    // 3) debug log to confirm listener is firing
    console.log('🛠️ form submit event —', {
      name:  f.name.value,
      img1:  f.img1.value,
      slots: f.slots.value
    })

    // 4) build the row object
    const formData = {
      name:  f.name.value,
      img1:  f.img1.value,
      slots: +(f.slots.value || 0),
      status: 'available'        // if you have a status column
    }

    // 5) insert into Supabase
    const { error } = await supabase
      .from('designs')
      .insert([formData])

    // 6) handle any error or reset the form
    if (error) console.error('Insert error:', error)
    else f.reset()
  })
