// Variáveis Bola
let ballX = 400;  
let ballY = 200;
let ballDiameter = 30;
let ballRadius = ballDiameter / 2;
let collided = false;
let ballImage;
let angle = 0;

let ballStartingVelocity = 4;

let ballVelocityX = ballStartingVelocity;
let ballVelocityY = ballStartingVelocity;

// Variáveis do Jogo
let multiplayer = false; 
let botaoReiniciar;

// Variáveis do Jogador
let playerX = 25;
let playerY = 150;
let barWidth = 27;
let barHeight = 40;
let playerBarImage;

// Variáveis do Oponente
let opponentX = 761;  
let opponentY = 150;
let opponentBarImage;

// Velocidade para ambos os jogadores
let barVelocity = 6;

// Pontos
let playerScore = 0;
let opponentScore = 0;
let fonteTexto;

// Sons
let BateBola;
let Apito;
let MusicaFundo;

// Definir as variáveis para as barras
let barThickness = 5;
let barTopY = 50;
let barBottomY = 445;

// Variável para verificar se o jogo iniciou
let iniciouJogo = false;

// Variáveis para imagem
let telaInicial;
let winPlayer1, winPlayer2;

function preload() {
  BateBola = loadSound("assets/Sounds/BateBola.mp3");
  Apito = loadSound("assets/Sounds/ponto.mp3");
  MusicaFundo = loadSound("assets/Sounds/trilha.mp3");
  fonteTexto = loadFont("assets/Fonts/BebasNeue-Regular.ttf");
  telaInicial = loadImage("assets/images/telaInicial.jpg");  // Carregar a imagem de tela inicial
  ballImage = loadImage("assets/images/ball.png");
  playerBarImage = loadImage("assets/images/Player1.png");
  opponentBarImage = loadImage("assets/images/Player2.png");
  winPlayer1 = loadImage("assets/images/winPlayer1.jpg");
  winPlayer2 = loadImage("assets/images/winPlayer2.jpg");
}

function setup() {
  createCanvas(800, 450);

  // Criar o contêiner para os botões
  let botoesContainer = createDiv();
  botoesContainer.addClass('botoes-container');

  // Botão para iniciar o jogo
  let botaoIniciar = createButton('Iniciar Jogo');
  botaoIniciar.addClass('botao');
  botoesContainer.child(botaoIniciar);

  // Botão para iniciar em modo multiplayer
  let botaoMultiplayer = createButton('Modo Multiplayer');
  botaoMultiplayer.addClass('botao');
  botoesContainer.child(botaoMultiplayer);

 
  botaoIniciar.mousePressed(() => {
    startAudioContext(); // Agora usando o novo nome da função
    iniciarJogo(false); // Inicia o jogo no modo de um jogador
  });
  
  botaoMultiplayer.mousePressed(() => {
    startAudioContext(); // Agora usando o novo nome da função
    iniciarJogo(true); // Inicia o jogo no modo multiplayer
  });


  botaoReiniciar = createButton('Reiniciar Jogo');
  botaoReiniciar.addClass('botao'); // Aplicando a classe de botão CSS
  botoesContainer.child(botaoReiniciar); // Adiciona o botão ao contêiner
  
  // Configurar ação do botão de reiniciar
  botaoReiniciar.mousePressed(() => {
    reiniciarJogo(); // Chama a função para reiniciar o jogo
  });
  
  // Esconde o botão de reiniciar inicialmente
  botaoReiniciar.hide();
}

function draw() {
  background(0);

  // Desenhar a tela inicial se o jogo não iniciou
  if (!iniciouJogo) {
    image(telaInicial, 0, 0, width, height); // Desenha a imagem de tela inicial
    fill(255);
    textAlign(CENTER, CENTER);
    textFont(fonteTexto);
    textSize(32);
    text("Clique em um botão para iniciar", width / 2, height - 50);
    return;
  }

  // Desenhar os elementos do jogo
  drawGameElements();
}

function startAudioContext() {
  // Ativa o contexto de áudio após interação do usuário
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
}


function iniciarJogo(modoMultiplayer) {
  // Garante que o áudio só seja ativado após interação do usuário
  startAudioContext(); 

  if (!MusicaFundo.isPlaying()) {
    MusicaFundo.loop(); // Começa a música de fundo
  }

  iniciouJogo = true; // Marca que o jogo começou
  multiplayer = modoMultiplayer; // Define o modo de jogo
  
  console.log("Jogo iniciado. Modo multiplayer:", multiplayer);
  botaoReiniciar.show(); // Mostra o botão de reiniciar
}

function reiniciarJogo() {
  playerScore = 0;
  opponentScore = 0;
  ballX = 400;
  ballY = 200;
  ballVelocityX = ballStartingVelocity;
  ballVelocityY = ballStartingVelocity;
  botaoReiniciar.hide(); // Esconde o botão de reiniciar após o reinício do jogo
  iniciouJogo = false; // Volta para a tela inicial
}
// Função para desenhar os elementos do jogo
function drawGameElements() {
  // Desenhar as áreas de fundo coloridas para o placar
  fill(246, 33, 68);
  rect(0, 0, 400, barTopY);

  fill(36, 204, 216);
  rect(400, 0, 400, barTopY);

  fill(255, 165, 0);
  rect(0, barTopY, 800, barBottomY - barTopY);

  // Desenhar a barra separadora no meio
  fill(255);
  rect(400 - 2, 0, 4, height);

  // Desenhar as barras superior e inferior
  fill(255);
  rect(0, barTopY, 800, barThickness);
  rect(0, barBottomY, 800, barThickness);

  // Desenhar a linha central pontilhada
  drawDashedLine(400, barTopY, 400, barBottomY);

  // Desenhar a área do campo de futebol
  fill(255, 255, 255, 50);
  rect(300, barTopY, 200, barBottomY - barTopY);

  // Mostrar a bola e outras interações
  showBall();
  moveBall();

  detectCollisionBorder();

  showBar(playerX, playerY, playerBarImage);
  showBar(opponentX, opponentY, opponentBarImage);

  movePlayer();
  moveOpponent();

  collideCheckLibrary(playerX, playerY);
  collideCheckLibrary(opponentX, opponentY);

  showScore();
  addScore();
}


// Funções do Jogador
function movePlayer() {
  if (keyIsDown(87) && playerY > barTopY + barThickness) {  // Mover para cima
    playerY -= barVelocity;
  }
  if (keyIsDown(83) && playerY + barHeight < barBottomY) {  // Mover para baixo
    playerY += barVelocity;
  }
}

function moveOpponent() {
  // Se controlado por outro jogador
  if (multiplayer) {
    if (keyIsDown(UP_ARROW) && opponentY > barTopY + barThickness) {  // Mover para cima
      opponentY -= barVelocity;
    }
    if (keyIsDown(DOWN_ARROW) && opponentY + barHeight < barBottomY) {  // Mover para baixo
      opponentY += barVelocity;
    }
  }
  // IA do Oponente
  else {
    // Se a bola passar de 60% da tela, mover-se até ela
    if (ballX > width * 0.6) {
      let moveAmount = ballVelocityY > 0 ? 1 : -1;  // Movimento para baixo ou para cima
      if (opponentY + (barHeight / 2) > ballY) {
        opponentY -= barVelocity * 0.9; // IA se move com 90% da velocidade do Jogador
      } else if (opponentY + barHeight < barBottomY) {
        opponentY += barVelocity * 0.9;
      }
    }
  }
}


function showBar(x, y, barImage) {
  // Desenha a imagem no lugar da barra
  image(barImage, x, y, 27, 40);  // Substitui 31x50 pela largura e altura da imagem
}

function reiniciarJogo() {
  // Zera as pontuações
  playerScore = 0;
  opponentScore = 0;
  
  // Reseta a posição da bola
  resetBall();
  
  // Reinicia o jogo
  iniciouJogo = false;
  botaoReiniciar.hide(); // Esconde o botão de reiniciar
  loop(); // Faz o jogo continuar (caso tenha sido pausado)
}


// Funções do Placar
function showScore() {
  textAlign(CENTER);
  textSize(30);
  fill(255);
  textFont(fonteTexto);
  
  

   // Exibir o placar com rótulos de Player 1 e Player 2
   text("Player 1 : " + playerScore, 200, 30);  // Placar do jogador 1
   text("Player 2 : " + opponentScore, 600, 30);  // Placar do jogador 2
}


function addScore() {
  // Se a bola ultrapassar a borda direita (790)
  if (ballX + ballRadius > width) {
    playerScore += 1;  // Incrementa o ponto para o jogador
    Apito.play();  // Toca o som
    resetBall();  // Reseta a posição da bola
  }
  
  // Se a bola ultrapassar a borda esquerda (10)
  if (ballX - ballRadius < 0) {
    opponentScore += 1;  // Incrementa o ponto para o oponente
    Apito.play();  // Toca o som
    resetBall();  // Reseta a posição da bola
  }

  // Verificar se algum jogador atingiu 5 pontos
  if (playerScore >= 5) {
    // Exibir que o Jogador 1 venceu
    gameOver("Player 1");
  } else if (opponentScore >= 5) {
    // Exibir que o Jogador 2 venceu
    gameOver("Player 2");
  }
}

// Função para exibir a tela de fim de jogo
function gameOver(winner) {
  // Parar o jogo
  noLoop();  // Impede que o jogo continue rodando

  // Verificar o vencedor e escolher a imagem do fundo
  if (winner === "Player 1") {
    image(winPlayer1, 0, 0, width, height); // Exibe a imagem de fundo para o Player 1
  } else if (winner === "Player 2") {
    image(winPlayer2, 0, 0, width, height); // Exibe a imagem de fundo para o Player 2
  }

  // Exibir a mensagem de vencedor
  fill(0);
  textAlign(CENTER, CENTER);
  textFont(fonteTexto);
  textSize(48);
  text(winner + " Venceu!", width / 2, height / 2);

  // Exibir a pontuação final
  textSize(32);
  text("Final: Player 1: " + playerScore + " - Player 2: " + opponentScore, width / 2, height / 2 + 50);

  // Mostrar o botão de reiniciar
  botaoReiniciar.show();
}



function collideCheckLibrary(x, y) {
  // Verifica a colisão entre a bola e a barra
  collided = collideRectCircle(x, y, barWidth, barHeight, ballX, ballY, ballRadius);

  if (collided) {
    // Determina a parte da barra onde a bola colidiu
    let barCenterY = y + barHeight / 2;
    let distanceFromCenter = ballY - barCenterY;

    // Lógica de movimentação e reversão de direção da bola
    if (ballVelocityX < 0) {
      // Jogador
      handlePlayerCollision(y, distanceFromCenter);
    } else {
      // Oponente
      handleOpponentCollision(y, distanceFromCenter);
    }

    // Reflete a direção horizontal da bola
    ballVelocityX *= -1;

    // Aumenta a velocidade da bola após a colisão
    increaseSpeed();

    // Reproduz o som da colisão
    BateBola.play();
  }
}

function handlePlayerCollision(y, distanceFromCenter) {
  // Se o jogador estiver pressionando as teclas W ou S, não invertemos o Y da bola
  if (!(keyIsDown(87) || keyIsDown(83))) { // Se não estiver pressionando W ou S
    if (ballVelocityY > 0) { // Jogador movendo-se para cima
      ballVelocityY *= -1;
      ballY = Math.max(y + barHeight + ballRadius, ballY); // Evitar atravessar a barra
    }
    if (ballVelocityY < 0) { // Jogador movendo-se para baixo
      ballVelocityY *= -1;
      ballY = Math.min(y - ballRadius, ballY); // Evitar atravessar a barra
    }
  }

  // Ajusta a posição e a velocidade da bola de acordo com a parte da barra atingida
  adjustBallVelocity(distanceFromCenter);
}

function handleOpponentCollision(y, distanceFromCenter) {
  if (keyIsDown(UP_ARROW) && ballVelocityY > 0) { // Oponente movendo-se para cima
    ballVelocityY *= -1;
    ballY = Math.max(y + barHeight + ballRadius, ballY); // Evitar atravessar a barra
  }
  if (keyIsDown(DOWN_ARROW) && ballVelocityY < 0) { // Oponente movendo-se para baixo
    ballVelocityY *= -1;
    ballY = Math.min(y - ballRadius, ballY); // Evitar atravessar a barra
  }

  // Ajusta a posição e a velocidade da bola de acordo com a parte da barra atingida
  adjustBallVelocity(distanceFromCenter);
}

function adjustBallVelocity(distanceFromCenter) {
  // Se a bola colidir no centro da barra, não modifica muito a velocidade vertical
  if (Math.abs(distanceFromCenter) < barHeight / 4) {
    ballVelocityY *= 1; // Não altera a direção vertical
  } 
  else if (distanceFromCenter < 0) { 
    // Se a bola colidir com a parte superior da barra
    ballVelocityY += 0.2 * Math.abs(distanceFromCenter); // Ajuste suave para a colisão superior
  } 
  else {
    // Se a bola colidir com a parte inferior da barra
    ballVelocityY -= 0.2 * Math.abs(distanceFromCenter); // Ajuste suave para a colisão inferior
  }

  // Evita que a velocidade vertical fique muito baixa
  if (Math.abs(ballVelocityY) < 3) {
    ballVelocityY = 3 * Math.sign(ballVelocityY); // Define uma velocidade mínima
  }

  // Controle para não deixar a bola perder a física realista
  if (Math.abs(ballVelocityY) > 12) {
    ballVelocityY = 12 * Math.sign(ballVelocityY); // Limita a velocidade máxima
  }
}

function adjustBallPositionBasedOnDirection() {
  // Verifica se a bola está vindo do lado inferior do jogador
  if (ballVelocityY < 0 && ballY > barHeight + ballRadius) {
    // Ajusta a posição da bola para evitar atravessar a barra
    ballY = barHeight + ballRadius;
  }
}

function showBall() {
  // Desenhe o círculo com o tamanho original
  fill(255);  
  circle(ballX, ballY, ballDiameter);

  // Calcule a posição para alinhar a imagem no centro do círculo
  let imgX = ballX - ballDiameter / 2;
  let imgY = ballY - ballDiameter / 2;
  let imgSize = ballDiameter; // O tamanho da imagem será o mesmo da bola
  
  // Salve o estado de transformação
  push();
  
  // Translade o sistema de coordenadas para o centro da bola
  translate(ballX, ballY);
  
  // Aplique a rotação proporcional à velocidade da bola
  rotate(angle);
  
  // Desenhe a imagem da bola (a rotação ocorre ao redor do centro)
  image(ballImage, -imgSize / 2, -imgSize / 2, imgSize, imgSize);
  
  // Restaure o estado de transformação
  pop();
  
  // Atualize o ângulo para a próxima rotação, baseado na velocidade da bola
  angle += ballStartingVelocity * 0.05; // A rotação aumenta com a velocidade
}

function moveBall() {
  ballX += ballVelocityX;
  ballY += ballVelocityY;
}

// Incrementar a velocidade da bola em 0.5 a cada rebatida, limitando de -9 até 9
function increaseSpeed() {
  if (ballVelocityX > -9 && ballVelocityX < 9) {
    ballVelocityX += 0.5 * Math.sign(ballVelocityX);
    ballVelocityY += 0.5 * Math.sign(ballVelocityY);
  }
}

// Voltar a bola para a posição inicial, e na direção do jogador que marcou ponto
function resetBall() {
  ballX = 400;  // Novo centro
  ballY = 200;
  ballVelocityX = ballStartingVelocity * (Math.random() < 0.5 ? 1 : -1); // Aleatório para dar mais imprevisibilidade
  ballVelocityY = ballStartingVelocity * (Math.random() < 0.5 ? 1 : -1);
}
function detectCollisionBorder() {
  // Colisão com as bordas laterais do canvas
  if (ballX + ballRadius > width || ballX - ballRadius < 0) {
    ballVelocityX *= -1;  // Inverte a direção horizontal da bola
  }

  // Colisão com a barra superior
  if (ballY - ballRadius < barTopY + barThickness && ballVelocityY < 0) {
    ballVelocityY *= -1;  // Inverte a direção vertical da bola
    ballY = barTopY + barThickness + ballRadius;  // Garante que a bola não passe pela barra
  }

  // Colisão com a barra inferior
  if (ballY + ballRadius > barBottomY - barThickness && ballVelocityY > 0) {
    ballVelocityY *= -1;  // Inverte a direção vertical da bola
    ballY = barBottomY - ballRadius;  // Garante que a bola não passe pela barra
  }
}

// Função para desenhar a linha pontilhada
function drawDashedLine(x1, y1, x2, y2) {
  let dashLength = 10;  // Tamanho do "traço" da linha pontilhada
  let gapLength = 5;    // Tamanho do "espaço" entre os traços
  let distance = dist(x1, y1, x2, y2);  // Distância total entre os pontos

  let dashCount = floor(distance / (dashLength + gapLength));  // Número de traços

  for (let i = 0; i < dashCount; i++) {
    let xStart = lerp(x1, x2, i / dashCount);
    let yStart = lerp(y1, y2, i / dashCount);
    let xEnd = lerp(x1, x2, (i + 0.5) / dashCount);
    let yEnd = lerp(y1, y2, (i + 0.5) / dashCount);

    line(xStart, yStart, xEnd, yEnd);  // Desenha cada traço da linha
  }
}
