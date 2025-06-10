document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".sidebar .section");

    sections.forEach((section, index) => {
        const header = section.querySelector("h2");
        if (!header) return;

        const icon = document.createElement("i");
        icon.classList.add("fa-solid", "toggle-icon");

        // 1) If this is the first section, leave it expanded (caret-up).
        // 2) Otherwise, start collapsed (caret-down) and hide its <ul>.
        if (index === 0) {
            icon.classList.add("fa-caret-up");
        } else {
            section.classList.add("collapsed");
            icon.classList.add("fa-caret-down");
        }

        header.appendChild(icon);

        header.addEventListener("click", () => {
            const isCollapsed = section.classList.toggle("collapsed");
            if (isCollapsed) {
                icon.classList.replace("fa-caret-up", "fa-caret-down");
            } else {
                icon.classList.replace("fa-caret-down", "fa-caret-up");
            }
        });
    });
});
