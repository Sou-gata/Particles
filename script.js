const canvas = document.querySelector(".canvas1");
const ctx = canvas.getContext("2d");
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
let particleArry;
let particleObj = {
    speed: 3,
    MinSize: 5,
    MaxSize: 10,
    particleNumber: 200,
    starSpike: 6,
    snowStick: 10,
    shapeArray: ["star", "circle", "squre", "triangle", "hexagon", "snow"],
    shapeFill: true,
    connect: true,
};
if (particleObj.speed == undefined) {
    //if objuct is undefined
    particleObj.speed = 2;
}
if (particleObj.MinSize == undefined) {
    particleObj.MinSize = 5;
}
if (particleObj.MaxSize == undefined) {
    particleObj.MaxSize = 10;
}
if (particleObj.particleNumber == undefined) {
    particleObj.particleNumber = 200;
}
if (particleObj.starSpike == undefined) {
    particleObj.starSpike = 6;
}
if (particleObj.snowStick == undefined) {
    particleObj.snowStick = 10;
}
if (particleObj.shapeFill == undefined) {
    particleObj.shapeFill = true;
}
if (particleObj.shapeArray == undefined) {
    particleObj.shapeArray = [
        "star",
        "circle",
        "squre",
        "triangle",
        "hexagon",
        "snow",
    ];
}

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
        if (this.x + this.size > canvas.width || this.x - this.size < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y + this.size > canvas.width || this.y - this.size < 0) {
            this.directionY = -this.directionY;
        }

        this.x += this.directionX;
        this.y += this.directionY;

        this.draw();
    }
}
let hue = Math.floor(Math.random() * 360);
let hue2 = Math.floor(Math.random() * 360);
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
        let color = `hsla(${hue},80%,50%,${(Math.random() + 1) / 2})`;
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
    for (let i = 0; i < particleArry.length; i++) {
        particleArry[i].update();
    }
    if (particleObj.connect) {
        connect();
    }
    requestAnimationFrame(animate);
}
init();
animate();
window.addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
});

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

function connect() {
    
    if(hue2>360){
        hue2=0;
    }
    let opacity = 1;
    for (let a = 0; a < particleArry.length; a++) {
        hue2 += 2;
        for (let b = a; b < particleArry.length; b++) {
            let dx = particleArry[a].x - particleArry[b].x;
            let dy = particleArry[a].y - particleArry[b].y;
            let distance = dx * dx + dy * dy;
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacity = 1 - distance / 7000;
                ctx.strokeStyle = `hsla(${hue2},80%,50%,${opacity})`;
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.moveTo(particleArry[a].x, particleArry[a].y);
                ctx.lineTo(particleArry[b].x, particleArry[b].y);
                ctx.stroke();
            }
        }
    }
}
