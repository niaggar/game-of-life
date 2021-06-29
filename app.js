
const $start        = document.querySelector('#start');
const $stop         = document.querySelector('#stop');
const $canvas       = document.querySelector('#canvas-game');
const ctx           = $canvas.getContext('2d');

const $settings     = document.querySelector('#game-change-config');
const $fps          = document.querySelector('#fps');
const $comeToLive   = document.querySelector('#num-neigh-life');
const $minToDie     = document.querySelector('#num-neigh-min-die');
const $maxToDie     = document.querySelector('#num-neigh-max-die');

const $btnSave      = document.querySelectorAll('#btn-save');
const $btnReset     = document.querySelector('#btn-reset');


$settings.addEventListener('submit', (e) => {
    e.preventDefault();

    fps = $fps.valueAsNumber;
    comeToLive = $comeToLive.valueAsNumber;
    minToDie = $minToDie.valueAsNumber;
    maxToDie = $maxToDie.valueAsNumber;

    console.log(fps, comeToLive, minToDie, maxToDie);

    $fps.value = '';
    $comeToLive.value = '';
    $minToDie.value = '';
    $maxToDie.value = '';
});

$settings.addEventListener('reset', (e) => {
    e.preventDefault();

    comeToLive = 3;
    minToDie = 2;
    maxToDie = 4;
    fps = 5;

    $fps.value = '';
    $comeToLive.value = '';
    $minToDie.value = '';
    $maxToDie.value = '';
});

let grid, comeToLive, minToDie, maxToDie, fps;

const WIDTH = 500,
      HEIGHT = 500;

const cellNW = 60,
      cellNH = 60;

const cellX = WIDTH / cellNW,
      cellY = HEIGHT / cellNH;


const calculateNewState = () => {
    let local = JSON.stringify(grid);
    let new_grid = JSON.parse(local);

    for (let x = 0; x < cellNW; x++) {
        for (let y = 0; y < cellNH; y++) {
            let neighbours = 0;
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    let xN = (x - i + cellNW) % cellNW;
                    let yN = (y - j + cellNH) % cellNH;

                    if (i !== 0 || j !== 0) neighbours += grid[xN][yN];
                }
            }

            // Game rules
            if (neighbours === comeToLive && grid[x][y] === 0)
                new_grid[x][y] = 1;
            if ((neighbours < minToDie || neighbours >= maxToDie) && grid[x][y] === 1)
                new_grid[x][y] = 0;
        }
    }

    local = JSON.stringify(new_grid);
    grid = JSON.parse(local);
}

const render = () => {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    for (let x = 0; x < cellNW; x++) {
        for (let y = 0; y < cellNH; y++) {
            if (grid[x][y] === 1) {
                ctx.fillStyle = '#000';
                ctx.fillRect(cellX * x, cellY * y, cellX, cellY);
            } else {
                ctx.strokeStyle = '#afafaf';
                ctx.strokeRect(cellX * x, cellY * y, cellX, cellY);
            }
        }
    }
}

const firstRender = () => {
    $canvas.width = WIDTH;
    $canvas.height = HEIGHT;

    grid = new Array(cellNW).fill(0)
        .map(() => new Array(cellNH).fill(0));

    render();
}

const drawOnCanvas = (e) => {
    const clientRect = $canvas.getBoundingClientRect();

    let x = e.clientX - clientRect.left;
    let y = e.clientY - clientRect.top;

    x = Math.floor(x / cellX);
    y = Math.floor(y / cellY);

    grid[x][y] = grid[x][y] === 1 ? 0 : 1;

    render();
}


// Events to draw on canvas
let mouse = false;
const evMouseDown = (e) => { mouse = true; drawOnCanvas(e)};
const evMouseUp   = (e) => mouse = false;
const evMouseMove = (e) => mouse ? drawOnCanvas(e) : null;

const addCanvasEvent = () => {
    $canvas.addEventListener('mousedown', evMouseDown);
    $canvas.addEventListener('mouseup',   evMouseUp);
    $canvas.addEventListener('mousemove', evMouseMove);
}

const rmCanvasEvent = () => {
    $canvas.removeEventListener('mousedown', evMouseDown);
    $canvas.removeEventListener('mouseup',   evMouseUp);
    $canvas.removeEventListener('mousemove', evMouseMove);
}


// Start and stop the game
let interval;
$start.addEventListener('click', () => {
    rmCanvasEvent();
    $start.disabled = true;
    $btnSave.disabled = true;
    $btnReset.disabled = true;
    interval = setInterval(() => {
        calculateNewState();
        render();
    }, 1000 / fps);
});

$stop.addEventListener('click', () => {
    addCanvasEvent();
    clearInterval(interval);
    $start.disabled = false;
    $btnSave.disabled = false;
    $btnReset.disabled = false;
});


// Page load
(()=> {
    comeToLive = 3;
    minToDie = 2;
    maxToDie = 4;
    fps = 5;

    firstRender();
    addCanvasEvent();
})();
