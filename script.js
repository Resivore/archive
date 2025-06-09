console.log('🛠️ script.js loaded')

// 1) Import Supabase client from the CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 2) Paste in your Supabase Project URL & anon-key
const SUPABASE_URL = 'https://bnwxvoitxucqgtzowrfu.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJud3h2b2l0eHVjcWd0em93cmZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MDQxNjIsImV4cCI6MjA2NTA4MDE2Mn0.PBvgQdcf1ef1aNaSm-_6CYQVIH1JeJGolq8wKOQRyp4'

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
    .from('designs')           // or your table name
    .select('*')
    .order('createdat', { ascending: false })

  if (error) return console.error(error)
  renderDesigns(data)
}
loadInitial()

// 6) Subscribe to real-time INSERT events in v2
supabase
  .channel('designs-channel')                         // give it any name
  .on(
    'postgres_changes',                                // this says “I want DB changes”
    { event: 'INSERT', schema: 'public', table: 'designs' },
    (payload) => {
      // exactly the same rendering code you had:
      const newCard = `
        <div class="card">
          <h3>${payload.new.name}</h3>
          <img src="${payload.new.img1}" width="150" /><br/>
          <small>Slots: ${payload.new.slots}</small>
        </div>`
      document.getElementById('design-list')
        .insertAdjacentHTML('afterbegin', newCard)
    }
  )
  .subscribe()

// 7) Wire up the form to INSERT into Supabase
document
  .getElementById('design-form')
  .addEventListener('submit', async e => {
    console.log('🛠️ form submit event —', {
  name: f.name.value,
  img1: f.img1.value,
  slots: f.slots.value
})
    e.preventDefault()
    const f = e.target
    const formData = {
      name:   f.name.value,
      img1: f.img1.value,
      slots: +(f.slots.value || 0),
      status: 'available'         // if you have a status column
    }

    const { error } = await supabase
      .from('designs')
      .insert([formData])

    if (error) console.error(error)
    else f.reset()             // clear the form on success
  })
