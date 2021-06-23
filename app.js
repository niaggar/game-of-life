
const $start  = document.querySelector('#start');
const $stop   = document.querySelector('#stop');
const $canvas = document.querySelector('#canvas-game');
const ctx     = $canvas.getContext('2d');


let grid;

const fps = 30;

const WIDTH = 600,
      HEIGHT = 600;

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
            if (neighbours === 3 && grid[x][y] === 0) new_grid[x][y] = 1;
            if ((neighbours < 2 || neighbours >= 4) && grid[x][y] === 1) new_grid[x][y] = 0;
        }
    }

    local = JSON.stringify(new_grid)
    grid = JSON.parse(local)
}

const render = () => {
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    for (let x = 0; x < cellNW; x++) {
        for (let y = 0; y < cellNH; y++) {
            if (grid[x][y] === 1) {
                ctx.fillStyle = '#000'
                ctx.fillRect(cellX * x, cellY * y, cellX, cellY);
            } else {
                ctx.strokeStyle = '#afafaf'
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
    interval = setInterval(() => {
        calculateNewState();
        render();
    }, 1000 / fps);
});

$stop.addEventListener('click', () => {
    addCanvasEvent();
    clearInterval(interval);
});


// Page load
(()=> {
    firstRender();
    addCanvasEvent();
})()
