const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
// Crea un nuevo objeto Audio
var audio = new Audio('aud/audio5.mp3');

let cards;
let interval;
let firstCard = false;
let secondCard = false;


//Items array
const items = [
  { name: "ghost", image: "./img/ghost.png" },
  { name: "daruma", image: "./img/daruma.png" },
  { name: "hannya", image: "./img/hannya.png" },
  { name: "maneki-neko", image: "./img/maneki-neko.png" },
  { name: "geisha", image: "./img/geisha.png" },
  { name: "pagoda", image: "./img/pagoda.png" },
  { name: "bamboo", image: "./img/bamboo.png" },
  { name: "origami", image: "./img/origami.png" },
  { name: "koinobori", image: "./img/koinobori.png" },
  { name: "yen", image: "./img/yen.png" },
  { name: "lantern", image: "./img/lantern.png" },
  { name: "bonsai", image: "./img/bonsai.png" },
];

//Timpo Inicial
let seconds = 0,
  minutes = 0;
//Movimientos Iniciales y recuento de victorias
let movesCount = 0,
  winCount = 0;

//Para el tiempo
const timeGenerator = () => {
  seconds += 1;
  //Logica de minutos
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  //Formato de tiempo antes de mostrar
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Tiempo:</span>${minutesValue}:${secondsValue}`;

  // Reproduce la música en bucle
  audio.loop = true;
  audio.play();
};

//Para calcular los movimientos
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Movimientos:</span>${movesCount}`;
};

//Elija objetos aleatorios de la matriz de elementos
const generateRandom = (size = 4) => {
  //matriz temporal
  let tempArray = [...items];
  //inicializa la matriz cardValues
  let cardValues = [];
  //el tamaño debe ser el doble (matriz 4*4)/2 ya que existirían pares de objetos
  size = (size * size) / 2;
  //Selección aleatoria de objetos
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    //una vez seleccionado, elimine el objeto de la matriz temporal
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  //reproducción aleatoria sencilla
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < size * size; i++) {
    /*
        Crear tarjetas
         before => anverso (contiene signo de interrogación)
         after => reverso (contiene imagen real);
         data-card-values es un atributo personalizado que almacena los nombres de las tarjetas para que coincidan más tarde
      */
    gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
        <img src="${cardValues[i].image}" class="image"/></div>
     </div>
     `;
  }
  //Red
  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

  //Tarjetas
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      //Si la tarjeta seleccionada aún no coincide, solo ejecute (es decir, la tarjeta que ya coincidió cuando se hizo clic se ignoraría)
      if (!card.classList.contains("matched")) {
        //voltear la tarjeta clicada
        card.classList.add("flipped");
        //si es la primera carta (!primeraCarta ya que primeraCarta es inicialmente falso)
        if (!firstCard) {
          //entonces la tarjeta actual se convertirá en firstCard
          firstCard = card;
          //el valor actual de las tarjetas se convierte en firstCardValue
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          //incrementa los movimientos desde que el usuario seleccionó la segunda carta
          movesCounter();
          //segunda tarjeta y valor
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            //si ambas tarjetas coinciden, agregue la clase correspondiente para que estas tarjetas se ignoren la próxima vez
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            //establezca firstCard en falso ya que la próxima tarjeta sería la primera ahora
            firstCard = false;
            //incremento de winCount cuando el usuario encontró una coincidencia correcta
            winCount += 1;
            //compruebe si winCount == la mitad de cardValues
            if (winCount == Math.floor(cardValues.length / 2)) {
              result.innerHTML = `<h2>Haz Ganado</h2>
            <h4>Movimientos: ${movesCount}</h4>`;
              stopGame();
            }
          } else {
            //si las cartas no coinciden
            //Voltea las cartas a la normalidad
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};

//Empezar juego
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  //visibilidad de controles y botones
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  //Temporizador de inicio
  interval = setInterval(timeGenerator, 1000);
  //movimientos iniciales
  moves.innerHTML = `<span>Movimientos:</span> ${movesCount}`;
  initializer();
});

//detener el juego
stopButton.addEventListener(
  "click",
  (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);

    // Detiene la música
    audio.pause();

  })

);

//Inicializar valores y llamadas a funciones
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};


// Selecciona el botón de ayuda por su ID
var btnAyuda = document.getElementById("btnAyuda");

// Agrega un evento de clic al botón de ayuda
btnAyuda.addEventListener("click", function() {
  // Muestra un mensaje de alerta con el texto de ayuda
  alert("Bienvenido al juego de memoria de cartas. Tu objetivo es encontrar todas las parejas de cartas iguales en el menor tiempo posible. Haz clic en dos cartas para voltearlas. Si las cartas son iguales, se quedaran boca arriba y podras continuar buscando mas parejas. Si las cartas no son iguales, se voltearan de nuevo y tendras que seguir buscando. Buena suerte y diviertete");
});

// Crea un nuevo objeto Audio
var audio = new Audio('aud/audio5.mp3');

// Reproduce la música en bucle
//audio.loop = true;
//audio.play();

// Detiene la música
//audio.pause();
