// Customization

let particleObj = {
    speed: 3,
    MinSize: 5,
    MaxSize: 7,
    particleNumber: 150,
    starSpike: 5,
    snowStick: 10,
    shapeArray: ["star", "circle", "squre", "triangle", "hexagon", "snow"],
    shapeFill: false,
    connect: false,
    mouseConnect: false,
    lineDistance: 5,
    particleColor: "random", // random or colour code like #ff0000
    connectLineHue: "random", // 'random' or hue range between 0 and 360
    mouseLineColor: "random", // random or colour code like #ff0000
    effectType: "bounce", // bounce or open
};

const canvas = document.querySelector(".canvas1");
const ctx = canvas.getContext("2d");
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
let particleArry = [];
let hue = Math.floor(Math.random() * 360);
let mouse = {
    x: undefined,
    y: undefined,
};
class Particle {
    constructor(x, y, directionX, directionY, size, color, shapeType) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        this.shapeType = shapeType;
    }
    draw() {
        if (this.shapeType == "circle") {
            drawCircle(this.x, this.y, this.size);
        } else if (this.shapeType == "star") {
            drawStar(
                this.x,
                this.y,
                particleObj.starSpike,
                this.size,
                this.size / 2
            );
        } else if (this.shapeType == "squre") {
            drawStar(this.x, this.y, 2, this.size, this.size);
        } else if (this.shapeType == "triangle") {
            drawStar(this.x, this.y, 3, this.size, this.size / 2);
        } else if (this.shapeType == "hexagon") {
            drawStar(this.x, this.y, 3, this.size, this.size);
        } else if (this.shapeType == "snow") {
            drawStar(this.x, this.y, particleObj.snowStick, this.size, 0);
            ctx.strokeStyle = this.color;
            ctx.stroke();
        } else {
            drawCircle(this.x, this.y, this.size);
        }
        if (particleObj.shapeFill) {
            ctx.fillStyle = this.color;
            ctx.fill();
        } else {
            ctx.strokeStyle = this.color;
            ctx.stroke();
        }
    }
    update() {
        if (particleObj.effectType == "bounce") {
            if (this.x + this.size > canvas.width || this.x - this.size < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y + this.size > canvas.height || this.y - this.size < 0) {
                this.directionY = -this.directionY;
            }
        } else if (particleObj.effectType == "open") {
            if (this.x > canvas.width) {
                this.x = 0 + this.size;
            }
            if (this.y - this.size > canvas.height) {
                this.y = 0 + this.size;
            }
            if (this.y < 0) {
                this.y = canvas.height;
            }
            if (this.x < 0) {
                this.x = canvas.width;
            }
        }

        this.x += this.directionX;
        this.y += this.directionY;

        this.draw();
    }
}

//create particle

function init() {
    particleArry = [];
    for (let i = 0; i < particleObj.particleNumber; i++) {
        hue += 2;
        let size =
            Math.random() * (particleObj.MaxSize - particleObj.MinSize) +
            particleObj.MinSize;
        let x = Math.random() * (innerWidth - size * 2);
        let y = Math.random() * (innerHeight - size * 2);
        let directionX =
            Math.random() * particleObj.speed - particleObj.speed / 2;
        let directionY =
            Math.random() * particleObj.speed - particleObj.speed / 2;
        if (hue == 360) {
            hue = 0;
        }
        let color;
        if (particleObj.particleColor == "random") {
            color = `hsla(${hue},80%,50%,1)`;
        } else {
            color = particleObj.particleColor;
        }
        let shapeType =
            particleObj.shapeArray[
                Math.floor(Math.random() * particleObj.shapeArray.length)
            ];
        particleArry.push(
            new Particle(x, y, directionX, directionY, size, color, shapeType)
        );
    }
}
function animate() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    if (particleObj.connect) {
        connect();
    }
    if (particleObj.mouseConnect) {
        connectMouse();
    }
    for (let i = 0; i < particleArry.length; i++) {
        particleArry[i].update();
    }
    requestAnimationFrame(animate);
}
init();
animate();

// Draw functions

function drawStar(positionX, positionY, spikes, outerRadious, innerRadious) {
    let rotation = (Math.PI / 2) * 3;
    let x = positionX;
    let y = positionY;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(positionX, positionY - outerRadious);
    for (let i = 0; i < spikes; i++) {
        x = positionX + Math.cos(rotation) * outerRadious;
        y = positionY + Math.sin(rotation) * outerRadious;
        ctx.lineTo(x, y);
        rotation += step;
        x = positionX + Math.cos(rotation) * innerRadious;
        y = positionY + Math.sin(rotation) * innerRadious;
        ctx.lineTo(x, y);
        rotation += step;
    }
    ctx.lineTo(positionX, positionY - outerRadious);
    ctx.closePath();
}
function drawCircle(x, y, size) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2, false);
    ctx.closePath();
}

// Connect functions

function connect() {
    if (hue > 360) {
        hue = 0;
    }
    let opacity = 1;
    for (let a = 0; a < particleArry.length; a++) {
        hue += 2;
        for (let b = a; b < particleArry.length; b++) {
            let dx = particleArry[a].x - particleArry[b].x;
            let dy = particleArry[a].y - particleArry[b].y;
            let distance = dx * dx + dy * dy;
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacity = 1 - distance / (particleObj.lineDistance * 1000);
                if (particleObj.connectLineHue == "random") {
                    ctx.strokeStyle = `hsla(${hue},80%,50%,${opacity})`;
                } else {
                    ctx.strokeStyle = `hsla(${particleObj.connectLineHue},80%,50%,${opacity})`;
                }
                ctx.beginPath();
                ctx.lineWidth = 2;
                ctx.moveTo(particleArry[a].x, particleArry[a].y);
                ctx.lineTo(particleArry[b].x, particleArry[b].y);
                ctx.stroke();
            }
        }
    }
}
function connectMouse() {
    if (hue > 360) {
        hue = 0;
    }
    for (let a = 0; a < particleArry.length; a++) {
        hue += 2;
        let dx = particleArry[a].x - mouse.x;
        let dy = particleArry[a].y - mouse.y;
        let distance = dx * dx + dy * dy;
        if (distance < (canvas.width / 7) * (canvas.height / 7)) {
            if (particleObj.mouseLineColor == "random") {
                ctx.strokeStyle = `hsla(${hue},80%,50%,0.75)`;
            } else {
                ctx.strokeStyle = particleObj.mouseLineColor;
            }
            ctx.beginPath();
            ctx.lineWidth = 1.5;
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(particleArry[a].x, particleArry[a].y);
            ctx.stroke();
        }
    }
}

// Event Listners

window.addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
});
window.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});
canvas.addEventListener("mouseleave", () => {
    mouse.x = undefined;
    mouse.y = undefined;
});
