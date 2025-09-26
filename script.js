const urls = {
    math: "https://mp2icamilleguerin.blogspot.com/",
    info: "https://edurl.fr/mp2i-guerin",
    physique: "https://cahier-de-prepa.fr/mp2i-guerin/",
    lycee: "https://educonnect.education.gouv.fr/idp/profile/SAML2/Unsolicited/SSO?providerId=https%3A%2F%2Fmon.lyceeconnecte.fr%2Fauth%2Fsaml%2Fmetadata%2Fidp.xml",
    franceioi: "https://www.france-ioi.org/",
    prologins: "https://prologin.org/",
    discord: "https://discord.gg/CDW46S5hFw",
    CodingUp: "https://codingup.fr/",
    Codinggame: "https://www.codingame.com/multiplayer/clashofcode",
};
document.querySelectorAll(".button-container button").forEach((btn) => {
    const id = btn.id;
    btn.addEventListener("click", () => {
        const url = urls[id];
        console.log(url);
        window.open(url, "_blank");
    });
});
url = [
    994180040, 600259700, 500216436, 925400304, 931653011, 250108218, 1006685391, 1431869263,
    1256793606, 700302962, 131306830, 1563176119, 1356836873, 819104331, 1175508457, 1019190864,
    1000432741, 1169255748, 1031696265, 387667745, 1469385486, 587754287, 644028626, 1256793607,
    25010863, 500216439, 1288057129, 1119234123, 1588186921, 1388100335, 1106728684, 1119234113,
    1156750335, 937905703, 31263634, 518974529, 56274446, 656534020, 1144244933, 931652991,
    531479953, 794093525, 1163003045, 1275551731, 1306815252, 100043369, 844115151, 18758222,
    1106728703, 600259699, 31263637, 325140722, 1338078751, 1031696268, 1288057121, 644028607,
    1575681526, 1569428809, 293877189, 1206771916, 243855551, 43769036, 431436615, 131306869,
    568996174, 375162345, 1294309846, 106296069, 1044201682, 1525659891, 719061055, 225097445,
    350151540, 262613663, 31263628, 1519407173, 1150497631, 1350584178, 950411109, 93790675,
    869125972, 1400605797,
];

let sequence = [];
document.addEventListener("keydown", (event) => {
    console.log(event.key);
    sequence.push(event.key);
    if (sequence.length > 2) {
        sequence.shift();
    }
    id = sequence[0].charCodeAt(0) ** 2 + sequence[1].charCodeAt(0) ** 4;
    decrypted = [];
    for (let i = 0; i < url.length; i++) {
        decrypted.push(String.fromCharCode(url[i] % id));
    }
    if (decrypted.slice(0, 8).join("") == "https://") {
        window.location.href = decrypted.join("");
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("settings-btn");
    const panel = document.getElementById("settings-panel");

    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!panel.classList.contains("visible")) {
            panel.style.display = "flex";
            // Force reflow pour l’animation
            void panel.offsetWidth;
            panel.classList.add("visible");
            btn.classList.add("rotating");
        } else {
            panel.classList.remove("visible");
            btn.classList.remove("rotating");
            // Attends la fin de la transition pour masquer
            panel.addEventListener("transitionend", function hidePanel() {
                if (!panel.classList.contains("visible")) {
                    panel.style.display = "none";
                }
                panel.removeEventListener("transitionend", hidePanel);
            });
        }
    });

    document.addEventListener("mousedown", (e) => {
        if (panel.classList.contains("visible") && !panel.contains(e.target) && e.target !== btn) {
            panel.classList.remove("visible");
            btn.classList.remove("rotating");
            panel.addEventListener("transitionend", function hidePanel() {
                if (!panel.classList.contains("visible")) {
                    panel.style.display = "none";
                }
                panel.removeEventListener("transitionend", hidePanel);
            });
        }
    });

    panel.addEventListener("mousedown", (e) => {
        e.stopPropagation();
    });
});
