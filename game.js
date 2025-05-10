window.onload = function () {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const restartButton = document.getElementById("restartButton");

  const laneCount = 4;
  const laneWidth = canvas.width / laneCount;
  const ground = 300;
  const obstacleSpeed = 6;

  let score = 0;
  let gameOver = false;
  let backgroundX = 0;

  const background = new Image();
  background.src = "background.jpg";

  const geekbarImage = new Image();
  geekbarImage.src = "geekbar.png";

  const player = {
    lane: 1,
    x: 0,
    y: ground,
    width: 30,
    height: 80,
    jumping: false,
    yVelocity: 0,
    gravity: 1.5,
    jumpForce: -20,
    updateX() {
      this.x = laneWidth * this.lane + laneWidth / 2 - this.width / 2;
    }
  };
  player.updateX();

  let obstacles = [];

  function spawnObstacle() {
    const lane = Math.floor(Math.random() * laneCount);
    const x = canvas.width + 50;
    const y = ground + 30;
    obstacles.push({
      lane,
      x: laneWidth * lane + laneWidth / 2 - 25,
      y,
      width: 50,
      height: 50
    });
  }

  function resetGame() {
    score = 0;
    gameOver = false;
    obstacles = [];
    player.lane = 1;
    player.y = ground;
    player.yVelocity = 0;
    player.updateX();
    restartButton.style.display = "none";
    gameLoop();
  }

  function updateGame() {
    if (gameOver) return;

    player.yVelocity += player.gravity;
    player.y += player.yVelocity;
    if (player.y > ground) {
      player.y = ground;
      player.jumping = false;
    }

    for (let obs of obstacles) {
      obs.x -= obstacleSpeed;
    }

    obstacles = obstacles.filter(obs => obs.x + obs.width > 0);

    for (let obs of obstacles) {
      if (
        obs.lane === player.lane &&
        player.y + player.height > obs.y &&
        player.y < obs.y + obs.height &&
        obs.x < player.x + player.width &&
        obs.x + obs.width > player.x
      ) {
        gameOver = true;
        restartButton.style.display = "block";
        return;
      }
    }

    score++;
    backgroundX -= 1;
    if (backgroundX <= -canvas.width) {
      backgroundX = 0;
    }
  }

  function drawPlayer() {
    ctx.drawImage(geekbarImage, player.x, player.y, player.width, player.height);
  }

  function drawObstacles() {
    ctx.fillStyle = "green";
    for (let obs of obstacles) {
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    }
  }

  function drawLanes() {
    ctx.strokeStyle = "#ffffff33";
    for (let i = 1; i < laneCount; i++) {
      const x = i * laneWidth;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
  }

  function drawScore() {
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);
  }

  function drawBackground() {
    ctx.drawImage(background, backgroundX, 0, canvas.width, canvas.height);
    ctx.drawImage(background, backgroundX + canvas.width, 0, canvas.width, canvas.height);
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawLanes();
    drawPlayer();
    drawObstacles();
    drawScore();
  }

  function gameLoop() {
    updateGame();
    render();
    if (!gameOver) {
      requestAnimationFrame(gameLoop);
    }
  }

  document.addEventListener("keydown", (e) => {
    if ((e.code === "Space" || e.code === "ArrowUp") && !player.jumping) {
      player.yVelocity = player.jumpForce;
      player.jumping = true;
    } else if (e.code === "ArrowLeft" && player.lane > 0) {
      player.lane--;
      player.updateX();
    } else if (e.code === "ArrowRight" && player.lane < laneCount - 1) {
      player.lane++;
      player.updateX();
    }
  });

  restartButton.addEventListener("click", resetGame);

  setInterval(spawnObstacle, 2000);
  gameLoop();
};
