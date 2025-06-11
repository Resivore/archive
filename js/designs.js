// js/designs.js
import { supabase } from './supabase.js'

const slug = str =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-\$/g, '')

function buildCardHTML(d) {
  const slotIcons = Array.from({ length: 4 })
    .map((_, i) =>
      i < (d.slots || 0)
        ? '<i class="fas fa-circle"></i>'
        : '<i class="far fa-circle"></i>'
    )
    .join('')

  const previews = [d.img1, d.img2, d.img3, d.img4]
    .filter(Boolean)
    .map((url, i) => `<img src="${url}" alt="Thumb ${i + 1}" referrerpolicy="no-referrer"/>`)
    .join('')
  const previewRow = previews ? `<div class="preview-row">${previews}</div>` : ''

  const section = (title, value) =>
    value
      ? `<div class="section"><h2>${title}</h2><ul><li>${value}</li></ul></div>`
      : ''

  const inspo = d.inspo
    ? `<div class="section"><h2><a href="${d.inspo}" target="_blank" rel="noopener noreferrer">Inspiration</a></h2></div>`
    : ''
  const notes = d.notes
    ? `<div class="section"><h2>Notes</h2><ul><li>${d.notes}</li></ul></div>`
    : ''

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
  list.innerHTML = designs.map(buildCardHTML).join('')
  if (window.setupDesignCards) window.setupDesignCards(list)
}

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

document.addEventListener('DOMContentLoaded', () => {
  const listEl = document.getElementById('available')
  if (!listEl) return

  loadInitial()

  supabase
    .channel('designs-channel')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'designs' },
      ({ new: d }) => {
        if (d.status !== 'available') return
        listEl.insertAdjacentHTML('afterbegin', buildCardHTML(d))
        if (window.setupDesignCards) window.setupDesignCards(listEl)
      }
    )
    .subscribe()

  const formEl = document.getElementById('design-form')
  if (formEl) {
    formEl.addEventListener('submit', async (e) => {
      e.preventDefault()
      const f = e.target
      console.log('🛠️ form submit —', {
        name: f.name.value,
        img1: f.img1.value,
        slots: f.slots.value,
      })
      const formData = {
        name: f.name.value,
        img1: f.img1.value,
        slots: +(f.slots.value || 0),
        status: 'available',
      }
      const { error } = await supabase.from('designs').insert([formData])
      if (error) console.error('Insert error:', error)
      else f.reset()
    })
  }
})
