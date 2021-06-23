
const $canvas = document.querySelector('#canvas-game');


const WIDTH = 500;
const HEIGHT = 500;


$canvas.style.width = `${WIDTH}px`;
$canvas.style.height = `${HEIGHT}px`;
$canvas.style.border = '2px solid #000000';


$canvas.addEventListener('click', (e) => {
    const clientRect = $canvas.getBoundingClientRect();

    const x = e.clientX - clientRect.left;
    const y = e.clientY - clientRect.top;

    console.log(`X: ${x} - Y: ${y}`);
})
