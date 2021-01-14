<script>
import { Router, Link, Route } from "svelte-routing";
import {
    message, devices, activeDevice, command, cmd_op, is_success, is_connected,
    hostname, port, route, endpoint,
    t_pulse, t_pause, ton_high, tperiod_high, ton_low, tperiod_low
} from "../../stores/stores";
import Communication from "../Utils/Communication.svelte";
import Devices from "../Utils/Devices.svelte";
import Hexagons from "../Utils/Hexagons.svelte";
import Status from "../Utils/Status.svelte";
import { onMount } from "svelte";

// MARK: Message
let Com;
let Hex;
let nopRoute = '';
let success = '{ "Success": { } }';
let configContent;

// MARK: Server Configuration
$: connectionAttempt = (async () => {
    return await Com.hitEndpoint($endpoint, nopRoute, success);
})().then(() => {
    $message = "Connection Established";
    $is_connected = true;
    });


// MARK: Antenna Configuration
// Add a feature to stop the RF field.
$: fieldState = 1; //defualt on
$: fieldStateString = fieldState === 1 ? "Off" : "On";
$: rfPower = 4;
$: activeRfPower = 0;
$: configuring = false;
$: antennaButtonDisabled = configuring || rfPower == activeRfPower;
$: antennaButtonMessage = "Configure";
$: rf_command = `{ "SetRadioFreqPower": { "power_level": ${rfPower}} }`
const reset_command = '{ "SystemReset": { } }';

$: configureAttempt = {};

function handleRfField(Com) {
    let stateString;
    if (fieldState) {
        console.log("Turn RF field OFF");
        fieldState = 0;
        stateString = "Off";
    } else {
        console.log("Turn RF field ON");
        fieldState = 1;
        stateString = "On";
    }
    let field_power_command = `{ "RfFieldState": { "state": ${fieldState} } }`;
    console.log(fieldState);
    console.log(field_power_command);
    (async () => {
        return await Com.hitEndpoint($endpoint, nopRoute, field_power_command);
    })().then(result => {
        $message = "Field is "+stateString;
    }).catch(error => {
        $message = error;
    });
}

function handleClickRfPower() {
    configureAttempt = (async () => {
        configuring = true;
        antennaButtonMessage = "Configuring ...";
        return await Com.hitEndpoint($endpoint, nopRoute, rf_command);
    })().then(result => {
        configuring = false;
        activeRfPower = rfPower;
        antennaButtonMessage = "Configure";
        (async () => {
            $message = "Restarting System ...";
            return await Com.hitEndpoint($endpoint, nopRoute, reset_command);
        })().then(result => {
            $message = "System Reset Complete"
            $is_success = true;
            $devices = [];
            $activeDevice = 0;
            return result;
        }).catch(error => {
            $is_success = false;
            $message = error;
            throw error;
        });
        return result;
    }).catch(error => {
        $is_success = false;
        $message = error;
        configuring = false;
        antennaButtonMessage = "Re-attempt Configure";
        throw error;
    });
}



// MARK: Speciy Timer Config


$: singlePulse = false;
$: {
    if(singlePulse) {
        $command = 0x04;
    } else {
        $command = 0x02;
    }
   }


onMount(() => {
    configContent.style.display = "block";
});
function handleCollapse() {
    if (configContent.style.display === "block") {
        configContent.style.display = "none";
    } else {
        configContent.style.display = "block";
    }
}

function handleSetTiming(Hex) {
    let temp = $cmd_op;
    $cmd_op = 0x00;
    Hex.sendCommandBlocks();
    $cmd_op = temp;
}
</script>

<main>
<Communication bind:this={Com} bind:nopRoute bind:success/>
<Status/>
<Router>
    <div class='content-wrapper'>
        <div class='col-25'>
            <button class="collapsible" on:click={handleCollapse}><h2><img id="serve_icon" src="images/server_icon.png" alt="Server Icon"/>  Server Configuration</h2></button>
            <div class="content" bind:this={configContent}>
            <label for="hostname"> Hostname </label> <input bind:value={$hostname} />
            <label for="port"> Port </label> <input bind:value={$port} />
            <label for="route"> Route </label> <input bind:value={$route} />

            {#await connectionAttempt }
                <p>attempting connection ...</p>
            {:then data }
                <p class="success">SUCCESS</p>
            {:catch error }
                <p class="failure">FAILURE: {error} </p>
            {/await}
            </div>
            <h2><img id="antenna_icon" src="images/antenna_icon.png" alt="Antenna Icon"/> Antenna Configuration</h2>
            <button on:click={handleRfField(Com)}>Turn RF Field {fieldStateString}</button>
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

        </div>

        <div class='col-25'>
            <Devices />

            <h2><img id="haptic_icon" src="images/haptic_icon.png" alt="Haptic Icon"/>Haptic Configuration</h2>
            <button on:click={Hex.AllOff()}>All Off</button>
            <button on:click={handleSetTiming(Hex)}>Set Timing</button>

            <label for="single_pulse"> Single Pulse Duration: {$t_pulse} ms </label> <input type="range" bind:value={$t_pulse} min={1} max={10000}/>
            <label for="single_pulse"> Pause After Pulse Duration: {$t_pause} ms </label> <input type="range" bind:value={$t_pause} min={0} max={10000}/>

            <label for="hfperiod">High Frequency Period: {$tperiod_high} ms</label> <input type="range" bind:value={$tperiod_high} min={1} max={1000}/>
            <label for="hfdutycycle">High Frequency Duty Cycle: {$ton_high} ({(100 * $ton_high / $tperiod_high).toFixed(2)}%)</label> <input type="range" bind:value={$ton_high} min={0} max={$tperiod_high}/>

            <label for="lfperiod">Low Frequency Period: {$tperiod_low} ms</label> <input type="range" bind:value={$tperiod_low} min={1} max={10000}/>
            <label for="lfdutycycle">Low Frequency Duty Cycle: {$ton_low} ms ({(100 * $ton_low / $tperiod_low).toFixed(2)}%)</label> <input type="range" bind:value={$ton_low} min={0} max={$tperiod_low}/>
        </div>
        <div class="col-25">
            <h2 style="text-align: center;"><img id="device_test_icon" src="images/device_test_icon.png" alt="Device Test Icon"/>  Device Test</h2>
            <div style="margin-top: 7em;">
                <Hexagons arrayType="test" arraySize=.5 bind:this={Hex}/>
            </div>
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

        margin: 0em 2em 2em 2em;
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

</style>

