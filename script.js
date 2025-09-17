document.querySelectorAll(".button-container button").forEach((btn) => {
    btn.addEventListener("click", () => {
        const url = btn.getAttribute("data-url");
        if (url) window.open(url, "_blank");
    });
});
