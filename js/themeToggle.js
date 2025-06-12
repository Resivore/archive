function initThemeSwitch() {
    const toggleBtn = document.getElementById('themeToggle');
    const lightLink = document.getElementById('lightModeLink');
    if (!toggleBtn || !lightLink) return;

     const apply = (light) => {
        toggleBtn.checked = light;
        lightLink.disabled = !light;
        localStorage.setItem('theme', light ? 'light' : 'dark');
    };

    toggleBtn.addEventListener('change', () => apply(toggleBtn.checked));

    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
        apply(true);
    } else if (saved === 'dark') {
        apply(false);
    } else {
        apply(!lightLink.disabled);
    }
}

initThemeSwitch();