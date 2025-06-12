document.addEventListener('DOMContentLoaded', () => {
  // — Sidebar collapse toggle (from sidebar.js) :contentReference[oaicite:0]{index=0}
  const sidebar       = document.querySelector('.sidebar');
  const toggleHandle  = document.querySelector('.sidebar-toggle-handle');
  const toggleIcon    = toggleHandle.querySelector('i');

  toggleHandle.addEventListener('click', () => {
    const collapsed = sidebar.classList.toggle('collapsed');
    toggleIcon.classList.toggle('fa-caret-left', !collapsed);
    toggleIcon.classList.toggle('fa-caret-right',  collapsed);
  });

  // — Section dropdowns (from sidebarDropdowns.js) :contentReference[oaicite:1]{index=1}
  const sections = document.querySelectorAll('.sidebar .section');

  sections.forEach((section, index) => {
    const header      = section.querySelector('h2');
    if (!header) return;

    // use a different name so it doesn’t shadow toggleIcon
    const sectionIcon = document.createElement('i');
    sectionIcon.classList.add('fa-solid', 'toggle-icon');

    if (index === 0) {
      sectionIcon.classList.add('fa-caret-up');
    } else {
      section.classList.add('collapsed');
      sectionIcon.classList.add('fa-caret-down');
    }

    header.appendChild(sectionIcon);

    header.addEventListener('click', () => {
      const isCollapsed = section.classList.toggle('collapsed');
      sectionIcon.classList.toggle('fa-caret-down', isCollapsed);
      sectionIcon.classList.toggle('fa-caret-up',   !isCollapsed);
    });
  });
});
