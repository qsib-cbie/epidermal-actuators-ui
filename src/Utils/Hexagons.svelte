<script>
import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();
export let test_ui = false;
export let activeHexagon = -1;
export let orientation = "horizontal"; //orientation refers to direction numbers are listed (horizontal:left to right, vertical:top to bottom)

$: mouseDown = false;
$: rotation = orientation === "horizontal" ? 0 : 90;

const horizontalHexagons = [
  // Row 0
  { id: 0, row: 0, col: 1 },
  { id: 1, row: 0, col: 3 },
  // filler
  { id: 2, row: 0, col: 7 },
  { id: 3, row: 0, col: 9 },

  // Row 1
  { id: 4, row: 1, col: 0 },
  { id: 5, row: 1, col: 2 },
  { id: 6, row: 1, col: 4 },
  { id: 7, row: 1, col: 6 },
  { id: 8, row: 1, col: 8 },
  { id: 9, row: 1, col: 10 },

  // Row 2
  { id: 10, row: 2, col: 1 },
  { id: 11, row: 2, col: 3 },
  { id: 12, row: 2, col: 5 },
  { id: 13, row: 2, col: 7 },
  { id: 14, row: 2, col: 9 },

  // Row 3
  { id: 15, row: 3, col: 0 },
  { id: 16, row: 3, col: 2 },
  { id: 17, row: 3, col: 4 },
  { id: 18, row: 3, col: 6 },
  { id: 19, row: 3, col: 8 },
  { id: 20, row: 3, col: 10 },

  // Row 4
  { id: 21, row: 4, col: 1 },
  { id: 22, row: 4, col: 3 },
  { id: 23, row: 4, col: 5 },
  { id: 24, row: 4, col: 7 },
  { id: 25, row: 4, col: 9 },

  // Row 5
  { id: 26, row: 5, col: 0 },
  { id: 27, row: 5, col: 2 },
  { id: 28, row: 5, col: 4 },
  { id: 29, row: 5, col: 6 },
  { id: 30, row: 5, col: 8 },
  { id: 31, row: 5, col: 10 },

  // Row 6
  { id: 32, row: 6, col: 1 },
  { id: 33, row: 6, col: 3 },
  // filler
  { id: 34, row: 6, col: 7 },
  { id: 35, row: 6, col: 9 },];

const verticalHexagons = [
  // Row 0
  { id: 0, row: 9, col: 0 },
  { id: 1, row: 7, col: 0 },
  // filler
  { id: 2, row: 3, col: 0 },
  { id: 3, row: 1, col: 0 },

  // Row 1
  { id: 4, row: 10, col: 1 },
  { id: 5, row: 8, col: 1 },
  { id: 6, row: 6, col: 1 },
  { id: 7, row: 4, col: 1 },
  { id: 8, row: 2, col: 1 },
  { id: 9, row: 0, col: 1 },

  // Row 2
  { id: 10, row: 9, col: 2 },
  { id: 11, row: 7, col: 2 },
  { id: 12, row: 5, col: 2 },
  { id: 13, row: 3, col: 2 },
  { id: 14, row: 1, col: 2 },

  // Row 3
  { id: 15, row: 10, col: 3 },
  { id: 16, row: 8, col: 3 },
  { id: 17, row: 6, col: 3 },
  { id: 18, row: 4, col: 3 },
  { id: 19, row: 2, col: 3 },
  { id: 20, row: 0, col: 3 },

  // Row 4
  { id: 21, row: 9, col: 4 },
  { id: 22, row: 7, col: 4 },
  { id: 23, row: 5, col: 4 },
  { id: 24, row: 3, col: 4 },
  { id: 25, row: 1, col: 4 },

  // Row 5
  { id: 26, row: 10, col: 5 },
  { id: 27, row: 8, col: 5 },
  { id: 28, row: 6, col: 5 },
  { id: 29, row: 4, col: 5 },
  { id: 30, row: 2, col: 5 },
  { id: 31, row: 0, col: 5 },

  // Row 6
  { id: 32, row: 9, col: 6 },
  { id: 33, row: 7, col: 6 },
  // filler
  { id: 34, row: 3, col: 6 },
  { id: 35, row: 1, col: 6 },];
  const hexagonSideLength = 70;
const globalPadding = 10;
const baseSpacing = 15;
const horizontalSpacing = baseSpacing;
const verticalSpacing = 1.5 * baseSpacing;
const width = Math.sqrt(3) * hexagonSideLength;
const height = 2 * hexagonSideLength;

$: oriented_hexagons = orientation === "horizontal" ? horizontalHexagons : verticalHexagons;

// Compute the pixel location for each hexagon
const horizontalHexagonsWithoutPixels = horizontalHexagons.map(({id, row, col}) => {
    const x = (globalPadding / 2) + (col/2 + .5) * width + Math.max((col / 2) * horizontalSpacing, 0);
    const y = (globalPadding / 2) + ((row/2) * 1.5 + .5) * height + Math.max((row / 2) * verticalSpacing, 0);
    return {id, row, col, x, y}
});
const verticalHexagonsWithoutPixels = verticalHexagons.map(({id, row, col}) => {
    const x = (globalPadding / 2) + (col/2 * 1.5 + .5) * height + Math.max((col / 2) * (horizontalSpacing+5), 0);
    const y = (globalPadding / 2) + ((row/2) + .5) * width + Math.max((row / 2) * (verticalSpacing-5), 0);
    return {id, row, col, x, y}
});

const horizantalViewBox = horizontalHexagonsWithoutPixels.reduce((previousValue, currentValue) => {
    return {
        x: Math.max(previousValue.x, currentValue.x + (width / 2) + (globalPadding / 2)),
        y: Math.max(previousValue.y, currentValue.y + (height / 2) + (globalPadding / 2)),
    };
});
const  verticalViewBox = verticalHexagonsWithoutPixels.reduce((previousValue, currentValue) => {
    return {
        x: Math.max(previousValue.x, currentValue.x + (height / 2) + (globalPadding / 2)),
        y: Math.max(previousValue.y, currentValue.y + (width / 2) + (globalPadding / 2)),
    };
});

$: viewBox = orientation === "horizontal" ? horizantalViewBox : verticalViewBox;

$: drawableHexagons = oriented_hexagons.map(({id, row, col}) => {
    const sqrt3 = Math.sqrt(3);
    const a = hexagonSideLength / 2;
    const height = (4 * a);
    const width = (2 * sqrt3 * a);
    const points = [
      `${sqrt3 * a}, ${0}`,
      `${width}, ${a}`,
      `${width}, ${3 * a}`,
      `${sqrt3 * a}, ${height}`,
      `${0}, ${3 * a}`,
      `${0}, ${a}`,
    ];
    const x = orientation === "horizontal" ? (globalPadding / 2) + (col/2 + .5) * width + Math.max((col / 2) * horizontalSpacing, 0) : (globalPadding / 2) + (col/2 * 1.5 + .5) * height + Math.max((col / 2) * (horizontalSpacing+5), 0);
    const y = orientation === "horizontal" ? (globalPadding / 2) + ((row/2) * 1.5 + .5) * height + Math.max((row / 2) * verticalSpacing, 0) : (globalPadding / 2) + ((row/2) + .5) * width + Math.max((row / 2) * (verticalSpacing-5), 0);
    const color = activeHexagon === id ? "mediumseagreen" : "black";

    return {id, x, y, width, height, points: points.join(' '), color};
});

function handleTouchStart(e) { 
    if(e.stopPropagation) e.stopPropagation();
    if(e.preventDefault) e.preventDefault();
    mouseDown = true;
}
function handleTouchMove(e) {
    if(e.stopPropagation) e.stopPropagation();
    if(e.preventDefault) e.preventDefault();

    if(!mouseDown) {
        return;
    }

    const radius = Math.sqrt(3) * hexagonSideLength / 2;
    const radiusSquared = radius * radius;

    for(var i = 0; i < drawableHexagons.length; i++) {
        const x = drawableHexagons[i].x;
        const y = drawableHexagons[i].y;
        const xDist = (x - e.offsetX);
        const yDist = (y - e.offsetY);
        const euclidianDistSquared = xDist * xDist + yDist * yDist;
        if(euclidianDistSquared < radiusSquared) {
            activeHexagon = drawableHexagons[i].id;
            dispatch('click', {value: activeHexagon}); //trigger click event to call function in Manual compnent
      }
    }
}
function handleTouchEnd(e) {
    if(e.stopPropagation) e.stopPropagation();
    if(e.preventDefault) e.preventDefault();

    mouseDown = false;
    activeHexagon = -1;
}

function handleMouseDown(event) { handleTouchStart(event); }
function handleMouseMove(event) { handleTouchMove(event); }
function handleMouseUp(event) { handleTouchEnd(event); }


</script>

<div class='col-50'>
    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
        width={`${viewBox.x}px`}
        height={`${viewBox.y}px`}
        viewBox={`0 0 ${viewBox.x} ${viewBox.y}`}
        preserveAspectRatio="xMidYMid meet"
        on:mousedown={handleMouseDown}
        on:mousemove={handleMouseMove}
        on:mouseup={handleMouseUp}
        >

        {#each drawableHexagons as hexagon}
            <g key={`g-${hexagon.id}`}>
                <polygon
                    id={`hex-${hexagon.id}`}
                    key={`hex-${hexagon.x}-${hexagon.y}`}
                    class="activatable"
                    fill="none"
                    stroke={hexagon.color}
                    stroke-width="5px"
                    strokeLinejoin="miter"
                    transform={`rotate(${rotation} ${hexagon.x} ${hexagon.y}) translate(${hexagon.x - (hexagon.width / 2)} ${hexagon.y - (hexagon.height / 2)})`}
                    points={hexagon.points} />
                    <text id={`text-${hexagon.id}`} x={hexagon.x - 6} y={hexagon.y}>{hexagon.id}</text>
                </g>
        {/each}
    </svg>
    {#if test_ui}
        {#each horizontalHexagons as actuator}
            <button on:click={() => dispatch('message', {value: actuator.id})}> Button {actuator.id}</button>
        {/each}
    {/if}
</div>

<style>
    .col-50 {
        width: 40%;
        height: 100%;

        display: inline-block;
        vertical-align: top;

        margin: 0px auto;
        padding: 1em;
    }
    svg {
        cursor: draggable;
    }
</style>