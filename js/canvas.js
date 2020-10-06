let x, y, size;
let tickInterval;
let tickId;
let canv, ctx, dims;
let ccolor, bgcolor;
let pointsc, pointsElm;

const VMIN = -100,
  VMAX = 100;
const SMIN = 10,
  SMAX = 30;

window.addEventListener("load", () => {
  initVals();
  targetFunc();
});

const initVals = () => {
  xv = 1;
  yv = 1;
  size = SMIN;
  tickInterval = 1000;
  pointsc = 0;
  ccolor = "#2ed6c5";
  bgcolor = "#ffffff";
  canv = document.getElementById("canv");
  pointsElm = document.getElementById("cc");
  ctx = canv.getContext("2d");

  dims = canv.getBoundingClientRect();
  x = dims.width / 2 - size / 2;
  y = dims.height / 2 - size / 2;

  let storadeColor = localStorage.getItem("ccolor");
  if (storadeColor) {
    ccolor = storadeColor;
  }
  document.getElementById("colorDialog").value = ccolor;
};

const intervalStart = () => {
  intervalStop();
  tickId = setInterval(() => {
    targetFunc();
  }, tickInterval);
};

const intervalStop = () => {
  clearInterval(tickId);
  tickId = undefined;
  pointsc = 0;
};

const targetFunc = () => {
  x += getRndInteger(VMIN, VMAX);
  y += getRndInteger(VMIN, VMAX);
  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (x > dims.width) x = dims.width / 2 - size / 2;
  if (y > dims.height) y = dims.height / 2 - size / 2;
  size += getRndInteger(-2, 2);
  if (size < SMIN) size = SMIN;
  if (size > SMAX) size = SMAX;
  drawShape();
};

const hitAnimation = async () => {
  await drawPromise("#ff0000");
  await drawPromise("#ffffff");
  await drawPromise("#ff0000");
  await drawPromise("#ffffff");
};

const drawPromise = (color) => {
  return new Promise((ok, not) => {
    setTimeout(() => {
      bgcolor = color;
      drawShape();
      ok(true);
    }, 30);
  });
};

const drawShape = () => {
  ctx.fillStyle = bgcolor;
  ctx.fillRect(0, 0, canv.width, canv.height);
  // bgcolor
  ctx.beginPath();
  ctx.arc(x, y, size, 0, 2 * Math.PI, false);
  ctx.fillStyle = ccolor;
  ctx.fill();
};

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pointInCircle(_x, _y, _cx, _cy, _radius) {
  var _distancesquared = (_x - _cx) * (_x - _cx) + (_y - _cy) * (_y - _cy);
  return _distancesquared <= _radius * _radius;
}

const handleColorChange = (e) => {
  setColorAndStore(e.target.value);
};

const setColorAndStore = (color) => {
  ccolor = color;
  localStorage.setItem("ccolor", ccolor);
};

const handleCanvasMouseClick = (e) => {
  if (!tickId) return;
  const pos = e.target.getBoundingClientRect();
  if (pointInCircle(x, y, e.clientX - pos.left, e.clientY - pos.top, size)) {
    pointsc++;
    pointsElm.innerText = pointsc;
    hitAnimation();
  }
};

const handleSpeedChange = (e) => {
  if (!e.target.value) return;
  tickInterval = e.target.value;
  intervalStart();
};
