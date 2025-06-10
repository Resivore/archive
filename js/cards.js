// ───────────────────────────────────────────────────────────
// Monkey‐patch scrollIntoView to always add a 20px upward offset
// ───────────────────────────────────────────────────────────
(function () {
    const orig = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function (arg) {
        // 1) Let the native scrollIntoView run (it will scroll <main class="main-content">)
        orig.call(this, arg);

        // 2) On the next animation frame, shift that same container up by 20px
        requestAnimationFrame(() => {
            // Find the scrollable ancestor
            let scrollable = this;
            while (scrollable && scrollable !== document.body) {
                const style = getComputedStyle(scrollable);
                if (/auto|scroll/.test(style.overflowY)) break;
                scrollable = scrollable.parentElement;
            }

            if (scrollable && scrollable !== document.body) {
                // Compute offset of 'this' within the container
                const rect = this.getBoundingClientRect();
                const contRect = scrollable.getBoundingClientRect();
                const offsetWithin = rect.top - contRect.top + scrollable.scrollTop;
                const target = Math.max(0, offsetWithin - 20);
                scrollable.scrollTo({ top: target, behavior: "smooth" });
            } else {
                // Fallback to window if no inner container
                const rect = this.getBoundingClientRect();
                const absoluteTop = window.scrollY + rect.top;
                window.scrollTo({ top: Math.max(0, absoluteTop - 20), behavior: "smooth" });
            }
        });
    };
})();

document.addEventListener("DOMContentLoaded", function () {
    // For each .main-content section on the page...
    document.querySelectorAll(".main-content").forEach((container) => {
        // Build a map of each design-card → its original index *within this container*.
        const originalIndexMap = new Map();
        const cards = Array.from(container.querySelectorAll(".design-card"));

        cards.forEach((card, index) => {
            originalIndexMap.set(card, index);

            const mainImage = card.querySelector(".main-image img");
            const previews = card.querySelectorAll(".preview-row img");
            const toggleIcon = card.querySelector(".toggle-expand");
            const footer = card.querySelector(".design-card-footer");

            // 1) If there are preview images, clicking them swaps the main image
            previews.forEach((preview) => {
                preview.addEventListener("click", () => {
                    mainImage.src = preview.src;
                });
            });

            const toggleCard = () => {
                const isExpanding = !card.classList.contains("expanded");

                // Collapse any other expanded cards in this container
                container.querySelectorAll(".design-card.expanded").forEach((other) => {
                    if (other === card) return;
                    other.classList.remove("expanded");

                    // Swap that other card’s icon back if it exists
                    const otherIcon = other.querySelector(".toggle-expand");
                    if (otherIcon) {
                        otherIcon.classList.replace("fa-down-left-and-up-right-to-center", "fa-up-right-and-down-left-from-center");
                    }

                    // Replace its placeholder (if any), or reinsert at original index
                    const ph = other.previousElementSibling;
                    if (ph && ph.classList.contains("card-placeholder")) {
                        ph.replaceWith(other);
                    } else {
                        const otherIndex = originalIndexMap.get(other);
                        const siblings = Array.from(container.querySelectorAll(".design-card"));
                        const ref = siblings[otherIndex] || null;
                        if (ref) container.insertBefore(other, ref);
                        else container.appendChild(other);
                    }
                });

                if (isExpanding) {
                    // ────────────────────────────────────────────────────────────────
                    // EXPAND this card:
                    // 1) Insert a placeholder where it currently is
                    const placeholder = document.createElement("div");
                    placeholder.className = "card-placeholder";
                    card.parentNode.insertBefore(placeholder, card);

                    // 2) Move the card to the top of its container
                    container.prepend(card);

                    // 3) Flip on the "expanded" class and swap the icon
                    card.classList.add("expanded");
                    if (toggleIcon) {
                        toggleIcon.classList.replace("fa-up-right-and-down-left-from-center", "fa-down-left-and-up-right-to-center");
                    }

                    // 4) Now simply call scrollIntoView(): our monkey‐patch will
                    //    automatically add the 20px buffer for us on the next tick.
                    card.scrollIntoView({ behavior: "smooth", block: "start" });
                    // ────────────────────────────────────────────────────────────────
                } else {
                    // ────────────────────────────────────────────────────────────────
                    // COLLAPSE this card:
                    // 1) If a placeholder follows, swap it back; otherwise reinsert at original index
                    const next = card.nextElementSibling;
                    if (next && next.classList.contains("card-placeholder")) {
                        next.replaceWith(card);
                    } else {
                        const origIndex = originalIndexMap.get(card);
                        const siblings = Array.from(container.querySelectorAll(".design-card"));
                        const ref = siblings[origIndex] || null;
                        if (ref) container.insertBefore(card, ref);
                        else container.appendChild(card);
                    }

                    // 2) Remove the "expanded" class and swap icon back
                    card.classList.remove("expanded");
                    if (toggleIcon) {
                        toggleIcon.classList.replace("fa-down-left-and-up-right-to-center", "fa-up-right-and-down-left-from-center");
                    }

                    // 3) Again, call scrollIntoView(); the same monkey‐patch will shift up by 20px
                    card.scrollIntoView({ behavior: "smooth", block: "start" });
                    // ────────────────────────────────────────────────────────────────
                }
            };

            // Only bind if these elements exist (so sold/created cards don’t break)
            if (footer) {
                footer.addEventListener("click", toggleCard);
            }
            if (toggleIcon) {
                toggleIcon.addEventListener("click", (e) => {
                    e.stopPropagation();
                    toggleCard();
                });
            }
        });
    });

    // ───────────────────────────────────────────────────────────────────────
    // H A S H  H A N D L I N G  (unchanged)
    // If the URL has a hash (e.g. #available-stained-glass or #sold-someCard),
    // expand that card (which calls scrollIntoView under the hood).
    // Our monkey‐patch will then “tack on” the extra 20px.
    // ───────────────────────────────────────────────────────────────────────
    const hash = window.location.hash.substring(1);
    if (hash) {
        const target = document.getElementById(hash);
        if (target && target.classList.contains("design-card")) {
            const footer = target.querySelector(".design-card-footer");
            if (footer) {
                // We wait a tiny bit so that the DOM is fully rendered, then click:
                setTimeout(() => {
                    footer.click();
                }, 50);
            }
        }
    }
});
