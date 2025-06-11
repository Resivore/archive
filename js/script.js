// Confirm the script is loading
console.log('🛠️ script.js loaded')

// Import Supabase client from the CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Supabase credentials
const SUPABASE_URL = 'https://bnwxvoitxucqgtzowrfu.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJud3h2b2l0eHVjcWd0em93cmZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MDQxNjIsImV4cCI6MjA2NTA4MDE2Mn0.PBvgQdcf1ef1aNaSm-_6CYQVIH1JeJGolq8wKOQRyp4'

// Create a Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

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
    document.getElementById('available').insertAdjacentHTML('afterbegin', buildCardHTML(d))
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
