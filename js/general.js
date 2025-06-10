document.addEventListener("DOMContentLoaded", function () {
    // ————— Existing design‑card expand/contract logic (unchanged) —————
    let originalIndexMap = new Map();
    document.querySelectorAll(".design-card").forEach((card, index) => {
        originalIndexMap.set(card, index);
        const mainImage = card.querySelector(".main-image img");
        const previews = card.querySelectorAll(".preview-row img");
        const toggleIcon = card.querySelector(".toggle-expand");
        const footer = card.querySelector(".design-card-footer");

        previews.forEach((preview) =>
            preview.addEventListener("click", () => {
                mainImage.src = preview.src;
            })
        );

        const toggleCard = () => {
            const isExpanding = !card.classList.contains("expanded");
            document.querySelectorAll(".design-card.expanded").forEach((other) => {
                other.classList.remove("expanded");
                const icon = other.querySelector(".toggle-expand");
                if (icon) icon.classList.replace("fa-down-left-and-up-right-to-center", "fa-up-right-and-down-left-from-center");
                const ph = other.previousElementSibling;
                if (ph && ph.classList.contains("card-placeholder")) ph.replaceWith(other);
            });
            if (isExpanding) {
                const placeholder = document.createElement("div");
                placeholder.className = "card-placeholder";
                card.parentNode.insertBefore(placeholder, card);
                document.querySelector(".main-content").prepend(card);
                card.classList.add("expanded");
                toggleIcon.classList.replace("fa-up-right-and-down-left-from-center", "fa-down-left-and-up-right-to-center");
                card.scrollIntoView({ behavior: "smooth", block: "start" });
            } else {
                const next = card.nextElementSibling;
                if (next && next.classList.contains("card-placeholder")) {
                    next.replaceWith(card);
                } else {
                    const origIndex = originalIndexMap.get(card);
                    const all = Array.from(document.querySelectorAll(".design-card"));
                    const ref = all[origIndex] || null;
                    document.querySelector(".main-content").insertBefore(card, ref);
                }
                card.classList.remove("expanded");
                toggleIcon.classList.replace("fa-down-left-and-up-right-to-center", "fa-up-right-and-down-left-from-center");
                card.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        };

        footer.addEventListener("click", toggleCard);
        toggleIcon.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleCard();
        });
    });

    // ————— Sidebar drawer toggle with caret swap (unchanged) —————
    const sidebar = document.querySelector(".sidebar");
    const handle = document.querySelector(".sidebar-toggle-handle");
    const caretIcon = handle.querySelector("i");

    handle.addEventListener("click", () => {
        const isCollapsed = sidebar.classList.toggle("collapsed");
        if (isCollapsed) {
            caretIcon.classList.replace("fa-caret-left", "fa-caret-right");
        } else {
            caretIcon.classList.replace("fa-caret-right", "fa-caret-left");
        }
    });

    // ————— Lightbox Modal Logic —————
    const modalOverlay = document.getElementById("inspirationModal");
    const lightboxImg = document.getElementById("lightboxImage");
    const closeBtn = modalOverlay.querySelector(".lightbox-close");

    // 1. Intercept clicks on any “Inspiration” link inside a .description-box
    document.querySelectorAll(".description-box a").forEach((link) => {
        // Only proceed if this <a> has an image URL (ends with .png/.jpg/.jpeg/.gif)
        const href = link.getAttribute("href");
        const isImage = /\.(png|jpe?g|gif|webp)(\?.*)?$/i.test(href);
        if (!isImage) return;

        link.addEventListener("click", (event) => {
            event.preventDefault();
            lightboxImg.src = href; // set the modal’s <img> src
            modalOverlay.classList.add("show"); // make overlay visible
        });
    });

    // 2. Close the modal when “×” is clicked
    closeBtn.addEventListener("click", () => {
        modalOverlay.classList.remove("show");
        lightboxImg.src = ""; // clear src (optional, but good for reflow)
    });

    // 3. Also close if user clicks “outside” the image (on the dark backdrop)
    modalOverlay.addEventListener("click", (e) => {
        // only close if clicking the overlay itself, not the image container
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove("show");
            lightboxImg.src = "";
        }
    });
});
