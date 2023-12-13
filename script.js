const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.querySelector(".score--value");
const finalScoreElement = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");

const audio = new Audio("../audio.mp3");

const size = 30;

const initialPosition = { x: 270, y: 240 }

let snake = [initialPosition];

let direction, LoopId;


const incrementScore = () => {
    scoreElement.innerText = +scoreElement.innerText + 10;
};

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
}

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30
}

const randomColor = () => {
    const red = randomNumber(0,255)
    const green = randomNumber(0,255)
    const blue = randomNumber(0,255)

    return `rgb(${red}, ${green}, ${blue})`
}


const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
};

const drawFood = () => {

    const {x, y, color} = food
    
    ctx.shadowColor = color
    ctx.shadowBlur = 10
    ctx.fillStyle = color
    ctx.fillRect(food. x, food.y, size, size)
    ctx.shadowBlur = 0
}

const drawSnake = () => {
    ctx.fillStyle = "#ddd"

    snake.forEach((position, index) => {
        
        if (index == snake.length - 1) {
            ctx.fillStyle = "white"
        
        }
        
        ctx.fillRect(position.x, position.y, size, size)
    })
}

const moveSnake = () => {
    if (!direction) return
    
    const head = snake[snake.length - 1]


    if (direction == "right") {
        snake.push({ x: head.x + size, y: head.y })

    }

    
    if (direction == "left") {
        snake.push({ x: head.x - size, y: head.y })

    }

    if (direction == "down") {
        snake.push({ x: head.x, y: head.y + size })

    }

    if (direction == "up") {
        snake.push({ x: head.x, y: head.y - size })

    }
    
    
    
    snake.shift()
}

const drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "#191919"
    
    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, canvas.height)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    
    }
}

drawGrid()

const chackEat = () => {
    const head = snake[snake.length - 1];

    if (head.x === food.x && head.y === food.y) {
        incrementScore()
        snake.push({ x: head.x, y: head.y });
        audio.play()

        let x = randomPosition();
        let y = randomPosition();

        while (snake.find((position) => position.x === x && position.y === y)) {
            x = randomPosition();
            y = randomPosition();
        }

        food.x = x;
        food.y = y;
        food.color = randomColor();
    }
};

const checkCollision = () => {
    const head = snake[snake.length - 1];
    const canvasLimitX = canvas.width - size;
    const canvasLimitY = canvas.height - size;
    const neckIndex = snake.length - 2;

    const wallCollision =
        head.x < 0 || head.x > canvasLimitX || head.y < 0 || head.y > canvasLimitY;
    
        const selfCollision = snake.find ((position, index) => {
            return index < neckIndex && position.x === head.x && position.y === head.y;

        });


        if (wallCollision || selfCollision) {
            gameOver();
        }
    };
    
    const gameOver = () => {
        direction = undefined;
    
        menu.style.display = "flex";
        finalScoreElement.innerText = scoreElement.innerText;
        canvas.style.filter = "blur(4px)";
    };

const gameLoop = () => {
    clearInterval(LoopId)
   
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()
    chackEat()
    checkCollision()
    
   LoopId = setTimeout (() => {
        gameLoop ()
    }, 250)
}

gameLoop()

const handleKeyPress = (event) => {
    const key = event.key;
    
    if (key === "ArrowRight" && direction !== "left") {
        direction = "right";
    } else if (key === "ArrowLeft" && direction !== "right") {
        direction = "left";
    } else if (key === "ArrowDown" && direction !== "up") {
        direction = "down";
    } else if (key === "ArrowUp" && direction !== "down") {
        direction = "up";
    }
};

const handleTouch = (event) => {
    const touchX = event.touches[0].clientX;
    const touchY = event.touches[0].clientY;

    const canvasRect = canvas.getBoundingClientRect();
    const canvasX = touchX - canvasRect.left;
    const canvasY = touchY - canvasRect.top;


    if (canvasX > canvas.width / 2 && direction !== "left") {
        direction = "right";
    } else if (canvasX <= canvas.width / 2 && direction !== "right") {
        direction = "left";
    } else if (canvasY > canvas.height / 2 && direction !== "up") {
        direction = "down";
    } else if (canvasY <= canvas.height / 2 && direction !== "down") {
        direction = "up";
    }
};

document.addEventListener("keydown", handleKeyPress);
canvas.addEventListener("touchstart", (event) => {
    event.preventDefault();
    handleTouch(event);
});

buttonPlay.addEventListener("click", () => {
    scoreElement.innerText = "00";
    menu.style.display = "none";
    canvas.style.filter = "none";

    snake = [initialPosition];
    direction = undefined;
    gameLoop();
});

