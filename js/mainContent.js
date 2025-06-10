// new mainContent.js

// 1) Cache your panels and section names:
const allSections = Array.from(document.querySelectorAll(".main-content"));
const sectionNames = allSections.map((sec) => sec.id);
// e.g. ["available","sold","created","requests"]

function hideAllPanels() {
    allSections.forEach((panel) => {
        panel.style.display = "none";
    });
}

function showPanel(id) {
    const panel = document.getElementById(id);
    if (panel) panel.style.display = "flex";
}

function updateActiveLink(id) {
    document.querySelectorAll(".nav-links a").forEach((a) => {
        if (a.getAttribute("href") === `#${id}`) {
            a.classList.add("active");
        } else {
            a.classList.remove("active");
        }
    });
}

function showCurrentPanel() {
    hideAllPanels();
    // Grab “whatever” is after the “#”
    const raw = window.location.hash.substring(1) || "available";

    // 1) If raw exactly equals a section, show it:
    if (sectionNames.includes(raw)) {
        showPanel(raw);
        updateActiveLink(raw);
        return;
    }

    // 2) Otherwise, maybe raw starts with "available-", "sold-", etc.?
    const [maybeSection] = raw.split("-", 1);
    // e.g. raw="available-stained-glass" → maybeSection="available"

    if (sectionNames.includes(maybeSection)) {
        showPanel(maybeSection);
        updateActiveLink(maybeSection);
        return;
    }

    // 3) Fallback: default to “available”
    showPanel("available");
    updateActiveLink("available");
}

window.addEventListener("DOMContentLoaded", showCurrentPanel);
window.addEventListener("hashchange", showCurrentPanel);
