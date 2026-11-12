const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const info = document.getElementById("info");   // 5_stage.html の <p id="info">

let x = 100;          // 丸の中心の位置
let y = 80;
let vx = 180;         // 横の速さ（1秒に180px）
let vy = 140;         // 縦の速さ（1秒に140px。＋ は下へ）
let r = 14;           // ★半径を変えるために const から let に変更
let color = "#ffd166"; // ★ボールの色（最初は黄色）
let last = performance.now();

// ★ランダムな色を作る関数
function randomColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 85%, 65%)`;
}

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowUp") {
    vx = vx * 1.2;   // 速さを1.2倍（向きはそのまま）
    vy = vy * 1.2;
  }
  if (e.code === "ArrowDown") {
    vx = vx * 0.8;
    vy = vy * 0.8;
  }
  if (e.code === "ArrowLeft") {
    r = Math.max(5, r - 5);
  }
  if (e.code === "ArrowRight") {
    r = r + 5;
  }
  if (e.code === "KeyC") {
    color = randomColor(); // ★Cキーでも色が変わるように追加（3つ以上の条件クリア用）
  }
});

function update(dt) {
  x = x + vx * dt;
  y = y + vy * dt;

  // 左右の壁（丸は x が中心なので、半径 r を足し引きする）
  if (x + r > canvas.width) {
    x = canvas.width - r;
    vx = -vx;
    color = randomColor(); // ★右の壁で色を変える
  }
  if (x - r < 0) {
    x = r;
    vx = -vx;
    color = randomColor(); // ★左の壁で色を変える
  }
  // 上下の壁
  if (y + r > canvas.height) {
    y = canvas.height - r;
    vy = -vy;
    color = randomColor(); // ★下の壁で色を変える
  }
  if (y - r < 0) {
    y = r;
    vy = -vy;
    color = randomColor(); // ★上の壁で色を変える
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = color; // ★固定の "#ffd166" から変数 color に変更
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

// now：今回呼ばれた時刻（ミリ秒）。requestAnimationFrame が引数で渡してくれる
function loop(now) {
  const dt = (now - last) / 1000;   // 前回からの時間（秒）
  last = now;                       // 今回の時刻を、次の「前回」として覚えておく

  info.textContent = "dt：" + dt.toFixed(4) + " 秒　／　1秒に約 " + (1 / dt).toFixed(0) + " 回";

  update(dt);
  draw();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
