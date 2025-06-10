document.addEventListener('DOMContentLoaded', function () {
    const toggleBtn = document.getElementById('themeToggle');
    const lightLink = document.getElementById('lightModeLink');
    if (!toggleBtn || !lightLink) return;

    function apply(light) {
        if (light) {
            lightLink.removeAttribute('disabled');
            toggleBtn.checked = true;
            localStorage.setItem('theme', 'light');
        } else {
            lightLink.setAttribute('disabled', '');
            toggleBtn.checked = false;
            localStorage.setItem('theme', 'dark');
        }
    }

    toggleBtn.addEventListener('change', function () {
        apply(toggleBtn.checked);
    });

    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
        apply(true);
    } else if (saved === 'dark') {
        apply(false);
    } else {
        // initialize based on current stylesheet state
        apply(!lightLink.hasAttribute('disabled'));
    }
});