<script>
import Communication from "./Communication.svelte";
import { activeDevice, devices, message } from "../../stores/stores"
import { onMount } from "svelte";

let Com;
let endpoint;
let nopRoute;
let success;
let content;
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
    })().then((result) => {
        searching = false;
        if (result.hasOwnProperty('Failure')){
            deviceButtonMessage = "Re-attempt Search";
            $message = result['Failure']['message'];
        }else{
            $message = "Connected to new Device"; 
            $devices = [...$devices, newDevice];
            deviceButtonMessage = "Find";
        }
    }).catch(error => {
        searching = false;
        $message = error;
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
            $message = "Removed Device";
        }).catch(error => {
            console.log(error);
            $message = error;
        });
    }
}

function handleClickActive(idx) {
    return () => {
        activeDevice.set(idx);
    }
}

onMount(() => {
    content.style.display = "block";
});
function handleCollapse() {
    if (content.style.display === "block") {
        content.style.display = "none";
    } else {
        content.style.display = "block";
    }
}
</script>

<Communication bind:this={Com} bind:endpoint bind:nopRoute bind:success/>

<button class="collapsible" on:click={handleCollapse}><h2>Addressable Devices</h2></button>
<div class="content" bind:this={content}>

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
</div>

<style>
    li.device {
        margin: 1em;
    }
    .collapsible {
        background-color:white;
        /* color:black; */
        padding: 0%;
        cursor: pointer;
        width: 100%;
        border: none;
        text-align: left;
        outline: none;
    }
    .collapsible:hover {
         background-color: #ccc;
    }
    .content {
        padding: 0%;
        overflow: hidden;
        background-color: white;
    }
</style>