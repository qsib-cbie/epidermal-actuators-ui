<script>
import { Router, Link, Route } from "svelte-routing";

// MARK: Message

$: message = 'starting ...';
$: message = message.toUpperCase();

// MARK: Server Configuration

$: hostname = "localhost";
$: port = "8088";
$: route = "api_index";
$: endpoint = `http://${hostname}:${port}/${route}`;

const nopRoute = '';
const success = '{ "Success": { } }';

const hitEndpoint = async (endpoint, route, body) => {
    const response = await fetch(endpoint + route, { method: 'POST', body});
    const result = await response.json();
    message = JSON.stringify(result);
    return message;
}

$: connectionAttempt = (async () => {
    antennaButton.disabled = false;
    antennaButton.message = "Configure";
    return await hitEndpoint(endpoint, nopRoute, success);
})()

// MARK: Antenna Configuration

$: rfPower = 4;
$: antennaButton = { disabled: false, message: "Configure" };

function handleClickRfPower() {
    (async () => {
        antennaButton.disabled = true;
        antennaButton.message = "Configuring ...";
        return await hitEndpoint(endpoint, nopRoute, success);
    })().then(() => {
        antennaButton.disabled = true;
        antennaButton.message = "Configured";
    }).catch(error => {
        message = error;
        antennaButton.disabled = false;
        antennaButton.message = "Re-attempt Configure";
    });
}

// MARK: Addressable Devices

$: newDevice = "Device0";
$: deviceButtonMessage = "Find";
$: deviceButtonDisabled = devices.includes(newDevice);
$: activeDevice = 0;
$: devices = [ ];

function handleClickDevice() {
    (async () => {
        deviceButtonMessage = "Searching ...";
        return await hitEndpoint(endpoint, nopRoute, success);
    })().then(() => {
        devices.push(newDevice);
        devices = devices;
        deviceButtonMessage = "Find";
    }).catch(error => {
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

$: rangeValue = 50;
$: console.log(rangeValue);

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
            <button on:click={handleClickRfPower} disabled={antennaButton.disabled}> {antennaButton.message} </button>

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
            <ul>
                <li><Link to="specify">Specify Timer Config</Link></li>
                <li><Link to="infer">Infer Timer Config</Link></li>
            </ul>

            <Route path="specify">

                <label for="rangevalue">Range Value</label> <input type="range" bind:value={rangeValue} min={1} max={100}/>

                <p>
                I did something cool today. Lorem ipsum dolor sit amet, consectetur 
                adipisicing elit. Quisquam rerum asperiores, ex animi sunt ipsum. Voluptas 
                sint id hic. Vel neque maxime exercitationem facere culpa nisi, nihil 
                incidunt quo nostrum, beatae dignissimos dolores natus quaerat! Quasi sint 
                praesentium inventore quidem, deserunt atque ipsum similique dolores maiores
                expedita, qui totam. Totam et incidunt assumenda quas explicabo corporis 
                eligendi amet sint ducimus, culpa fugit esse. Tempore dolorum sit 
                perspiciatis corporis molestias nemo, veritatis, asperiores earum! 
                Ex repudiandae aperiam asperiores esse minus veniam sapiente corrupti 
                alias deleniti excepturi saepe explicabo eveniet harum fuga numquam 
                nostrum adipisci pariatur iusto sint, impedit provident repellat quis?
                </p>
            </Route>
            <Route path="infer">
                <p>
                I did something awesome today. Lorem ipsum dolor sit amet, consectetur 
                adipisicing elit. Repudiandae enim quasi animi, vero deleniti dignissimos 
                sapiente perspiciatis. Veniam, repellendus, maiores.
                </p>
            </Route>
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

