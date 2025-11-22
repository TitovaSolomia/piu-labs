import { store } from './store.js';

const addSquareBtn = document.getElementById('addSquare');
const addCircleBtn = document.getElementById('addCircle');
const recolorSquaresBtn = document.getElementById('recolorSquares');
const recolorCirclesBtn = document.getElementById('recolorCircles');
const clearAllBtn = document.getElementById('clearAll');

const cntSquaresEl = document.getElementById('cntSquares');
const cntCirclesEl = document.getElementById('cntCircles');
const cntTotalEl = document.getElementById('cntTotal');

const board = document.getElementById('board');

const renderedShapes = new Map();

addSquareBtn.addEventListener('click', () => {
    store.addShape('square');
});

addCircleBtn.addEventListener('click', () => {
    store.addShape('circle');
});

recolorSquaresBtn.addEventListener('click', () => {
    store.recolorShapes('square');
});

recolorCirclesBtn.addEventListener('click', () => {
    store.recolorShapes('circle');
});

clearAllBtn.addEventListener('click', () => {
    store.clearAll();
});

board.addEventListener('click', (e) => {
    const shapeEl = e.target.closest('[data-shape-id]');
    if (!shapeEl) return;
    const id = shapeEl.dataset.shapeId;
    store.removeShape(id);
});

function createShapeElement(shape) {
    const el = document.createElement('div');
    el.classList.add('shape');
    el.classList.add(shape.type);
    el.dataset.shapeId = shape.id;
    el.style.backgroundColor = shape.color;
    return el;
}

function renderShapes(shapes) {
    const nextIds = new Set();

    for (const shape of shapes) {
        nextIds.add(shape.id);

        let el = renderedShapes.get(shape.id);
        if (!el) {
            el = createShapeElement(shape);
            renderedShapes.set(shape.id, el);
            board.appendChild(el);
        } else {
            el.style.backgroundColor = shape.color;
        }
    }

    for (const [id, el] of renderedShapes.entries()) {
        if (!nextIds.has(id)) {
            el.remove();
            renderedShapes.delete(id);
        }
    }
}

function renderCounters() {
    const { squares, circles, total } = store.getCounters();
    cntSquaresEl.textContent = squares;
    cntCirclesEl.textContent = circles;
    cntTotalEl.textContent = total;
}

function render(state) {
    renderShapes(state.shapes);
    renderCounters();
}

store.subscribe(render);
