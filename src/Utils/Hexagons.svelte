<script>
import { block0_31, block32_63, block64_95, block96_127, act_command, message, command, preset_display, is_success, single_pulse_pause, single_pulse_duration, hfPeriod, hfDutyCycle, lfPeriod, lfDutyCycle, endpoint } from "../../stores/stores.js";
import Communication from "./Communication.svelte";
import Moveable from "svelte-moveable";
import { onMount } from "svelte";


export let test_ui = false;

export let activeHexagon = [];
export let orientation = 0;
export let arraySize = null;
export let isPreset = false;
export let presetName = "";
export let arrayType = "full";
export let is_overlay = false;

let Com;
let pendingTimeout;
let resendCommand;
let isTouch = false;
let boundRect;
let nopRoute;
let success;
let hexCache = [];
let tpCache = [];
let winWidth = window.innerWidth;
let winHeight = window.innerHeight;
let initialHeight = window.innerHeight;
let initialWidth = window.innerWidth;
let strokeWidth;
let target;
let moveable;
let hexagonsLayout;
let hexagonTypes = [{id:"full", text: "Full Hexagon Array"},
                    {id:"stichable", text:"Stichable Hexagons"},
                    {id:"thermal", text:"Thermal Array"}];

$: {switch(arrayType){
    case "stich":
        hexagonsLayout = stichableHexagons;
        break;
    case "hand":
        hexagonsLayout = hand_hexagons;
        break;
    case "back":
        hexagonsLayout = back_hexagons;
        break;
    case "thigh":
        hexagonsLayout = thigh_hexagons;
        break;
    case "shoulder":
        hexagonsLayout = shoulder_hexagons;
        break;
    case "chest":
        hexagonsLayout = chest_hexagons;
        break;
    case "test":
        hexagonsLayout = testingHexagons;
        break;
    default:
        hexagonsLayout = hexagons;
}}
$: view_scale = ((winWidth/initialWidth)*(winHeight/initialHeight))-(initialHeight/initialWidth);
$: setRotationstyle = "rotate("+orientation.toString()+"deg)";
$: {
    if (arraySize) {
        view_scale = view_scale/arraySize;
        if (view_scale > .3 & view_scale < .5) {
            strokeWidth = "2px";
        } else if (view_scale > .5) {
            strokeWidth = "4px";
        } else {
            strokeWidth = "1px";
        }
    }else {
        view_scale = ((winWidth/initialWidth)*(winHeight/initialHeight))-(initialHeight/initialWidth);
        strokeWidth = "5px";
    }
   }
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
  { id: 35, row: 6, col: 9 },
];

const testingHexagons = [
    {id: 0, row: 0, col: 1},
    {id: 1, row: 0, col: 3},
    {id: 4, row: 1, col: 0},    
    {id: 5, row: 1, col: 2},
    {id: 6, row: 1, col: 4},
    {id: 10, row: 2, col: 1},
    {id: 11, row: 2, col: 3},
];

const stichableHexagons = [
    {id: 0, row: 0, col: 1},
    {id: 1, row: 0, col: 3},
    {id: 2, row: 1, col: 0},    
    {id: 3, row: 1, col: 2},
    {id: 4, row: 1, col: 4},
    {id: 5, row: 2, col: 1},
    {id: 6, row: 2, col: 3},
];

const thermalHexagons = [
    {id: 0, row: 0, col: 2},
    {id: 1, row: 0, col: 4},
    {id: 2, row: 0, col: 6},
    {id: 3, row: 1, col: 1},
    {id: 4, row: 1, col: 3},
    {id: 5, row: 1, col: 5},
    {id: 6, row: 1, col: 7},
    {id: 7, row: 2, col: 0},
    {id: 8, row: 2, col: 2},
    {id: 9, row: 2, col: 4},
    {id: 10, row:2, col: 6},
    {id: 11, row: 2, col: 8},
    {id: 12, row: 3, col: 1},
    {id: 13, row: 3, col: 3},
    {id: 14, row: 3, col: 5},
    {id: 15, row: 3, col: 7},
    {id: 16, row: 4, col: 2},
    {id: 17, row: 4, col: 4},
    {id: 18, row: 4, col: 6},
];

const hand_hexagons = [
  { id: 0, row:0, col:4},
  { id: 1, row:0, col:2},
  { id: 2, row:1, col:3},
  { id: 3, row:1, col:5},
  { id: 4, row:1, col:1},
  { id: 5, row:2, col:2},
  { id: 6, row:2, col:4},

  { id: 7, row:3, col:3},
  { id: 8, row:3, col:1},
  { id: 9, row:4, col:2},
  { id: 10, row:4, col:4},
  { id: 11, row:4, col:0},
  { id: 12, row:5, col:1},
  { id: 13, row:5, col:3},

  { id: 14, row:2, col:8},
  { id: 15, row:2, col:6},
  { id: 16, row:3, col:7},
  { id: 17, row:3, col:9},
  { id: 18, row:3, col:5},
  { id: 19, row:4, col:6},
  { id: 20, row:4, col:8},
];

const back_hexagons = [
  { id: 0, row:0, col:23},
  { id: 1, row:0, col:21},
  { id: 2, row:1, col:22},
  { id: 3, row:1, col:24},
  { id: 4, row:1, col:20},
  { id: 5, row:2, col:21},
  { id: 6, row:2, col:23},

  { id: 7, row:1, col:18},
  { id: 8, row:1, col:16},
  { id: 9, row:2, col:17},
  { id: 10, row:2, col:19},
  { id: 11, row:2, col:15},
  { id: 12, row:3, col:16},
  { id: 13, row:3, col:18},

  { id: 14, row:3, col:22},
  { id: 15, row:3, col:20},
  { id: 16, row:4, col:21},
  { id: 17, row:4, col:23},
  { id: 18, row:4, col:19},
  { id: 19, row:5, col:20},
  { id: 20, row:5, col:22},

  { id: 21, row:2, col:13},
  { id: 22, row:2, col:11},
  { id: 23, row:3, col:12},
  { id: 24, row:3, col:14},
  { id: 25, row:3, col:10},
  { id: 26, row:4, col:11},
  { id: 27, row:4, col:13},

  { id: 28, row:4, col:17},
  { id: 29, row:4, col:15},
  { id: 30, row:5, col:16},
  { id: 31, row:5, col:18},
  { id: 32, row:5, col:14},
  { id: 33, row:6, col:15},
  { id: 34, row:6, col:17},

  { id: 35, row:6, col:21},
  { id: 36, row:6, col:19},
  { id: 37, row:7, col:20},
  { id: 38, row:7, col:22},
  { id: 39, row:7, col:18},
  { id: 40, row:8, col:19},
  { id: 41, row:8, col:21},

  { id: 42, row:5, col:26},
  { id: 43, row:5, col:24},
  { id: 44, row:6, col:25},
  { id: 45, row:6, col:27},
  { id: 46, row:6, col:23},
  { id: 47, row:7, col:24},
  { id: 48, row:7, col:26},

  { id: 49, row:3, col:8},
  { id: 50, row:3, col:6},
  { id: 51, row:4, col:7},
  { id: 52, row:4, col:9},
  { id: 53, row:4, col:5},
  { id: 54, row:5, col:6},
  { id: 55, row:5, col:8},

  { id: 56, row:5, col:12},
  { id: 57, row:5, col:10},
  { id: 58, row:6, col:11},
  { id: 59, row:6, col:13},
  { id: 60, row:6, col:9},
  { id: 61, row:7, col:12},
  { id: 62, row:7, col:10},

  { id: 63, row:7, col:16},
  { id: 64, row:7, col:14},
  { id: 65, row:8, col:15},
  { id: 66, row:8, col:17},
  { id: 67, row:8, col:13},
  { id: 68, row:9, col:14},
  { id: 69, row:9, col:16},

  { id: 70, row:9, col:20},
  { id: 71, row:9, col:18},
  { id: 72, row:10, col:19},
  { id: 73, row:10, col:21},
  { id: 74, row:10, col:17},
  { id: 75, row:11, col:18},
  { id: 76, row:11, col:20},

  { id: 77, row:8, col:25},
  { id: 78, row:8, col:23},
  { id: 79, row:9, col:24},
  { id: 80, row:9, col:26},
  { id: 81, row:9, col:22},
  { id: 82, row:10, col:23},
  { id: 83, row:10, col:25},

  { id: 84, row:4, col:3},
  { id: 85, row:4, col:1},
  { id: 86, row:5, col:2},
  { id: 87, row:5, col:4},
  { id: 88, row:5, col:0},
  { id: 89, row:6, col:1},
  { id: 90, row:6, col:3},

  { id: 91, row:6, col:7},
  { id: 92, row:6, col:5},
  { id: 93, row:7, col:6},
  { id: 94, row:7, col:8},
  { id: 95, row:7, col:4},
  { id: 96, row:8, col:5},
  { id: 97, row:8, col:7},

  { id: 98, row:8, col:11},
  { id: 99, row:8, col:9},
  { id: 100, row:9, col:10},
  { id: 101, row:9, col:12},
  { id: 102, row:9, col:8},
  { id: 103, row:10, col:9},
  { id: 104, row:10, col:11},

  { id: 105, row:10, col:15},
  { id: 106, row:10, col:13},
  { id: 107, row:11, col:14},
  { id: 108, row:11, col:16},
  { id: 109, row:11, col:12},
  { id: 110, row:12, col:13},
  { id: 111, row:12, col:15},

  { id: 112, row:9, col:6},
  { id: 113, row:9, col:4},
  { id: 114, row:10, col:5},
  { id: 115, row:10, col:7},
  { id: 116, row:10, col:3},
  { id: 117, row:11, col:4},
  { id: 118, row:11, col:6},

  { id: 119, row:11, col:10},
  { id: 120, row:11, col:8},
  { id: 121, row:12, col:9},
  { id: 122, row:12, col:11},
  { id: 123, row:12, col:7},
  { id: 124, row:13, col:8},
  { id: 125, row:13, col:10},
];

const thigh_hexagons = [
    { id: 0, row:0, col:10},
    { id: 1, row:0, col:8},
    { id: 2, row:1, col:9},
    { id: 3, row:1, col:11},
    { id: 4, row:1, col:7},
    { id: 5, row:2, col:8},
    { id: 6, row:2, col:10},

    { id: 7, row:1, col:5},
    { id: 8, row:1, col:3},
    { id: 9, row:2, col:4},
    { id: 10, row:2, col:6},
    { id: 11, row:2, col:2},
    { id: 12, row:3, col:3},
    { id: 13, row:3, col:5},

    { id: 14, row:3, col:9},
    { id: 15, row:3, col:7},
    { id: 16, row:4, col:8},
    { id: 17, row:4, col:10},
    { id: 18, row:4, col:6},
    { id: 19, row:5, col:7},
    { id: 20, row:5, col:9},

    { id: 21, row:4, col:4},
    { id: 22, row:4, col:2},
    { id: 23, row:5, col:3},
    { id: 24, row:5, col:5},
    { id: 25, row:5, col:1},
    { id: 26, row:6, col:2},
    { id: 27, row:6, col:4},

    { id: 28, row:6, col:8},
    { id: 29, row:6, col:6},
    { id: 30, row:7, col:7},
    { id: 31, row:7, col:9},
    { id: 32, row:7, col:5},
    { id: 33, row:8, col:6},
    { id: 34, row:8, col:8},

    { id: 35, row:7, col:3},
    { id: 36, row:7, col:1},
    { id: 37, row:8, col:2},
    { id: 38, row:8, col:4},
    { id: 39, row:8, col:0},
    { id: 40, row:9, col:1},
    { id: 41, row:9, col:3},

    { id: 42, row:9, col:7},
    { id: 43, row:9, col:5},
    { id: 44, row:10, col:6},
    { id: 45, row:10, col:8},
    { id: 46, row:10, col:4},
    { id: 47, row:11, col:5},
    { id: 48, row:11, col:7},
];

const shoulder_hexagons = [
  { id: 0, row:0, col:20},
  { id: 1, row:0, col:18},
  { id: 2, row:1, col:19},
  { id: 3, row:1, col:21},
  { id: 4, row:1, col:17},
  { id: 5, row:2, col:18},
  { id: 6, row:2, col:20},

  { id: 7, row:1, col:15},
  { id: 8, row:1, col:13},
  { id: 9, row:2, col:14},
  { id: 10, row:2, col:16},
  { id: 11, row:2, col:12},
  { id: 12, row:3, col:13},
  { id: 13, row:3, col:15},

  { id: 14, row:3, col:19},
  { id: 15, row:3, col:17},
  { id: 16, row:4, col:18},
  { id: 17, row:4, col:20},
  { id: 18, row:4, col:16},
  { id: 19, row:5, col:17},
  { id: 20, row:5, col:19},

  { id: 21, row:2, col:24},
  { id: 22, row:2, col:22},
  { id: 23, row:3, col:23},
  { id: 24, row:3, col:25},
  { id: 25, row:3, col:21},
  { id: 26, row:4, col:22},
  { id: 27, row:4, col:24},

  { id: 28, row:4, col:14},
  { id: 29, row:4, col:12},
  { id: 30, row:5, col:13},
  { id: 31, row:5, col:15},
  { id: 32, row:5, col:11},
  { id: 33, row:6, col:12},
  { id: 34, row:6, col:14},

  { id: 35, row:6, col:18},
  { id: 36, row:6, col:16},
  { id: 37, row:7, col:17},
  { id: 38, row:7, col:19},
  { id: 39, row:7, col:15},
  { id: 40, row:8, col:16},
  { id: 41, row:8, col:18},

  { id: 42, row:5, col:23},
  { id: 43, row:5, col:21},
  { id: 44, row:6, col:22},
  { id: 45, row:6, col:24},
  { id: 46, row:6, col:20},
  { id: 47, row:7, col:21},
  { id: 48, row:7, col:23},

  { id: 49, row:5, col:9},
  { id: 50, row:5, col:7},
  { id: 51, row:6, col:8},
  { id: 52, row:6, col:10},
  { id: 53, row:6, col:6},
  { id: 54, row:7, col:7},
  { id: 55, row:7, col:9},

  { id: 56, row:7, col:13},
  { id: 57, row:7, col:11},
  { id: 58, row:8, col:12},
  { id: 59, row:8, col:14},
  { id: 60, row:8, col:10},
  { id: 61, row:9, col:11},
  { id: 62, row:9, col:13},

  { id: 63, row:6, col:4},
  { id: 64, row:6, col:2},
  { id: 65, row:7, col:3},
  { id: 66, row:7, col:5},
  { id: 67, row:7, col:1},
  { id: 68, row:8, col:2},
  { id: 69, row:8, col:4},

  { id: 70, row:8, col:8},
  { id: 71, row:8, col:6},
  { id: 72, row:9, col:7},
  { id: 73, row:9, col:9},
  { id: 74, row:9, col:5},
  { id: 75, row:10, col:6},
  { id: 76, row:10, col:8},

  { id: 77, row:10, col:12},
  { id: 78, row:10, col:10},
  { id: 79, row:11, col:11},
  { id: 80, row:11, col:13},
  { id: 81, row:11, col:9},
  { id: 82, row:12, col:10},
  { id: 83, row:12, col:12},

  { id: 84, row:9, col:3},
  { id: 85, row:9, col:1},
  { id: 86, row:10, col:2},
  { id: 87, row:10, col:4},
  { id: 88, row:10, col:0},
  { id: 89, row:11, col:1},
  { id: 90, row:11, col:3},

  { id: 91, row:11, col:7},
  { id: 92, row:11, col:5},
  { id: 93, row:12, col:6},
  { id: 94, row:12, col:8},
  { id: 95, row:12, col:4},
  { id: 96, row:13, col:5},
  { id: 97, row:13, col:7},
];

const chest_hexagons = [
    { id: 0, row:0, col:16},
    { id: 1, row:0, col:14},
    { id: 2, row:1, col:15},
    { id: 3, row:1, col:17},
    { id: 4, row:1, col:13},
    { id: 5, row:2, col:14},
    { id: 6, row:2, col:16},

    { id: 7, row:1, col:11},
    { id: 8, row:1, col:9},
    { id: 9, row:2, col:10},
    { id: 10, row:2, col:12},
    { id: 11, row:2, col:8},
    { id: 12, row:3, col:9},
    { id: 13, row:3, col:11},

    { id: 14, row:3, col:15},
    { id: 15, row:3, col:13},
    { id: 16, row:4, col:14},
    { id: 17, row:4, col:16},
    { id: 18, row:4, col:12},
    { id: 19, row:5, col:13},
    { id: 20, row:5, col:15},

    { id: 21, row:2, col:20},
    { id: 22, row:2, col:18},
    { id: 23, row:3, col:19},
    { id: 24, row:3, col:21},
    { id: 25, row:3, col:17},
    { id: 26, row:4, col:18},
    { id: 27, row:4, col:20},

    { id: 28, row:4, col:10},
    { id: 29, row:4, col:8},
    { id: 30, row:5, col:9},
    { id: 31, row:5, col:11},
    { id: 32, row:5, col:7},
    { id: 33, row:6, col:8},
    { id: 34, row:6, col:10},

    { id: 35, row:6, col:14},
    { id: 36, row:6, col:12},
    { id: 37, row:7, col:13},
    { id: 38, row:7, col:15},
    { id: 39, row:7, col:11},
    { id: 40, row:8, col:12},
    { id: 41, row:8, col:14},

    { id: 42, row:5, col:19},
    { id: 43, row:5, col:17},
    { id: 44, row:6, col:18},
    { id: 45, row:6, col:20},
    { id: 46, row:6, col:16},
    { id: 47, row:7, col:17},
    { id: 48, row:7, col:19},

    { id: 49, row:7, col:9},
    { id: 50, row:7, col:7},
    { id: 51, row:8, col:8},
    { id: 52, row:8, col:10},
    { id: 53, row:8, col:6},
    { id: 54, row:9, col:7},
    { id: 55, row:9, col:9},

    { id: 56, row:9, col:13},
    { id: 57, row:9, col:11},
    { id: 58, row:10, col:12},
    { id: 59, row:10, col:14},
    { id: 60, row:10, col:10},
    { id: 61, row:11, col:11},
    { id: 62, row:11, col:13},

    { id: 63, row:8, col:18},
    { id: 64, row:8, col:16},
    { id: 65, row:9, col:17},
    { id: 66, row:9, col:19},
    { id: 67, row:9, col:15},
    { id: 68, row:10, col:16},
    { id: 69, row:10, col:18},

    { id: 70, row:7, col:23},
    { id: 71, row:7, col:21},
    { id: 72, row:8, col:22},
    { id: 73, row:8, col:24},
    { id: 74, row:8, col:20},
    { id: 75, row:9, col:21},
    { id: 76, row:9, col:23},

    { id: 77, row:8, col:4},
    { id: 78, row:8, col:2},
    { id: 79, row:9, col:3},
    { id: 80, row:9, col:5},
    { id: 81, row:9, col:1},
    { id: 82, row:10, col:2},
    { id: 83, row:10, col:4},

    { id: 84, row:10, col:8},
    { id: 85, row:10, col:6},
    { id: 86, row:11, col:7},
    { id: 87, row:11, col:9},
    { id: 88, row:11, col:5},
    { id: 89, row:12, col:6},
    { id: 90, row:12, col:8},

    { id: 91, row:12, col:12},
    { id: 92, row:12, col:10},
    { id: 93, row:13, col:11},
    { id: 94, row:13, col:13},
    { id: 95, row:13, col:9},
    { id: 96, row:14, col:10},
    { id: 97, row:14, col:12},

    { id: 98, row:11, col:17},
    { id: 99, row:11, col:15},
    { id: 100, row:12, col:16},
    { id: 101, row:12, col:18},
    { id: 102, row:12, col:14},
    { id: 103, row:13, col:15},
    { id: 104, row:13, col:17},

    { id: 105, row:10, col:22},
    { id: 106, row:10, col:20},
    { id: 107, row:11, col:21},
    { id: 108, row:11, col:23},
    { id: 109, row:11, col:19},
    { id: 110, row:12, col:20},
    { id: 111, row:12, col:22},

    { id: 112, row:9, col:27},
    { id: 113, row:9, col:25},
    { id: 114, row:10, col:26},
    { id: 115, row:10, col:28},
    { id: 116, row:10, col:24},
    { id: 117, row:11, col:25},
    { id: 118, row:11, col:27},

    { id: 119, row:11, col:3},
    { id: 120, row:11, col:1},
    { id: 121, row:12, col:2},
    { id: 122, row:12, col:4},
    { id: 123, row:12, col:0},
    { id: 124, row:13, col:1},
    { id: 125, row:13, col:3},

    { id: 126, row:13, col:7},
    { id: 127, row:13, col:5},
    { id: 128, row:14, col:6},
    { id: 129, row:14, col:8},
    { id: 130, row:14, col:4},
    { id: 131, row:15, col:5},
    { id: 132, row:15, col:7},

    { id: 133, row:13, col:21},
    { id: 134, row:13, col:19},
    { id: 135, row:14, col:20},
    { id: 136, row:14, col:22},
    { id: 137, row:14, col:18},
    { id: 138, row:15, col:19},
    { id: 139, row:15, col:21},

    { id: 140, row:12, col:26},
    { id: 141, row:12, col:24},
    { id: 142, row:13, col:25},
    { id: 143, row:13, col:27},
    { id: 144, row:13, col:23},
    { id: 145, row:14, col:24},
    { id: 146, row:14, col:26},
];
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
    const color = (activeHexagon.includes(id) ? "mediumseagreen" : "black");

    return {id, x, y, width, height, points: points.join(' '), color};
});

export function sendCommandBlocks() {
    (async () => {
        return await Com.hitEndpoint($endpoint, nopRoute, $act_command);
    })().then(result => {
        if (result.hasOwnProperty('Failure')) {
            $message = result['Failure']['message']; 
            $is_success = false;
        } else {
            $message = "Sent Command Successfully";
            $is_success = true;
        }
        return result;
    }).catch(error => {
        $is_success = false;
        $message = error;
        activeHexagon = [];
        throw error;
    });
}

function findActiveHexagons(e) {
    const radius = Math.sqrt(3) * hexagonSideLength / 2;
    const radiusSquared = radius * radius;
    activeHexagon = [];
    let Xpos = e.offsetX;
    let Ypos = e.offsetY;
    for(var i = 0; i < drawableHexagons.length; i++) {
        const x = drawableHexagons[i].x;
        const y = drawableHexagons[i].y;
        for (let tp of tpCache) {
            if (isTouch) {
                Xpos = tp.clientX - boundRect.left;
                Ypos = tp.clientY - boundRect.top;
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
    buildCommandBlocks(activeHexagon);
    if (JSON.stringify(hexCache) != JSON.stringify(activeHexagon)) {
        if (activeHexagon.length != 0) {
            sendCommandBlocks();
        } 
    }
    hexCache = activeHexagon;
}

export async function AllOff() {
    let temp_OP = $command;
    $command = 0;
    sendCommandBlocks();
    $command = temp_OP;
}

function handleTouchStart(e) { 
    if (!is_overlay) {
    if(e.stopPropagation) e.stopPropagation();
    if(e.preventDefault) e.preventDefault();
    boundRect = target.getBoundingClientRect(); //This can cause dead spots in there is anything inside the hexagons (ex text) since it changes the target.
    mouseDown = true;
    clearInterval(resendCommand);
    clearTimeout(pendingTimeout);
    try {
        if (e.targetTouches.length > 0) {
            isTouch = true;
            for (let ttouch of e.targetTouches) {
                tpCache = [...tpCache, ttouch];
            }
        }
    } catch {tpCache = [0];}

    if (isTouch) {
        Xstart = e.targetTouches[0].clientX - boundRect.left;
        Ystart = e.targetTouches[0].clientY - boundRect.top;
    } else {
        Xstart = e.offsetX;
        Ystart = e.offsetY;
    }

    if(!isPreset && arraySize != "small") {
        findActiveHexagons(e);
        //Interval needs to be based on timing settings so it doesn't overwrite the previous command
        resendCommand = setInterval(() => {if($command >= 3){hexCache = [];} findActiveHexagons(e);}, $single_pulse_duration+$single_pulse_pause);
    }
    }
}

function handleTouchMove(e) {
    if (!is_overlay) {
    if(e.stopPropagation) e.stopPropagation();
    if(e.preventDefault) e.preventDefault();
    if(!mouseDown) {
        return;
    }
    tpCache = [];
    try{ 
        for (let ttouch of e.targetTouches) {
            tpCache = [...tpCache, ttouch];
        }
    } catch{tpCache = [0];}
    clearInterval(resendCommand);
    if(!isPreset && arraySize != "small") {
        findActiveHexagons(e);
        if (pendingTimeout) { 
            clearTimeout(pendingTimeout);
        }
        pendingTimeout = setTimeout(() => {resendCommand = setInterval(() => {if($command >= 3){hexCache = [];} findActiveHexagons(e);}, $single_pulse_duration+$single_pulse_pause)}, 50);
    }
    if (isTouch) {
        Xend = e.targetTouches[0].clientX - boundRect.left;
        Yend = e.targetTouches[0].clientY - boundRect.top;
    } else {
        Xend = e.offsetX;
        Yend = e.offsetY;
    }
    }
}

function handleTouchEnd(e) {
    if (!is_overlay) {
    if(e.stopPropagation) e.stopPropagation();
    if(e.preventDefault) e.preventDefault();
    if ($command > 3 ) hexCache = [];
    try{
        tpCache = [...tpCache.filter(tp => tp.identifier != e.changedTouches[0].identifier)];
        if (tpCache.length == 0) throw "No more Touches";
    } catch{
        tpCache = [];
        mouseDown = false;
        isTouch = false;
        activeHexagon = [];
        hexCache = [];
        clearInterval(resendCommand);
        clearTimeout(pendingTimeout);
        if ($command < 3) AllOff();
    }

    if (isPreset) {
        let temp = $command;
        if (presetName == "sweep") {
            if (deltaX > 0 && Math.abs(deltaY) < 75 ){
                    console.log('LR');
                    $command = 0x3a;//LR
                    display_preset("sweep-LR","hf");
            } else if (deltaX < 0 && Math.abs(deltaY) < 75) {
                    console.log('RL');
                    $command = 0x3b;//RL
                    display_preset("sweep-RL","hf");
            } else if (deltaY > 0 && Math.abs(deltaX) < 75) {
                    console.log('TB');
                    $command = 0x39;//LR
                    display_preset("sweep-TB","hf");
            } else if (deltaY < 0 && Math.abs(deltaX) < 75) { 
                    console.log('BT');
                    $command = 0x38;//RL
                    display_preset("sweep-BT","hf");
            } else if (deltaX > 0 && deltaY < 0) {
                    console.log('+45BT');
                    $command = 0x3f;
                    display_preset("sweep+45BT","hf");
            } else if (deltaX < 0 && deltaY > 0) {
                    console.log('+45TB');
                    $command = 0x3e;//+45tb
                    display_preset("sweep+45TB","hf");
            } else if (deltaX < 0 && deltaY < 0) {
                    console.log('-45BT');
                    $command = 0x3c;//-45bt
                    display_preset("sweep-45BT","hf");
            } else if (deltaX > 0 && deltaY > 0) {
                    console.log('-45TB');
                    $command = 0x3d;
                    display_preset("sweep-45TB","hf");
            }
        } else if (presetName == "FlashAll") {
            $command = 0x32;
            display_preset("flashall","single");
        }
        sendCommandBlocks(); //explosion /implosion 40/41
        $command = temp;
    }
    }
}

async function display_preset(name,timing) {
    // await sleep(50);
    for (let item of $preset_display) {
        if (name == item.name) {
            for (let a of item.array) {
                activeHexagon = a;
                if (timing === "single") {
                    await sleep($single_pulse_duration);
                    activeHexagon = [];
                    await sleep($single_pulse_pause);
                } else if(timing === "hf"){
                    await sleep($hfPeriod * ($hfDutyCycle/100));
                    activeHexagon = [];
                    await sleep($lfPeriod * ($lfDutyCycle/100));
                }
            }
        }
    }
    activeHexagon = [];
}

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

</script>

<Communication bind:this={Com} bind:nopRoute bind:success/>

    <!-- {#if arraySize == "normal"}
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
    {/if} -->

    <div class="hexagons">
        <svg version="1.0" xmlns="http://www.w3.org/2000/svg" bind:this={target} style={setStyle}
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
                        <!-- {#if (!arraySize || arraysize <= 1)}
                            <text id={`text-${hexagon.id}`} x={hexagon.x - 6} y={hexagon.y}>{hexagon.id}</text>
                        {/if} -->
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

<Moveable target={target} bind:this={moveable} className="moveable"
    rotatable={true} throttleRotate={0} rotatePosition="top"
    on:rotateStart={({ detail: {set}}) => {set(frame.rotate);}}
    on:rotate={({ detail: { target, beforeRotate }}) => {
        frame.rotate = beforeRotate;
        target.style.transform = `rotate(${beforeRotate}deg)`;
    }}
/>


<style>
    .hexagons {
        width: 100%;
        height: 100%;
        text-align: center;

        margin: 0em auto;
        /* margin-top: 3em; */
        padding: 0em;
    }
    svg {
        cursor: draggable;
    }
    :global(.moveable) {
        z-index: 10;
        display: none !important;
    }

</style>