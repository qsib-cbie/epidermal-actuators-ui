<script>
import Communication from "./Communication.svelte";
import { activeDevice, devices } from "../../stores/stores"

let Com;
let endpoint;
let nopRoute;
let success;
$: message = 'starting ...';
$: add_device_command = `{ "AddFabric": { "fabric_name": "${newDevice}" } }`;
$: remove_device_command = `{ "RemoveFabric": { "fabric_name": "${$devices[$activeDevice]}" } }`;
$: newDevice = "Device0";
$: searching = false;
$: deviceButtonDisabled = searching || $devices.includes(newDevice);
$: deviceButtonMessage = "Find";


function handleClickDevice() {
    (async () => {
        searching = true;
        deviceButtonMessage = "Searching ...";
        return await Com.hitEndpoint(endpoint, nopRoute, add_device_command);
    })().then(() => {
        searching = false;
        $devices = [...$devices, newDevice];
        deviceButtonMessage = "Find";
    }).catch(error => {
        searching = false;
        message = error;
        deviceButtonMessage = "Re-attempt Search";
    });
}

function handleClickRemove(idx) {
    return () => {
        (async () => {
            remove_device_command = `{ "RemoveFabric": { "fabric_name": "${$devices[idx]}" } }`
            return await Com.hitEndpoint(endpoint, nopRoute, remove_device_command);
        })().then(() => {
            if(idx <= $activeDevice && $activeDevice != 0) {
            activeDevice.update(n => n - 1)
            }
            $devices = $devices.filter(n => n !== $devices[idx]);    
        }).catch(error => {
            console.log(error);
            message = error;
        });
    }
}

function handleClickActive(idx) {
    return () => {
        activeDevice.set(idx);
    }
}
</script>

<Communication bind:this={Com} bind:endpoint bind:nopRoute bind:success bind:message/>

<h2>Addressable Devices</h2>

<label for="device">Device </label> <input bind:value={newDevice} />
<button on:click={handleClickDevice} disabled={deviceButtonDisabled}> {deviceButtonMessage} </button>

{#if $devices.length > 0 }
    <p> Active Device: {$devices[$activeDevice]} </p>
{:else}
    <p> No addressable device to activate </p>
{/if}

<ul>
    {#each $devices as device, idx}
        <li class="device">{device}
            <button on:click={handleClickRemove(idx)}> Remove </button>
            {#if $activeDevice != idx}
                <button on:click={handleClickActive(idx)}> Make Active </button>
            {/if}
        </li>
    {/each}
</ul>

<style>
    li.device {
        margin: 1em;
    }
</style>