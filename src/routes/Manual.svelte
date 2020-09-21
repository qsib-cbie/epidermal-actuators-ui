<script>
import { Router, Link, Route } from "svelte-routing";

// MARK: Message

$: message = 'starting ...';
// $: message = message.toUpperCase();

const nopRoute = '';
const success = '{ "Success": { } }';

const hitEndpoint = async (endpoint, route, body) => {
    const response = await fetch(endpoint + route, { method: 'POST', body});
    const result = await response.json();
    message = JSON.stringify(result);
    return message;
}

// MARK: Server Configuration

$: hostname = "localhost";
$: port = "8088";
$: route = "api_index";
$: endpoint = `http://${hostname}:${port}/${route}`;

$: connectionAttempt = (async () => {
    return await hitEndpoint(endpoint, nopRoute, success);
})();

// MARK: Antenna Configuration

$: rfPower = 4;
$: activeRfPower = 0;
$: configuring = false;
$: antennaButtonDisabled = configuring || rfPower == activeRfPower;
$: antennaButtonMessage = "Configure";

$: configureAttempt = {};

function handleClickRfPower() {
    configureAttempt = (async () => {
        configuring = true;
        antennaButtonMessage = "Configuring ...";
        return await hitEndpoint(endpoint, nopRoute, success);
    })().then(result => {
        configuring = false;
        activeRfPower = rfPower;
        antennaButtonMessage = "Configure";
        return result;
    }).catch(error => {
        message = error;
        configuring = false;
        antennaButtonMessage = "Re-attempt Configure";
        throw error;
    });
}

// MARK: Addressable Devices

$: newDevice = "Device0";
$: searching = false;
$: deviceButtonDisabled = searching || devices.includes(newDevice);
$: deviceButtonMessage = "Find";
$: activeDevice = 0;
$: devices = [ ];

function handleClickDevice() {
    (async () => {
        searching = true;
        deviceButtonMessage = "Searching ...";
        return await hitEndpoint(endpoint, nopRoute, success);
    })().then(() => {
        searching = false;
        devices.push(newDevice);
        devices = devices;
        deviceButtonMessage = "Find";
    }).catch(error => {
        searching = false;
        message = error;
        deviceButtonMessage = "Re-attempt Search";
    });
}

function handleClickRemove(idx) {
    return () => {
        if(idx <= activeDevice && activeDevice != 0) {
            activeDevice -= 1
        }
        devices.splice(idx, 1);
        devices = devices;
    }
}

function handleClickActive(idx) {
    return () => {
        activeDevice = idx;
    }
}

// MARK: Speciy Timer Config

$: lfPeriod = 500;
$: lfDutyCycle = 50;
$: hfPeriod = 250;
$: hfDutyCycle = 50;

$: intensity = 100;

// MARK: Device Input

$: activeHexagon = -1;
$: mouseDown = false;
$: pendingTimeout = false;

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
    return {
    id,
    row,
    col,
    x: (globalPadding / 2) + (col/2 + .5) * width + Math.max((col / 2) * horizontalSpacing, 0),
    y: (globalPadding / 2) + ((row/2) * 1.5 + .5) * height + Math.max((row / 2) * verticalSpacing, 0),
    }
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
            (async () => {
               return await hitEndpoint(endpoint, nopRoute, success);
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

function handleMouseDown(event) { handleTouchStart(event); }
function handleMouseMove(event) { handleTouchMove(event); }
function handleMouseUp(event) { handleTouchEnd(event); }

</script>

<main>

<Router>
    <h1>Manual Actuation</h1>

    <div class='content-wrapper'>
        <div class='col-25'>
            <h2>Messages</h2>
            <p>{message}</p>

            <h2>Server Configuration</h2>

            <label for="hostname"> Hostname </label> <input bind:value={hostname} />
            <label for="port"> Port </label> <input bind:value={port} />
            <label for="route"> Route </label> <input bind:value={route} />

            {#await connectionAttempt }
                <p>attempting connection ...</p>
            {:then data }
                <p class="success">SUCCESS</p>
            {:catch error }
                <p class="failure">FAILURE: {error} </p>
            {/await}

            <h2>Antenna Configuration</h2>

            <label for="rfPower">RF Power (W)</label> <input bind:value={rfPower} />
            <button on:click={handleClickRfPower} disabled={antennaButtonDisabled}> {antennaButtonMessage} </button>

            {#await configureAttempt }
                <p>attempting configuration ...</p>
            {:then data }
                {#if activeRfPower != 0}
                    <p class="success">SUCCESS</p>
                {/if}
            {:catch error }
                <p class="failure">FAILURE: {error} </p>
            {/await}

            <h2>Addressable Devices</h2>

            <label for="device">Device </label> <input bind:value={newDevice} />
            <button on:click={handleClickDevice} disabled={deviceButtonDisabled}> {deviceButtonMessage} </button>

            {#if devices.length > 0 }
                <p> Active Device: {devices[activeDevice]} </p>
            {:else}
                <p> No addressable device to activate </p>
            {/if}

            <ul>
                {#each devices as device, idx}
                    <li class="device">{device}
                        <button on:click={handleClickRemove(idx)}> Remove </button>
                        {#if activeDevice != idx}
                            <button on:click={handleClickActive(idx)}> Make Active </button>
                        {/if}
                    </li>
                {/each}
            </ul>
        </div><div class='col-25'>
            <h2>Timer Configuration</h2>

            <Link to="specify">Specify Timer Config</Link>
            <br/>
            <Link to="infer">Infer Timer Config</Link>

            <Route path="specify">
                <h3>Manually Specify Timing</h3>

                <label for="lfperiod">Low Frequency Period: {lfPeriod} ms</label> <input type="range" bind:value={lfPeriod} min={10} max={1000}/>
                <label for="lfdutycycle">Low Frequency Duty Cycle: {lfDutyCycle} %</label> <input type="range" bind:value={lfDutyCycle} min={0} max={100}/>

                <label for="hfperiod">High Frequency Period: {hfPeriod} ms</label> <input type="range" bind:value={hfPeriod} min={10} max={1000}/>
                <label for="hfdutycycle">High Frequency Duty Cycle: {hfDutyCycle} %</label> <input type="range" bind:value={hfDutyCycle} min={0} max={100}/>
            </Route>
            <Route path="infer">
                <h3>Infer Specify Timing</h3>

                <label for="intensity">Intensity: {intensity} %</label> <input type="range" bind:value={intensity} min={0} max={100}/>
            </Route>
        </div>
        <div class='col-50'>
            <h2>Device Input</h2>

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
                          strokeWidth="5px"
                          strokeLinejoin="miter"
                          transform={`rotate(0 ${hexagon.x} ${hexagon.y}) translate(${hexagon.x - (hexagon.width / 2)} ${hexagon.y - (hexagon.height / 2)})`}
                          points={hexagon.points} />
                          <text id={`text-${hexagon.id}`} x={hexagon.x - 6} y={hexagon.y}>{hexagon.id}</text>
                      </g>
                {/each}
            </svg>
        </div>
  </div>

</Router>

</main>

<style>
    .content-wrapper {
        margin: 0px auto;
    }

    .col-25 {
        width: 25%;
        height: 100%;

        display: inline-block;
        vertical-align: top;

        margin: 0px auto;
        padding: 1em;
    }

    .col-50 {
        width: 40%;
        height: 100%;

        display: inline-block;
        vertical-align: top;

        margin: 0px auto;
        padding: 1em;
    }

    p.success {
        color: green;
        font-size: medium;
    }

    p.failure {
        color: maroon;
        font-size: medium;
    }

    li.device {
        margin: 1em;
    }

    svg {
        cursor: draggable;
    }

</style>

