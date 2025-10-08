const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Pist
const roadWidth = 200;
const roadX = (canvas.width - roadWidth) / 2;

// Araba objesi
const car = {
  x: canvas.width / 2 - 15,
  y: canvas.height - 80,
  width: 30,
  height: 50,
  speed: 0,
  maxSpeed: 8,
  accel: 0.2,
  decel: 0.1
};

// Tur ve sayaç
let lapCount = 0;
let distance = 0;  // mesafe ilerledikçe artar

// Spiker sesi konuşma fonksiyonu
function speak(text) {
  if (!window.speechSynthesis) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'tr-TR';
  // Ses tonu ve hızı ayarlayabilirsin:
  utter.rate = 1.0;
  utter.pitch = 1.0;
  window.speechSynthesis.speak(utter);
}

// Çizim fonksiyonları
function drawRoad() {
  ctx.fillStyle = "#555";
  ctx.fillRect(roadX, 0, roadWidth, canvas.height);
  // yol çizgisi ortada
  ctx.fillStyle = "#fff";
  const stripeW = 4, stripeH = 20;
  for (let y = - (distance % (stripeH * 2)); y < canvas.height; y += stripeH * 2) {
    ctx.fillRect(canvas.width/2 - stripeW/2, y, stripeW, stripeH);
  }
}

function drawCar() {
  ctx.fillStyle = "red";
  ctx.fillRect(car.x, car.y, car.width, car.height);
}

// Güncelleme
function update() {
  // Mesafe artır
  distance += car.speed;

  // Tur tamamlanma kontrolü (basit: mesafe belirli değeri geçince)
  if (distance > 2000 * (lapCount + 1)) {
    lapCount++;
    speak(`Tur ${lapCount} tamamlandı`);
  }

  // Hızı yavaşlat (friction)
  if (car.speed > 0) {
    car.speed -= car.decel;
    if (car.speed < 0) car.speed = 0;
  }

  // Sınır kontrol – arabayı yol sınırları içinde tut
  if (car.x < roadX) car.x = roadX;
  if (car.x + car.width > roadX + roadWidth) car.x = roadX + roadWidth - car.width;
}

// Tuş hareketi
function moveCar(e) {
  if (e.key === "ArrowLeft") {
    car.x -= 5;
  } else if (e.key === "ArrowRight") {
    car.x += 5;
  } else if (e.key === "ArrowUp") {
    // hız artır
    car.speed += car.accel;
    if (car.speed > car.maxSpeed) {
      car.speed = car.maxSpeed;
      speak("Maksimum hız");
    } else {
      speak("Hızlanıyor");
    }
  } else if (e.key === "ArrowDown") {
    // fren (hız düşür)
    car.speed -= car.accel * 2;
    if (car.speed < 0) car.speed = 0;
    speak("Yavaşlıyorsun");
  }
}

document.addEventListener("keydown", moveCar);

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRoad();
  drawCar();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Başlangıç konuşması
speak("Yarış başlıyor!");

gameLoop();
