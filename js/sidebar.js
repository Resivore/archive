document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".sidebar");
    const toggleHandle = document.querySelector(".sidebar-toggle-handle");
    const icon = toggleHandle.querySelector("i");

    toggleHandle.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");

        // Swap the caret direction
        if (sidebar.classList.contains("collapsed")) {
            icon.classList.remove("fa-caret-left");
            icon.classList.add("fa-caret-right");
        } else {
            icon.classList.remove("fa-caret-right");
            icon.classList.add("fa-caret-left");
        }
    });
});
