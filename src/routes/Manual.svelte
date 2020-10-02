<script>
import { Router, Link, Route } from "svelte-routing";
import Hexagons from "../Utils/Hexagons.svelte";

// MARK: Message
export let test_ui = false;
$: pendingTimeout = false;
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
$: single_pulse_duration = 500; //low priority


$: single_pulse_block = [0,0,0,0];

$: hfOn = hfPeriod * (hfDutyCycle/100);
$: hf_block = [hfOn & 0x000000ff, (hfOn & 0x0000ff00) >> 8, hfPeriod & 0x000000ff,(hfPeriod & 0x0000ff00) >> 8];

$: lfOn = lfPeriod * (lfDutyCycle/100);
$: lf_block = [lfOn & 0x000000ff, (lfOn & 0x0000ff00) >> 8, lfPeriod & 0x000000ff, (lfPeriod & 0x0000ff00) >> 8];

function setTimingBlock(config) {
    if (config == "infer") {
        hfPeriod = 10;      
        lfPeriod = 0xff;
        lfDutyCycle = 100;
    } else if (config == "hideLF"){
        lfPeriod = 0xff;
        lfDutyCycle = 100;           
    }
}

// MARK: Device Input

let activeHexagon = -1;

let block0_31 = [0,0,0,0];
let block32_63 = [0,0,0,0];
let block64_95 = [0,0,0,0];
let block96_127 = [0,0,0,0];


//Leaving this reactive 
$: act_command = `{ "ActuatorsCommand": {
    "fabric_name": "${devices[activeDevice]}",
    "op_mode_block": {"act_cnt32":2, "act_mode":0, "op_mode":2},
    "actuator_mode_blocks": {
      "block0_31":{"b0": ${block0_31[0]}, "b1": ${block0_31[1]}, "b2": ${block0_31[2]}, "b3": ${block0_31[3]}},
      "block32_63":{"b0": ${block32_63[0]}, "b1": ${block32_63[1]}, "b2": ${block32_63[2]}, "b3": ${block32_63[3]}},
      "block64_95":{"b0": ${block64_95[0]}, "b1": ${block64_95[1]}, "b2": ${block64_95[2]}, "b3": ${block64_95[3]}},
      "block96_127":{"b0": ${block96_127[0]}, "b1": ${block96_127[1]}, "b2": ${block96_127[2]}, "b3": ${block96_127[3]}}},
    "timer_mode_blocks": {
      "single_pulse_block":{"b0":${single_pulse_block[0]}, "b1":${single_pulse_block[1]}, "b2":${single_pulse_block[2]}, "b3":${single_pulse_block[3]}},
      "hf_block":{"b0":${hf_block[0]}, "b1":${hf_block[1]}, "b2":${hf_block[2]}, "b3":${hf_block[3]}},
      "lf_block":{"b0":${lf_block[0]}, "b1":${lf_block[1]}, "b2":${lf_block[2]}, "b3":${lf_block[3]}}
    } } }`;


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
    block0_31 = [b0_0, b0_1, b0_2, b0_3];
    block32_63 = [b1_0, b1_1, b1_2, b1_3];
    block64_95 = [b2_0, b2_1, b2_2, b2_3];
    block96_127 = [b3_0, b3_1, b3_2, b3_3];

}

//Handles mouseEvents from hexgon component
function handleActuatorClick(e) {
    buildCommandBlocks(e.detail.value);
    (async () => {
        return await hitEndpoint(endpoint, nopRoute, act_command);
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

            <Link to="/"><button>Specify Timer Config</button></Link>
            <br/>
            <Link to="infer"><button>Infer Timer Config</button></Link>
            
            <Route path="/">
                <h3>Manually Specify Timing</h3>
                <div on:load="{setTimingBlock("hideLF")}"></div>
                <Link to="showLF"><button>Specify Low Frequency</button></Link>

                <label for="single_pulse">Single Pulse Duration: {single_pulse_duration} ms</label> <input type="range" bind:value={single_pulse_duration} min={10} max={1000}/>
                
                <label for="hfperiod">High Frequency Period: {hfPeriod} ms</label> <input type="range" bind:value={hfPeriod} min={10} max={1000}/>
                <label for="hfdutycycle">High Frequency Duty Cycle: {hfDutyCycle} %</label> <input type="range" bind:value={hfDutyCycle} min={0} max={100}/>
            </Route>
            <Route path="infer">
                <div on:load="{setTimingBlock("infer")}"></div>
                <h3>Infer Specify Timing</h3>

                <label for="intensity">Intensity: {hfDutyCycle} %</label> <input type="range" bind:value={hfDutyCycle} min={0} max={100}/>
            </Route>
            <Route path="showLF">
                <h3>Manually Specify Timing</h3>
                <Link to="specify"><button>Infer Low Frequency</button></Link>

                <label for="single_pulse">Single Pulse Duration: {single_pulse_duration} ms</label> <input type="range" bind:value={single_pulse_duration} min={10} max={1000}/>
                
                <label for="lfperiod">Low Frequency Period: {lfPeriod} ms</label> <input type="range" bind:value={lfPeriod} min={10} max={1000}/>
                <label for="lfdutycycle">Low Frequency Duty Cycle: {lfDutyCycle} %</label> <input type="range" bind:value={lfDutyCycle} min={0} max={100}/>
                
                <label for="hfperiod">High Frequency Period: {hfPeriod} ms</label> <input type="range" bind:value={hfPeriod} min={10} max={1000}/>
                <label for="hfdutycycle">High Frequency Duty Cycle: {hfDutyCycle} %</label> <input type="range" bind:value={hfDutyCycle} min={0} max={100}/>
                    
            </Route>
        </div>
        <Hexagons on:click={handleActuatorClick} on:message="{e => buildCommandBlocks(e.detail.value)}" bind:activeHexagon bind:test_ui/>

        {#if test_ui}
                <p>Test: {block0_31}, {block32_63}, {block64_95}, {block96_127}</p>
        {/if}
  </div>

</Router>

</main>

<style>
    .content-wrapper {
        margin: 0px auto;
    }

    .col-25 {
        width: 20%;
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

</style>

