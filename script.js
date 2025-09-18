const urls = {
    math: "https://mp2icamilleguerin.blogspot.com/",
    info: "https://edurl.fr/mp2i-guerin",
    physique: "https://cahier-de-prepa.fr/mp2i-guerin/",
    lycee: "https://educonnect.education.gouv.fr/idp/profile/SAML2/Unsolicited/SSO?providerId=https%3A%2F%2Fmon.lyceeconnecte.fr%2Fauth%2Fsaml%2Fmetadata%2Fidp.xml",
    franceioi: "https://www.france-ioi.org/",
    prologins: "https://prologin.org/",
    discord: "https://discord.gg/CDW46S5hFw",
};
document.querySelectorAll(".button-container button").forEach((btn) => {
    const id = btn.id;
    btn.addEventListener("click", () => {
        const url = urls[id];
        console.log(url);
        window.open(url, "_blank");
    });
});
