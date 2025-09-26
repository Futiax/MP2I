const canvas = document.getElementById("background-canvas");
const ctx = canvas.getContext("2d");
const GRAVITYSTRENGTH = 42;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// remplace les const par let pour permettre mise à jour
let gravityStrength = 42;
let POINTS = 42;
let NEIGHBORS = 7;

// points initialisation (si déjà présent, conserve)
const points = [];
for (let i = 0; i < POINTS; i++) {
    points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: Math.random() - 0.5,
        vy: Math.random() - 0.5,
    });
}

// setter utilitaires exposés
window.setGravityStrength = function (v) {
    gravityStrength = Number(v) || gravityStrength;
};
window.setNeighbors = function (n) {
    NEIGHBORS = Math.max(1, Math.min(20, Math.floor(Number(n) || NEIGHBORS)));
};
window.setPointsCount = function (newCount) {
    newCount = Math.max(3, Math.min(200, Math.floor(Number(newCount) || POINTS)));
    if (newCount === POINTS) return;
    if (newCount > POINTS) {
        // ajouter des points
        for (let i = 0; i < newCount - POINTS; i++) {
            points.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: Math.random() - 0.5,
                vy: Math.random() - 0.5,
            });
        }
    } else {
        // retirer les derniers
        points.splice(newCount);
    }
    POINTS = newCount;
};

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// adapte getNearestNeighbors pour utiliser variable NEIGHBORS (déjà le cas)
function getNearestNeighbors(idx, k = NEIGHBORS) {
    const distances = points.map((p, i) => {
        if (i === idx) return { i, d: Infinity };
        const dx = points[idx].x - p.x;
        const dy = points[idx].y - p.y;
        return { i, d: dx * dx + dy * dy };
    });
    distances.sort((a, b) => a.d - b.d);
    return distances.slice(0, k).map((obj) => obj.i);
}

function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Trace les lignes
    for (let i = 0; i < points.length; i++) {
        const neighbors = getNearestNeighbors(i, NEIGHBORS);
        for (const n of neighbors) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[n].x, points[n].y);
            ctx.strokeStyle = "rgba(0, 98, 255, 0.18)";
            const relativeDist = Math.hypot(points[i].x - points[n].x, points[i].y - points[n].y);
            ctx.lineWidth = 1 - relativeDist / (canvas.width * canvas.height);
            ctx.stroke();
        }
    }
    // Trace les points
    for (const p of points) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, 2 * Math.PI);
        ctx.fillStyle = "#6366f1";
        ctx.fill();
    }
}

let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;
let lastPointerEvent = null;

function updateMouseFromEvent(e) {
    const rect = canvas.getBoundingClientRect();
    let cx, cy;
    if (e.touches && e.touches[0]) {
        cx = e.touches[0].clientX;
        cy = e.touches[0].clientY;
    } else {
        cx =
            e.clientX !== undefined
                ? e.clientX
                : (lastPointerEvent && lastPointerEvent.clientX) || window.innerWidth / 2;
        cy =
            e.clientY !== undefined
                ? e.clientY
                : (lastPointerEvent && lastPointerEvent.clientY) || window.innerHeight / 2;
    }
    // convertir en coordonnées locales au canvas
    mouseX = cx - rect.left;
    mouseY = cy - rect.top;
    lastPointerEvent = { clientX: cx, clientY: cy, time: Date.now() };
}

// pointer / touch events (passive for perf)
window.addEventListener("pointermove", updateMouseFromEvent, { passive: true });
window.addEventListener("pointerdown", updateMouseFromEvent, { passive: true });
window.addEventListener("touchmove", updateMouseFromEvent, { passive: true });
window.addEventListener("touchstart", updateMouseFromEvent, { passive: true });

// si la page retrouve le focus sans interaction récente, recentrer le curseur virtuel
window.addEventListener("focus", () => {
    const age = lastPointerEvent ? Date.now() - lastPointerEvent.time : Infinity;
    if (!lastPointerEvent || age > 10_000) {
        // 10s sans interaction => recentre
        mouseX = canvas.width / 2;
        mouseY = canvas.height / 2;
    }
});
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && !lastPointerEvent) {
        mouseX = canvas.width / 2;
        mouseY = canvas.height / 2;
    }
});

window.mobileCheck = function () {
    let check = false;
    (function (a) {
        if (
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
                a
            ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                a.substr(0, 4)
            )
        )
            check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};
let isMobile = window.mobileCheck();

Math.confine = function (x, a, b) {
    return Math.min(Math.max(x, a), b);
};

function animate() {
    const relative = document.getElementById("points-gravity-switch")?.checked && !isMobile;
    const gravity = document.getElementById("cursor-gravity-switch")?.checked && !isMobile;
    const collisions = document.getElementById("collisions-switch")?.checked && !isMobile;
    for (const p of points) {
        if (gravity) {
            const dx = mouseX - p.x;
            const dy = mouseY - p.y;
            const anglemouse = Math.atan2(dy, dx);
            const sqaredist = dx * dx + dy * dy || 1;
            const gravityforce = gravityStrength / sqaredist;
            p.vx += Math.cos(anglemouse) * gravityforce;
            p.vy += Math.sin(anglemouse) * gravityforce;
        }
        if (relative) {
            for (const astre of points) {
                const dx = astre.x - p.x;
                const dy = astre.y - p.y;
                const sqaredist = dx * dx + dy * dy;
                if (sqaredist === 0) continue;
                const gravityforce = gravityStrength ** 2 / sqaredist ** 2;
                const angle = Math.atan2(dy, dx);
                const ax = (Math.cos(angle) * gravityforce) / Math.max(1, POINTS);
                const ay = (Math.sin(angle) * gravityforce) / Math.max(1, POINTS);
                p.vx += ax;
                p.vy += ay;
            }
        }

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        if (gravity) {
            p.vx *= 1 - 1 / 2 ** 10;
            p.vy *= 1 - 1 / 2 ** 10;
        } else {
            angle = Math.atan2(p.vy, p.vx);
            speed = Math.max(Math.sqrt(p.vx * p.vx + p.vy * p.vy), 0.25);
            speed *= Math.random() * 0.125 + 0.875;
            p.vx = Math.cos(angle) * speed;
            p.vy = Math.sin(angle) * speed;
        }

        p.vx = Math.confine(p.vx, -canvas.width / 1024, canvas.width / 1024);
        p.vy = Math.confine(p.vy, -canvas.height / 1024, canvas.height / 1024);
        p.x += p.vx;
        p.y += p.vy;
        if (collisions) {
            for (const other of points) {
                if (other !== p && Math.hypot(other.x - p.x, other.y - p.y) < 8) {
                    p.vx += other.vx;
                    p.vx *= 2;
                    p.vy += other.vy;
                    p.vy *= 2;
                    points.splice(points.indexOf(other), 1);
                    document.getElementById("points-slider").value = --POINTS;
                    document.getElementById("points-value").textContent = POINTS;
                    console.log(
                        `${points.indexOf(other)} a explosé au contact de ${points.indexOf(p)}`
                    );
                }
            }
        }
    }

    drawGraph();
    requestAnimationFrame(animate);
}
animate();
