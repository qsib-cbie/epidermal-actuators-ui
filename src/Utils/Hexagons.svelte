<script>
import { block0_31, block32_63, block64_95, block96_127, act_command, message, OP_Mode, preset_display } from "../../stores/stores.js";
import Communication from "./Communication.svelte";
import Moveable from "svelte-moveable";
import { onMount } from "svelte";


export let test_ui = false;

export let activeHexagon = [];
export let orientation = "horizontal";
export let arraySize = "normal";
export let isPreset = false;
export let presetName = "";

export let backgroundAsset = "";
export let className = "col-50";

let Com;
let pendingTimeout;
let resendCommand;
let isTouch = false;
let boundRect;
let numTouches = 1;
let endpoint;
let nopRoute;
let success;
let winWidth = window.innerWidth;
let winHeight = window.innerHeight;
let initialHeight = window.innerHeight;
let initialWidth = window.innerWidth;
let strokeWidth;
let target;
let moveable;
let hexagonTypes = [{id:"full", text: "Full Hexagon Array"},
                    {id:"stichable", text:"Stichable Hexagons"}];

$: arrayType = "full";
$: hexagonsLayout = arrayType === "full" ? hexagons : stichableHexagons;
$: view_scale = 1;
$: initialRotation = orientation === "horizontal" ? 0 : -90;
$: setRotationstyle = "rotate("+initialRotation.toString()+"deg)";
$: {
    console.log((winWidth/initialWidth)* (winHeight/initialHeight));
    if (arraySize == "small") {
        view_scale = .05;
        strokeWidth = "1px";
    }else {
        view_scale = (winWidth/initialWidth)*(winHeight/initialHeight);
        strokeWidth = "5px";
    }
   }
$: setBackground = "background-image:url("+backgroundAsset+"); background-position: center; background-color: white background-repeat: no-repeat; background-size: 275% 275%;";
$: setStyle = "transform: "+setRotationstyle+";";

$: mouseDown = false;
$: rotation = 30;


$: Xstart = 0;
$: Ystart = 0;
$: Xend = 0;
$: Yend = 0;
$: deltaX = Xend - Xstart;
$: deltaY = Yend - Ystart;

const frame = {rotate: 0, translate: [0,0], scale: [1,1]};

onMount(() => {
  window.addEventListener("resize",() => {winWidth = window.innerWidth; winHeight = window.innerHeight;})
  boundRect = target.getBoundingClientRect();
  });

function getBytesForActuator(actuators) {
    /*Passed array of active actuators, Returns Array of 16 with decimal representation of binary location of actuator
    (EX: 3rd actuator => 0b00001000) => 8 in first blockByte */
    let blockBytes = [...Array(16).keys()].map(i => 0);
    for (let actuator of actuators) {
        const block  = Math.floor((actuator) / 32);
        const blockByte = Math.floor(((actuator) % 32) / 8);
  	    blockBytes[((block*32)/8) + blockByte] |= (Math.abs(1 << (actuator-(blockByte*8))));
    }
    return blockBytes;
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

const stichableHexagons = [
    {id: 0, row: 0, col: 1},
    {id: 1, row: 0, col: 3},
    {id: 2, row: 1, col: 0},    
    {id: 3, row: 1, col: 2},
    {id: 4, row: 1, col: 4},
    {id: 5, row: 2, col: 1},
    {id: 6, row: 2, col: 3},];  

$: hexagonSideLength = 65*view_scale;
const globalPadding = 10;
$: baseSpacing = 15*view_scale;
$: horizontalSpacing = baseSpacing;
$: verticalSpacing = 1.5 * baseSpacing;
$: width = Math.sqrt(3) * hexagonSideLength;
$: height = 2 * hexagonSideLength;

// Compute the pixel location for each hexagon
$: hexagonsWithoutPixels = hexagonsLayout.map(({id, row, col}) => {
    const x = (globalPadding / 2) + (col/2 + .5) * width + Math.max((col / 2) * horizontalSpacing, 0);
    const y = (globalPadding / 2) + ((row/2) * 1.5 + .5) * height + Math.max((row / 2) * verticalSpacing, 0);
    return {id, row, col, x, y}
});

$: viewBox = hexagonsWithoutPixels.reduce((previousValue, currentValue) => {
    return {
        x: Math.max(previousValue.x, currentValue.x + (width / 2) + (globalPadding / 2)),
        y: Math.max(previousValue.y, currentValue.y + (height / 2) + (globalPadding / 2)),
    };
});

$: drawableHexagons = hexagonsLayout.map(({id, row, col}) => {
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
    const color = activeHexagon.includes(id) ? "mediumseagreen" : "black";

    return {id, x, y, width, height, points: points.join(' '), color};
});

export function sendCommandBlocks() {
    (async () => {
        return await Com.hitEndpoint(endpoint, nopRoute, $act_command);
    })().then(result => {
        if (result.hasOwnProperty('Failure')) {
            $message = result['Failure']['message']; 
        } else {
            $message = "Sent Command Successfully";
        }
        return result;
    }).catch(error => {
        $message = error;
        activeHexagon = [];
        throw error;
    });
}

function findActiveHexagons(e) {
    const radius = Math.sqrt(3) * hexagonSideLength / 2;
    const radiusSquared = radius * radius;
    activeHexagon = [];
    let Xpos;
    let Ypos;
    for(var i = 0; i < drawableHexagons.length; i++) {
        const x = drawableHexagons[i].x;
        const y = drawableHexagons[i].y;
        for (var j = 0; j < numTouches; j++) {
            if (isTouch) {
                Xpos = e.targetTouches[j].clientX - boundRect.left;
                Ypos = e.targetTouches[j].clientY - boundRect.top;
            } else{
                Xpos = e.offsetX;
                Ypos = e.offsetY;
            }
            const xDist = (x - Xpos);
            const yDist = (y - Ypos);
            const euclidianDistSquared = xDist * xDist + yDist * yDist;
            if(euclidianDistSquared < radiusSquared) {
                activeHexagon = [...activeHexagon, drawableHexagons[i].id];
                buildCommandBlocks(activeHexagon);
            }
        }
    }
    sendCommandBlocks();
}

function handleTouchStart(e) { 
    // console.log("touch start");
    if(e.stopPropagation) e.stopPropagation();
    if(e.preventDefault) e.preventDefault();
    mouseDown = true;
    clearInterval(resendCommand);
    clearTimeout(pendingTimeout);
    try {
        if (e.targetTouches.length > 0) {
            isTouch = true;
            numTouches = e.targetTouches.length;
        }
    } catch(error) { 
        numTouches = 1;
    }

    if (isTouch) {
        Xstart = e.targetTouches[0].clientX - boundRect.left;
        Ystart = e.targetTouches[0].clientY - boundRect.top;
    } else {
        Xstart = e.offsetX;
        Ystart = e.offsetY;
    }

    if(!isPreset && arraySize != "small") {
        findActiveHexagons(e);
        resendCommand = setInterval(findActiveHexagons, 500, e);
    }
}

function handleTouchMove(e) {
    if(e.stopPropagation) e.stopPropagation();
    if(e.preventDefault) e.preventDefault();
    if(!mouseDown) {
        return;
    }
    clearInterval(resendCommand);
    if(!isPreset && arraySize != "small") {
        findActiveHexagons(e);
        if (pendingTimeout) { 
            clearTimeout(pendingTimeout);
        }
        pendingTimeout = setTimeout(() => {resendCommand = setInterval(findActiveHexagons, 500, e)}, 500);
    }
    if (isTouch) {
        Xend = e.targetTouches[0].clientX - boundRect.left;
        Yend = e.targetTouches[0].clientY - boundRect.top;
    } else {
        Xend = e.offsetX;
        Yend = e.offsetY;
    }
}

function handleTouchEnd(e) {
    if(e.stopPropagation) e.stopPropagation();
    if(e.preventDefault) e.preventDefault();
    clearInterval(resendCommand);
    clearTimeout(pendingTimeout);
    mouseDown = false;
    isTouch = false;
    activeHexagon = [];
    if (isPreset) {
        let temp = $OP_Mode;
        if (presetName == "sweep") {
            if (deltaX > 0 && Math.abs(deltaY) < 75 ){
                    console.log('LR');
                    $OP_Mode = 0x86;
                    display_preset("sweep-LR");
            } else if (deltaX < 0 && Math.abs(deltaY) < 75) {
                    console.log('RL');
                    $OP_Mode = 0x87;
                    display_preset("sweep-RL");
            } else if (deltaY > 0 && Math.abs(deltaX) < 75) {
                    console.log('TB');
                    $OP_Mode = 0x88;
                    display_preset("sweep-TB");
            } else if (deltaY < 0 && Math.abs(deltaX) < 75) { 
                    console.log('BT');
                    $OP_Mode = 0x89;
                    display_preset("sweep-BT");
            } else if (deltaX > 0 && deltaY < 0) {
                    console.log('+45BT');
                    $OP_Mode = 0x8a;
                    display_preset("sweep+45BT");
            } else if (deltaX < 0 && deltaY > 0) {
                    console.log('+45TB');
                    $OP_Mode = 0x8b;
                    display_preset("sweep+45TB");
            } else if (deltaX < 0 && deltaY < 0) {
                    console.log('-45BT');
                    $OP_Mode = 0x8c;
                    display_preset("sweep-45BT");
            } else if (deltaX > 0 && deltaY > 0) {
                    console.log('-45TB');
                    $OP_Mode = 0x8d;
                    display_preset("sweep-45TB");
            }
        } else if (presetName == "FlashAll") {
            $OP_Mode = 0x80;
            display_preset("flashall");
        }
        sendCommandBlocks();
        $OP_Mode = temp;
    }
}

async function display_preset(name) {
    for (let item of $preset_display) {
        if (name == item.name) {
            for (let a of item.array) {
                activeHexagon = a;
                await sleep(500);
            }
        }
    }
    activeHexagon = [];
}

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

</script>

<Communication bind:this={Com} bind:endpoint bind:nopRoute bind:success/>

<div class="full-container" style={setBackground}>
    {#if arraySize == "normal"}
        <div class="col-5">
            <select bind:value={arrayType}>
                {#each hexagonTypes as type}
                    <option value={type.id}>
                        {type.text}
                    </option>
                {/each}
            </select>
            <br/>
            <button on:click={() => moveable.request("rotatable",{deltaRotate: -(rotation)}, true)}>Rotate {rotation}&#730 &#8634</button>    
            <button on:click={() => moveable.request("rotatable",{deltaRotate: +(rotation)}, true)}>Rotate {rotation}&#730 &#8635</button>    
            <input style="width: 50%" bind:value={rotation}/> &deg
            <br/>
            <button on:click={() => moveable.request("rotatable",{rotate: initialRotation}, true)}>Reset</button>
        </div>
    {/if}

    <div class={className}>
        <svg  version="1.0" xmlns="http://www.w3.org/2000/svg" bind:this={target} style={setStyle}
            width={`${viewBox.x}px`}
            height={`${viewBox.y}px`}
            viewBox={`0 0 ${viewBox.x} ${viewBox.y}`}
            preserveAspectRatio="xMidYMid meet"
            on:mousedown={e => handleTouchStart(e)}
            on:mousemove={e => handleTouchMove(e)}
            on:mouseup={e => handleTouchEnd(e)}    
            on:touchstart={e => handleTouchStart(e)}
            on:touchmove={e => handleTouchMove(e)}
            on:touchend={e => handleTouchEnd(e)}
            >
            {#each drawableHexagons as hexagon}
                <g key={`g-${hexagon.id}`}>
                    <polygon
                        id={`hex-${hexagon.id}`}
                        key={`hex-${hexagon.x}-${hexagon.y}`}
                        class="activatable"
                        fill="none"
                        stroke={hexagon.color}
                        stroke-width={strokeWidth}
                        strokeLinejoin="miter"
                        transform={`translate(${hexagon.x - (hexagon.width / 2)} ${hexagon.y - (hexagon.height / 2)})`}
                        points={hexagon.points} />
                        {#if arraySize == "normal"}
                            <text id={`text-${hexagon.id}`} x={hexagon.x - 6} y={hexagon.y}>{hexagon.id}</text>
                        {/if}
                    </g>
            {/each}
        </svg>
        {#if test_ui}
            {#each hexagonsLayout as actuator}
                <button on:click={buildCommandBlocks(actuator.id)}> Button {actuator.id}</button>
            {/each}
            <p>Test: {$block0_31}, {$block32_63}, {$block64_95}, {$block96_127}</p>
        {/if}
    </div>
</div>

<Moveable target={target} bind:this={moveable} className="moveable"
    rotatable={true} throttleRotate={0} rotatePosition="top"
    on:rotateStart={({ detail: {set}}) => {set(frame.rotate);}}
    on:rotate={({ detail: { target, beforeRotate }}) => {
        frame.rotate = beforeRotate;
        target.style.transform = `rotate(${beforeRotate}deg)`;
    }}
    snappable={true}
    verticalGuidelines={[0,200,400]}
    horizontalGuidelines={[0,200,400]}
    snapThreshold={5}
    isDisplaySnapDigit={true}
    snapGap={true}
    snapElement={true}
    snapVertical={true}
    snapHorizontal={true}
    snapCenter={false}
    snapDigit={0}
    

    draggable={false}
    throttleDrag={0}
    startDragRotate={0}
    throttleDragRotate={0}
    zoom={1}
    origin={true}
    padding={{"left":0,"top":0,"right":0,"bottom":0}}
    on:dragStart={({ detail: { set } }) => {
        set(frame.translate);
    }}
    on:drag={({ detail: { target, beforeTranslate } }) => {
        frame.translate = beforeTranslate;
        target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
    }}
    on:dragEnd={({ detail: { target, isDrag, clientX, clientY }}) => {
        console.log("onDragEnd", target, isDrag);
    }}
/>


<style>
    .col-5 {
        width: 20%;
        height: 10%;
        display: inline-block;
        vertical-align: top;
        margin: 0em auto;
        margin-top: 3em;
        font-size: large;
    }

    .col-50 {
        width: 50%;
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
    .full-container {
        width: 100%;
        height: 100%;
        vertical-align: middle;
    }
    :global(.moveable) {
        z-index: 10;
        display: none !important;
    }

</style>