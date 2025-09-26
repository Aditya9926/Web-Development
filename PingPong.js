const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 90;
const BALL_RADIUS = 10;
const PLAYER_X = 30;
const AI_X = canvas.width - PLAYER_X - PADDLE_WIDTH;
const PADDLE_SPEED = 8;
const AI_SPEED = 4;

// Game variables
let playerY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let aiY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: 5 * (Math.random() > 0.5 ? 1 : -1),
    vy: 4 * (Math.random() > 0.5 ? 1 : -1)
};

// Mouse control for player paddle
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    // Clamp paddle within canvas
    if (playerY < 0) playerY = 0;
    if (playerY > canvas.height - PADDLE_HEIGHT) playerY = canvas.height - PADDLE_HEIGHT;
});

// Draw everything
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw middle line
    ctx.strokeStyle = '#444';
    ctx.setLineDash([10, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = '#fff';
    ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    // Draw scores (optional, not implemented here)
}

// Ball and paddle movement
function update() {
    // Move ball
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Ball collision with top/bottom
    if (ball.y - BALL_RADIUS < 0 || ball.y + BALL_RADIUS > canvas.height) {
        ball.vy *= -1;
        // Clamp ball inside canvas
        ball.y = Math.max(BALL_RADIUS, Math.min(canvas.height - BALL_RADIUS, ball.y));
    }

    // Ball collision with player paddle
    if (
        ball.x - BALL_RADIUS < PLAYER_X + PADDLE_WIDTH &&
        ball.x - BALL_RADIUS > PLAYER_X &&
        ball.y > playerY &&
        ball.y < playerY + PADDLE_HEIGHT
    ) {
        ball.vx *= -1.06; // bounce and slightly increase speed
        ball.x = PLAYER_X + PADDLE_WIDTH + BALL_RADIUS;
        // Add some spin based on collision point
        let hitPoint = (ball.y - (playerY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
        ball.vy += hitPoint * 3;
    }

    // Ball collision with AI paddle
    if (
        ball.x + BALL_RADIUS > AI_X &&
        ball.x + BALL_RADIUS < AI_X + PADDLE_WIDTH &&
        ball.y > aiY &&
        ball.y < aiY + PADDLE_HEIGHT
    ) {
        ball.vx *= -1.06; // bounce and slightly increase speed
        ball.x = AI_X - BALL_RADIUS;
        // Add some spin based on collision point
        let hitPoint = (ball.y - (aiY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
        ball.vy += hitPoint * 3;
    }

    // Ball out of bounds: reset
    if (ball.x < 0 || ball.x > canvas.width) {
        // Reset ball to center, randomize direction
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.vx = 5 * (Math.random() > 0.5 ? 1 : -1);
        ball.vy = 4 * (Math.random() > 0.5 ? 1 : -1);
    }

    // AI movement (simple: follow ball)
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (aiCenter < ball.y - 10) {
        aiY += AI_SPEED;
    } else if (aiCenter > ball.y + 10) {
        aiY -= AI_SPEED;
    }
    // Clamp AI paddle within canvas
    if (aiY < 0) aiY = 0;
    if (aiY > canvas.height - PADDLE_HEIGHT) aiY = canvas.height - PADDLE_HEIGHT;
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();