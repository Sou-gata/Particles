const canvas = document.querySelector(".canvas1");
const ctx = canvas.getContext("2d");
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
let particleArry;

let speed = 1.5;
let MinSize = 5;
let MaxSize = 10;
let particleNumber = 200;
let starSpike = 5;
let snowStick = 4;
//star,circle,squre,triangle,hexagon,stick,snow
let shapeType = "snow"; 
let shapeFill = false;

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    draw() {
        if (shapeType == "circle") {
            drawCircle(this.x, this.y, this.size);
        } else if (shapeType == "star") {
            drawStar(this.x, this.y, starSpike, this.size, this.size / 2);
        } else if (shapeType == "squre") {
            ctx.beginPath();
            ctx.rect(this.x, this.y, this.size, this.size);
            ctx.closePath();
        } else if (shapeType == "triangle"){
            drawStar(this.x, this.y, 3, this.size, this.size / 2);
        } else if (shapeType == "hexagon"){
            drawStar(this.x, this.y, 3, this.size, this.size);
        } else if(shapeType=="stick"){
            drawStar(this.x, this.y, 1, this.size, this.size);
        } else if (shapeType == "snow"){
            drawStar(this.x, this.y, snowStick, this.size, 0);
        }
            if (shapeFill == true) {
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
//create particle
function init() {
    particleArry = [];
    for (let i = 0; i < particleNumber; i++) {
        hue += 2;
        let size = Math.random() * (MaxSize - MinSize) + MinSize;
        let x = Math.random() * (innerWidth - size * 2);
        let y = Math.random() * (innerHeight - size * 2);
        let directionX = Math.random() * speed - speed / 2;
        let directionY = Math.random() * speed - speed / 2;
        if (hue == 360) {
            hue = 0;
        }
        let color = `hsla(${hue},80%,50%,${(Math.random() + 1) / 2})`;

        particleArry.push(
            new Particle(x, y, directionX, directionY, size, color)
        );
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < particleArry.length; i++) {
        particleArry[i].update();
    }
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
