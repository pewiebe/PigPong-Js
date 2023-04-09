// Inicializa a tela

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var startBtn = document.getElementById("start-btn");
var pauseBtn = document.getElementById("pause-btn");
var restartBtn = document.getElementById("restart-btn");
var animationId;
var gameRunning = false;

startBtn.addEventListener("click", function() {
  if (!gameRunning) { // só inicie o jogo se gameRunning for falso
    gameRunning = true; // defina gameRunning como o jogo começar
    loop();
  }
});

pauseBtn.addEventListener("click", function() {
  gameRunning = false;
  cancelAnimationFrame(animationId);
});

restartBtn.addEventListener("click", function() {
  document.location.reload();
});

addEventListener("load", (event) => {
  draw();
});


// Define as propriedades da bola

var ballRadius = 10;
var ballX = canvas.width / 2;
var ballY = canvas.height / 2;
var ballSpeedX = 5;
var ballSpeedY = 5;

// propriedades da raquete
var paddleHeight = 80;
var paddleWidth = 10;
var leftPaddleY = canvas.height / 2 - paddleHeight / 2;
var rightPaddleY = canvas.height / 2 - paddleHeight / 2;
var paddleSpeed = 10;

// Definir propriedades de pontuação

var leftPlayerScore = 0;
var rightPlayerScore = 0;
var maxScore = 10;

// Eventos do teclado
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

// pressionamento da tecla
var upPressed = false;
var downPressed = false;
let wPressed = false;
let sPressed = false;

function keyDownHandler(e) {
  if (e.key === "ArrowUp") {
    upPressed = true;
  } else if (e.key === "ArrowDown") {
    downPressed = true;
  } else if (e.key === "w") {
    wPressed = true;
  } else if (e.key === "s") {
    sPressed = true;
  }
}

// liberação da tecla
function keyUpHandler(e) {
  if (e.key === "ArrowUp") {
    upPressed = false;
  } else if (e.key === "ArrowDown") {
    downPressed = false;
  } else if (e.key === "w") {
    wPressed = false;
  } else if (e.key === "s") {
    sPressed = false;
  }
}

// Atualiza o estado do jogo
function update() {

  // Move as raquetes
  if (upPressed && rightPaddleY > 0) {
    rightPaddleY -= paddleSpeed;
  } else if (downPressed && rightPaddleY + paddleHeight < canvas.height) {
    rightPaddleY += paddleSpeed;
  }

// Mova a raquete direita com base nas teclas "w" e "s"
  if (wPressed && leftPaddleY > 0) {
    leftPaddleY -= paddleSpeed;
  } else if (sPressed && leftPaddleY + paddleHeight < canvas.height) {
    leftPaddleY += paddleSpeed;
  }

  // Move a raquete direita automaticamente com base na posição da bola
  // if (ballY > rightPaddleY + paddleHeight / 2) {
  // rightPaddleY += paddleSpeed;
  // } else if (ballY < rightPaddleY + paddleHeight / 2) {
  // rightPaddleY -= paddleSpeed;
  // }

  // Moviemntar a bola
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Verifique se a bola colide com a parte superior ou inferior da tela
  if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

// Verifica se a bola colide com a raquete esquerda
  if (
    ballX - ballRadius < paddleWidth &&
    ballY > leftPaddleY &&
    ballY < leftPaddleY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
  }

  // Verifique se a bola colide com a raquete direita
  if (
    ballX + ballRadius > canvas.width - paddleWidth &&
    ballY > rightPaddleY &&
    ballY < rightPaddleY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
  }

  // Verifique se a bola sai de campo no lado esquerdo ou direito da tela
  if (ballX < 0) {
    rightPlayerScore++;
    reset();
  } else if (ballX > canvas.width) {
    leftPlayerScore++;
    reset();
  }

  // Verifique se um jogador ganhou
  if (leftPlayerScore === maxScore) {
    playerWin("Left player");
  } else if (rightPlayerScore === maxScore) {
    playerWin("Right player");
  }
}

function playerWin(player) {
  var message = "Congratulations! " + player + " win!";
  $('#message').text(message); // Definir o texto da mensagem
  $('#message-modal').modal('show'); // Exibe o modal da mensagem
  reset();
}

// Redefinir a bola para o centro da tela

function reset() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = -ballSpeedX;
  ballSpeedY = Math.random() * 10 - 5;
}

// Desenha objetos na tela
function draw() {
  // Limpar tela
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#FFF";
  ctx.font = "15px Arial";

  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.strokeStyle = "#FFF"; // Definir a cor da linha para branco
  ctx.stroke();
  ctx.closePath();

  // Desenha a bola

  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

    // Desenha a raquete esquerda
  ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);

  // Desenha a raquete direita
  ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);

  // Sorteio de pontuações
  ctx.fillText("Pontos: " + leftPlayerScore, 10, 20);
  ctx.fillText("Pontos: " + rightPlayerScore, canvas.width - 70, 20);
}

// Loop do jogo

function loop() {
  update();
  draw();
  animationId = requestAnimationFrame(loop);
}

$('#message-modal-close').on('click', function() {
  document.location.reload();
});