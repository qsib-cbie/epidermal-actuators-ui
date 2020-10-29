<script>
import { Router, Link, Route } from "svelte-routing";
import { lf_block, hf_block, single_pulse_block, message, devices, activeDevice } from "../../stores/stores";
import Communication from "../Utils/Communication.svelte";
import Devices from "../Utils/Devices.svelte";
import Hexagons from "../Utils/Hexagons.svelte";

// MARK: Message
let Com;
let endpoint;
let nopRoute = '';
let success = '{ "Success": { } }';


// MARK: Server Configuration

$: hostname = "localhost";
$: port = "8088";
$: route = "api_index";

$: connectionAttempt = (async () => {
    return await Com.hitEndpoint(endpoint, nopRoute, success);
})().then(() => {
    $message = "Connection Established";
    });


// MARK: Antenna Configuration
// Add a feature to stop the RF field.

$: rfPower = 4;
$: activeRfPower = 0;
$: configuring = false;
$: antennaButtonDisabled = configuring || rfPower == activeRfPower;
$: antennaButtonMessage = "Configure";
$: rf_command = `{ "SetRadioFreqPower": { "power_level": ${rfPower}} }`
const reset_command = '{ "SystemReset": { } }';

$: configureAttempt = {};
//Need system reset after sending this command?
function handleClickRfPower() {
    configureAttempt = (async () => {
        configuring = true;
        antennaButtonMessage = "Configuring ...";
        return await Com.hitEndpoint(endpoint, nopRoute, rf_command);
    })().then(result => {
        configuring = false;
        activeRfPower = rfPower;
        antennaButtonMessage = "Configure";
        (async () => {
            $message = "Restarting System ...";
            return await Com.hitEndpoint(endpoint, nopRoute, reset_command);
        })().then(result => {
            $message = "System Reset Complete"
            $devices = [];
            $activeDevice = 0;
            return result;
        }).catch(error => {
            $message = error;
            throw error;
        });
        return result;
    }).catch(error => {
        $message = error;
        configuring = false;
        antennaButtonMessage = "Re-attempt Configure";
        throw error;
    });
    
}



// MARK: Speciy Timer Config

$: lfPeriod = 500;
$: lfDutyCycle = 50;
$: hfPeriod = 250;
$: hfDutyCycle = 50;
$: single_pulse_duration = 500; //low priority


$: $single_pulse_block = [0,0,0,0];

$: hfOn = hfPeriod * (hfDutyCycle/100);
$: $hf_block = [hfOn & 0x000000ff, (hfOn & 0x0000ff00) >> 8, hfPeriod & 0x000000ff,(hfPeriod & 0x0000ff00) >> 8];

$: lfOn = lfPeriod * (lfDutyCycle/100);
$: $lf_block = [lfOn & 0x000000ff, (lfOn & 0x0000ff00) >> 8, lfPeriod & 0x000000ff, (lfPeriod & 0x0000ff00) >> 8];

function setTimingBlock(config) {
    if (config == "infer") {
        hfPeriod = 10;      
        lfPeriod = 0xffff;
        lfDutyCycle = 100;
    } else if (config == "hideLF"){
        lfPeriod = 0xffff;
        lfDutyCycle = 100;           
    }
}


</script>

<main>
<Communication bind:this={Com} bind:endpoint bind:nopRoute bind:success bind:hostname bind:port bind:route/>
<Router>

    <div class='content-wrapper'>

        <div class='col-25'>
            <h1>Manual Actuation</h1>
            <h2>Messages</h2>
            <p>{$message}</p>

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
            <Devices />

        </div>
        
        <div class='col-25'>
            <br/><br/><br/>
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
                <Link to="/"><button>Infer Low Frequency</button></Link>

                <label for="single_pulse">Single Pulse Duration: {single_pulse_duration} ms</label> <input type="range" bind:value={single_pulse_duration} min={10} max={1000}/>
                
                <label for="lfperiod">Low Frequency Period: {lfPeriod} ms</label> <input type="range" bind:value={lfPeriod} min={10} max={1000}/>
                <label for="lfdutycycle">Low Frequency Duty Cycle: {lfDutyCycle} %</label> <input type="range" bind:value={lfDutyCycle} min={0} max={100}/>
                
                <label for="hfperiod">High Frequency Period: {hfPeriod} ms</label> <input type="range" bind:value={hfPeriod} min={10} max={1000}/>
                <label for="hfdutycycle">High Frequency Duty Cycle: {hfDutyCycle} %</label> <input type="range" bind:value={hfDutyCycle} min={0} max={100}/>
                    
            </Route>
        </div>
        <Hexagons/>

        
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

</style>

