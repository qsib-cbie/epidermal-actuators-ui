<script>
import { block0_31, block32_63, block64_95, block96_127, act_command } from "../../stores/stores.js";
import Communication from "./Communication.svelte";
import Moveable from "svelte-moveable";


export let test_ui = false;
export let activeHexagon = -1;
export let message = 'starting ...';
export let orientation = "horizontal";
export let arraySize = "normal";

let Com;
let pendingTimeout;
let endpoint;
let nopRoute;
let success;

let target;
let moveable;

$: initialRotation = orientation === "horizontal" ? 0 : -90;
$: setRotationstyle = "rotate("+initialRotation.toString()+"deg)";
$: setScaleStyle = arraySize === "small" ? "scale(0.2,0.2)" : "scale(1,1)";
$: setStyle = "transform: "+setRotationstyle+setScaleStyle+";";

$: mouseDown = false;
$: rotation = 30;

const frame = {rotate: 0, translate: [0,0], scale: [1,1]};

function getBytesForActuator(actuator) {
    /*Passed active actuator, Returns Array of 16 strings with 8 'bits'*/
    let shiftActuator;
    let binActuator;
    const zero = '0';
    if (actuator <= 31) {
        shiftActuator = Math.abs(1 << actuator); 
        binActuator = shiftActuator.toString(2).padStart(32,'0'); 
        binActuator = zero.repeat(96) + binActuator; //Pad with leading/trailing zeros to fill out to 128 'bits'
    } else if (actuator >= 32 && actuator < 63) {
        shiftActuator = Math.abs(1 << (actuator - 32)); 
        binActuator = shiftActuator.toString(2).padStart(32,'0');
        binActuator = zero.repeat(64) + binActuator + zero.repeat(32);
    } else if (actuator >= 64 && actuator < 95) {
        shiftActuator = Math.abs(1 << (actuator - 64)); 
        binActuator = shiftActuator.toString(2).padStart(32,'0');
        binActuator = zero.repeat(32) + binActuator + zero.repeat(64);
    } else if (actuator >= 96 && actuator < 127) {
        shiftActuator = Math.abs(1 << (actuator - 96)); 
        binActuator = shiftActuator.toString(2).padStart(32,'0');
        binActuator = binActuator + zero.repeat(96);
    }
    return [...Array(16).keys()].map(i => binActuator.slice(i * 8, (i+1) * 8)).reverse();
}

function buildCommandBlocks(active) {
    const [b0_0, b0_1, b0_2, b0_3, b1_0, b1_1, b1_2, b1_3, b2_0, b2_1, b2_2, b2_3, b3_0, b3_1, b3_2, b3_3] = getBytesForActuator(active);
    block0_31.set([b0_0, b0_1, b0_2, b0_3]);
    block32_63.set([b1_0, b1_1, b1_2, b1_3]);
    block64_95.set([b2_0, b2_1, b2_2, b2_3]);
    block96_127.set([b3_0, b3_1, b3_2, b3_3]);

}


const hexagons = [
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

const hexagonSideLength = 70;
const globalPadding = 10;
const baseSpacing = 15;
const horizontalSpacing = baseSpacing;
const verticalSpacing = 1.5 * baseSpacing;
const width = Math.sqrt(3) * hexagonSideLength;
const height = 2 * hexagonSideLength;

// Compute the pixel location for each hexagon
const hexagonsWithoutPixels = hexagons.map(({id, row, col}) => {
    const x = (globalPadding / 2) + (col/2 + .5) * width + Math.max((col / 2) * horizontalSpacing, 0);
    const y = (globalPadding / 2) + ((row/2) * 1.5 + .5) * height + Math.max((row / 2) * verticalSpacing, 0);
    return {id, row, col, x, y}
});

const viewBox = hexagonsWithoutPixels.reduce((previousValue, currentValue) => {
    return {
        x: Math.max(previousValue.x, currentValue.x + (width / 2) + (globalPadding / 2)),
        y: Math.max(previousValue.y, currentValue.y + (height / 2) + (globalPadding / 2)),
    };
});

$: drawableHexagons = hexagons.map(({id, row, col}) => {
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
    const x = (globalPadding / 2) + (col/2 + .5) * width + Math.max((col / 2) * horizontalSpacing, 0);
    const y = (globalPadding / 2) + ((row/2) * 1.5 + .5) * height + Math.max((row / 2) * verticalSpacing, 0);
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
            buildCommandBlocks(activeHexagon);
            (async () => {
                return await Com.hitEndpoint(endpoint, nopRoute, $act_command);
            })().then(result => {
                if(pendingTimeout) {
                    clearTimeout(pendingTimeout);
                }
                pendingTimeout = setTimeout(() => { activeHexagon = -1 }, 500);
                return result;
            }).catch(error => {
                message = error;
                activeHexagon = -1;
                throw error;
            });
        }
    }
}
function handleTouchEnd(e) {
    if(e.stopPropagation) e.stopPropagation();
    if(e.preventDefault) e.preventDefault();

    mouseDown = false;
    activeHexagon = -1;
}


</script>

<Communication bind:this={Com} bind:endpoint bind:nopRoute bind:success bind:message bind:pendingTimeout/>

<div class="col-5">
    <button on:click={() => moveable.request("rotatable",{deltaRotate: -(rotation)}, true)}>Rotate {rotation}&#730 &#8634</button>    
    <button on:click={() => moveable.request("rotatable",{deltaRotate: +(rotation)}, true)}>Rotate {rotation}&#730 &#8635</button>    
    <input style="width: 50%" bind:value={rotation}/> &deg
    <br/>
    <button on:click={() => moveable.request("rotatable",{rotate: initialRotation}, true)}>Reset</button>
</div>

<div class='col-50' style={setStyle}>
    <div bind:this={target}>
        <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
            width={`${viewBox.x}px`}
            height={`${viewBox.y}px`}
            viewBox={`0 0 ${viewBox.x} ${viewBox.y}`}
            preserveAspectRatio="xMidYMid meet"
            on:mousedown={e => handleTouchStart(e)}
            on:mousemove={e => handleTouchMove(e)}
            on:mouseup={e => handleTouchEnd(e)}
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
                        transform={`translate(${hexagon.x - (hexagon.width / 2)} ${hexagon.y - (hexagon.height / 2)})`}
                        points={hexagon.points} />
                        <text id={`text-${hexagon.id}`} x={hexagon.x - 6} y={hexagon.y}>{hexagon.id}</text>
                    </g>
            {/each}
        </svg>
        {#if test_ui}
            {#each hexagons as actuator}
                <button on:click={buildCommandBlocks(actuator.id)}> Button {actuator.id}</button>
            {/each}
            <p>Test: {$block0_31}, {$block32_63}, {$block64_95}, {$block96_127}</p>
        {/if}
    </div>
</div>

<Moveable target={target} rotatable={true} throttleRotate={0} rotatePosition="top" bind:this={moveable}
on:rotateStart={({ detail: {set}}) => {set(frame.rotate);}}
on:rotate={({ detail: { target, beforeRotate }}) => {
        frame.rotate = beforeRotate;
        target.style.transform = `rotate(${beforeRotate}deg)`;
    }}
/>


<style>
    .col-5 {
        width: 7%;
        height: 10%;
        display: inline-block;
        vertical-align: top;
        margin: 0em auto;
        margin-top: 3em;
        font-size: large;
    }

    .col-50 {
        width: 40%;
        height: 100%;

        display: inline-block;
        vertical-align: top;

        margin: 0em auto;
        margin-top: 3em;

        padding: 1em;
    }
    svg {
        cursor: draggable;
    }
</style>