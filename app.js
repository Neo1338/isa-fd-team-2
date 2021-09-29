// затягиваем аудио
let audioEl = document.querySelector(".audio");
const app = document.querySelector(".app");

//функция воспроизведения
function audioPlay() {
  if (audioEl.muted) {
    audioEl.muted = false;
    audioEl.play();
  } else {
    audioEl.muted = true;
    audioEl.pause();
  }
}

// Screens
window.application.screens["login-screen"] = renderLoginScreen;
window.application.screens["startGame-screen"] = renderStartGameScreen;
window.application.screens["lobby-screen"] = renderLobbyScreen;
window.application.screens["win-screen"] = renderWinScreen;
window.application.screens["fail-screen"] = renderFailScreen;

// Elements
window.application.blocks["login-block"] = renderLoginBlock;
window.application.blocks["startGame-block"] = renderStartGameBlock;
window.application.blocks["win-block"] = renderWinBlock;
window.application.blocks["fail-block"] = renderFailBlock;
window.application.blocks["lobby-block"] = renderLobbyBlock;

window.application.blocks["login-button"] = renderLoginButton;
window.application.blocks["startGame-button"] = renderStartGameButton;
window.application.blocks["lobby-button"] = renderLobbyButton;
window.application.blocks["play-button"] = renderPlayButton;

//Вызов
window.application.renderScreen("startGame-screen");

/* ********* БЛОК ЭКРАНА СТАРТА ********* */
function renderStartGameBlock(container) {
  const startGameTitle = document.createElement("h1");
  startGameTitle.textContent = "Камень-ножницы-бумага";
  startGameTitle.classList.add("startGame-title");

  const startGameParagraph = document.createElement("p");
  startGameParagraph.textContent = "Прописываем правила игры";
  startGameParagraph.classList.add("startGame-paragraph");

  container.appendChild(startGameTitle);
  container.appendChild(startGameParagraph);
}

function renderStartGameButton(container) {
  const startGameButton = document.createElement("button");
  startGameButton.textContent = "Я понял правила, давай уже играть!";
  startGameButton.classList.add("startGame-button");

  startGameButton.addEventListener("click", event => {
    request("/ping", "", function (data) {
      //прописать бекэнд
      if (data.status === "ok") {
        window.application.renderScreen("login-screen");
      } else {
        console.log("Проблемы с бекэндом"); //прописать стили и мб добавить блок при отсутствии соединения?
      }
    });
  });
  container.appendChild(startGameButton);
}

function renderStartGameScreen() {
  const app = document.querySelector(".app");
  app.textContent = "";

  const startGameScreen = document.createElement("div");
  startGameScreen.classList.add("startGame-screen");

  app.appendChild(startGameScreen);

  window.application.renderBlock("startGame-block", startGameScreen);
  window.application.renderBlock("startGame-button", startGameScreen);
}

/* ********* БЛОК ЭКРАНА РЕГИСТРАЦИИ ********* */

function renderLoginBlock(container) {
  const loginText = document.createElement("h1");
  loginText.textContent = "Введите логин";

  loginText.classList.add("login-title");

  container.appendChild(loginText);
}

function renderLoginButton(container) {
  const loginInput = document.createElement("input");
  loginInput.classList.add("login-input");

  const loginButton = document.createElement("button");
  loginButton.textContent = "Зарегистрировать/проверить игрока";
  loginButton.classList.add("play-button");

  loginButton.addEventListener("click", event => {
    if (loginInput.value !== "") {
      request("/login", loginInput.value, function (data) {
        //ставить setInterval пока не случится data.status === ok?
        if (data.status === "ok") {
          player.token = data.token;
          request("/player-status", { token: window.application.player.token }, function (element) {
            if (element["player-status"].status === "lobby") {
              //при сохранении добавляет пробел, может отразиться на работе
              window.application.renderScreen("lobby-screen");
            }
            if (element["player-status"].status === "game") {
              //при сохранении добавляет пробел, может отразиться на работе
              window.application.renderScreen("turn-screen");
            } else {
              console.log("Ошибка");
            }
          });
        }
      });
    } else {
      console.log("отсутствует логин"); //прописать стили и мб добавить блок при отсутствии логина?
    }
  });
  container.appendChild(loginInput);
  container.appendChild(loginButton);
}

function renderLoginScreen() {
  const app = document.querySelector(".app");
  app.textContent = "";

  const loginScreen = document.createElement("div");
  loginScreen.classList.add("login-screen");
  app.appendChild(loginScreen);

  const authBlock = document.createElement("div");
  authBlock.classList.add("authorization-block");
  loginScreen.appendChild(authBlock);

  window.application.renderBlock("login-block", authBlock);
  window.application.renderBlock("login-button", authBlock);
}

// Lobby block text
function renderLobbyBlock(container) {
  const winText = document.createElement("h1");
  const winBlockText = document.createElement("textarea");
  winText.textContent = "GAMER: Nick, Wins, Fails";
  winText.classList.add("win-title");
  winBlockText.classList.add("lobby-list");
  container.appendChild(winText);
  container.appendChild(winBlockText);
}

// Lobby Screen Fn ////////////////
function renderLobbyScreen() {
  app.textContent = "";
  const winScreen = document.createElement("div");
  winScreen.classList.add("lobby-screen");
  app.appendChild(winScreen);
  window.application.renderBlock("lobby-block", winScreen);
  //window.application.renderBlock("lobby-button", winScreen);
  window.application.renderBlock("play-button", winScreen);

  const replayButton = document.querySelector(".play-button");
  replayButton.textContent = "ИГРАТЬ";
}

function renderWinBlock(container) {
  const winText = document.createElement("h1");
  winText.textContent = "Вы победили!";

  winText.classList.add("result-title");

  container.appendChild(winText);
}

function renderFailBlock(container) {
  const failText = document.createElement("h1");
  failText.textContent = "Вы проиграли!";

  failText.classList.add("result-title");

  container.appendChild(failText);
}

function renderLobbyButton(container) {
  const lobbyButton = document.createElement("button");
  lobbyButton.textContent = "Перейти в лобби";

  lobbyButton.classList.add("lobby-button");

  lobbyButton.addEventListener("click", event => {
    window.application.renderScreen("lobby-screen");
  });

  container.appendChild(lobbyButton);
}

function renderPlayButton(container) {
  const playButton = document.createElement("button");
  playButton.textContent = "Играть!";

  playButton.classList.add("play-button");

  playButton.addEventListener("click", event => {
    request("/start", { token: window.application.player.token }, function (data) {
      if (data.status === "ok") {
        window.application.player.gameId = data["player-status"].game.id;
        window.application.renderScreen("waiting-enemy-screen");
      }
    });
    window.application.renderScreen("waiting-enemy-screen");
  });

  container.appendChild(playButton);
}

function renderResultImage(container, imagePath) {
  const image = document.createElement("img");
  image.setAttribute("src", imagePath);
  image.classList.add("result-image");
  container.appendChild(image);
}

function renderWinScreen() {
  const app = document.querySelector(".app");
  app.textContent = "";

  const winScreen = document.createElement("div");
  winScreen.classList.add("win-screen");

  app.appendChild(winScreen);

  renderResultImage(winScreen, "img/happy.png");

  window.application.renderBlock("win-block", winScreen);
  window.application.renderBlock("lobby-button", winScreen);
  window.application.renderBlock("play-button", winScreen);

  const replayButton = document.querySelector(".play-button");
  replayButton.textContent = "Играть еще!";
}

function renderFailScreen() {
  const app = document.querySelector(".app");
  app.textContent = "";

  const failScreen = document.createElement("div");
  failScreen.classList.add("fail-screen");

  app.appendChild(failScreen);

  renderResultImage(failScreen, "img/sad.png");

  window.application.renderBlock("fail-block", failScreen);
  window.application.renderBlock("lobby-button", failScreen);
  window.application.renderBlock("play-button", failScreen);

  const replayButton = document.querySelector(".play-button");
  replayButton.textContent = "Играть еще!";
}
