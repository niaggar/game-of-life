
const $start = document.querySelector('#start');
const $canvas = document.querySelector('#canvas-game');
const ctx = $canvas.getContext('2d');


let grid;


const WIDTH = 600,
      HEIGHT = 600;

const cellNW = 60,
      cellNH = 60;

const cellX = WIDTH / cellNW,
      cellY = HEIGHT / cellNH;


const calculateNewState = () => {
    let local = JSON.stringify(grid)
    let new_grid = JSON.parse(local)
    for (let x = 0; x < cellNW; x++) {
        for (let y = 0; y < cellNH; y++) {
            let a, b, c, d, e, f, g, h;
            let problems = []

            if (x - 1 < 0) {
                problems.push('x-1');
                d = grid[cellNW - 1][y];

                if (y - 1 < 0) {
                    a = grid[cellNW - 1][cellNH - 1];
                } else {
                    a = grid[cellNW - 1][y - 1];
                }

                if (y + 1 === cellNH) {
                    f = grid[cellNW - 1][0];
                } else {
                    f = grid[cellNW - 1][y + 1];
                }
            }

            if (x + 1 === cellNW) {
                problems.push('x+1');
                e = grid[0][y];

                if (y - 1 < 0) {
                    c = grid[0][cellNH - 1];
                } else {
                    c = grid[0][y - 1];
                }

                if (y + 1 === cellNH) {
                    h = grid[0][0];
                } else {
                    h = grid[0][y + 1];
                }
            }

            if (y - 1 < 0) {
                problems.push('y-1');
                b = grid[x][cellNH - 1];

                if (!(x - 1 < 0)) {
                    a = grid[x - 1][cellNH - 1];
                }

                if (!(x + 1 === cellNW)) {
                    c = grid[x + 1][cellNH - 1];
                }
            }

            if (y + 1 === cellNH) {
                problems.push('y+1');
                g = grid[x][0];

                if (!(x - 1 < 0)) {
                    f = grid[x - 1][0];
                }

                if (!(x + 1 === cellNW)) {
                    h = grid[x + 1][0];
                }
            }

            if (!(problems.includes('x-1'))) {
                d = grid[x - 1][y];

                if (!(problems.includes('y-1'))) {
                    a = grid[x - 1][y - 1];
                }

                if (!(problems.includes('y+1'))) {
                    f = grid[x - 1][y + 1];
                }
            }

            if (!(problems.includes('x+1'))) {
                e = grid[x + 1][y];

                if (!(problems.includes('y-1'))) {
                    c = grid[x + 1][y - 1];
                }

                if (!(problems.includes('y+1'))) {
                    h = grid[x + 1][y + 1];
                }
            }

            if (!(problems.includes('y-1'))) {
                b = grid[x][y - 1];
            }

            if (!(problems.includes('y+1'))) {
                g = grid[x][y + 1];
            }


            const neighbours = a + b + c + d + e + f + g + h;


            if (neighbours === 3 && grid[x][y] === 0) new_grid[x][y] = 1;
            if ((neighbours < 2 || neighbours >= 4) && grid[x][y] === 1) new_grid[x][y] = 0;


        }
    }
    local = JSON.stringify(new_grid)
    grid = JSON.parse(local)
    render()
}


const render = () => {
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    for (let x = 0; x < cellNW; x++) {
        for (let y = 0; y < cellNH; y++) {
            if (grid[x][y] === 1) {
                ctx.fillStyle = '#000'
                ctx.fillRect(cellX * x, cellY * y, cellX, cellY);
            }
        }
    }
}

const firstRender = () => {
    $canvas.width = WIDTH;
    $canvas.height = HEIGHT;

    grid = new Array(cellNW).fill(0)
        .map((n) => new Array(cellNH).fill(0));

    render();
}


$canvas.addEventListener('click', (e) => {
    const clientRect = $canvas.getBoundingClientRect();

    let x = e.clientX - clientRect.left;
    let y = e.clientY - clientRect.top;

    x = Math.floor(x / cellX);
    y = Math.floor(y / cellY);

    grid[x][y] = grid[x][y] === 1 ? 0 : 1;

    render();
});


$start.addEventListener('click', () => {
    setInterval(() => {
        calculateNewState()
    }, 100);
});


(()=> firstRender())()
