const canvas = document.getElementById("background-canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const POINTS = 42;
const NEIGHBORS = 7;
const points = [];
for (let i = 0; i < POINTS; i++) {
    points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
    });
}

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
    // Draw connections
    for (let i = 0; i < points.length; i++) {
        const neighbors = getNearestNeighbors(i, NEIGHBORS);
        for (const n of neighbors) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[n].x, points[n].y);
            ctx.strokeStyle = "rgba(0, 98, 255, 0.18)";
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }
    // Draw points
    for (const p of points) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, 2 * Math.PI);
        ctx.fillStyle = "#6366f1";
        ctx.fill();
    }
}

function animate() {
    for (const p of points) {
        p.x += p.vx;
        p.y += p.vy;
        // Bounce on edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    }
    drawGraph();
    requestAnimationFrame(animate);
}
animate();
