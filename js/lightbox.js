document.addEventListener("DOMContentLoaded", function () {
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
            lightboxImg.referrerPolicy = "no-referrer"; // ─── Tell the browser “no-referrer” before loading the IMG ───
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
