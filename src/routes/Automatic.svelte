<script>
import { Router, Link, Route } from 'svelte-routing';
import Devices from '../Utils/Devices.svelte';
import Hexagons from '../Utils/Hexagons.svelte';
import { message } from "../../stores/stores.js";

let hexActive;
let hexType;
let is_active = 0;

let presetName;
let usePreset = false;
let lastPreset;

$: main_img = back_img;
let back_img = "images/back.png";
let chest_img = "images/chest.png";
let hand_img = "images/hand.png";
let shoulder_img = "images/shoulder.png";
let thigh_img = "images/thigh.png";
let upper_arm_img = "images/upper_arm.png";

function setPreset(name) {
    presetName = name;
    let element = document.getElementById(name);
    if (lastPreset) {lastPreset.style = "";}
    if (lastPreset == element) {
        usePreset = false;
        lastPreset = null;
    } else {
        usePreset = true;
        element.style =  "border: .2em solid blue;";
        lastPreset = element;
    }
}
</script>

<div>
    <div class='scroll-box'>
        <div class='option'>
            <!-- Option 0 is default -->
                <button class="op-button" style={"background-image:url("+back_img+");"} on:click={() => {main_img = back_img; is_active=0; usePreset=false; lastPreset.style = "";}}>
                    {#if (is_active == 0)}
                        <Hexagons bind:activeHexagon={hexActive} bind:arrayType={hexType} arraySize="small" isPreset= true/>
                    {:else}
                        <Hexagons arraySize="small" isPreset= true/>
                    {/if}
                </button>
        </div>
        <div class='option' >
                <button class="op-button" style={"background-image:url("+upper_arm_img+");"} on:click={() => {main_img = upper_arm_img; is_active=1; usePreset=false; lastPreset.style = "";}}>
                    {#if (is_active == 1)}
                        <Hexagons bind:activeHexagon={hexActive} bind:arrayType={hexType} arraySize="small" isPreset= true/>
                    {:else}
                        <Hexagons arraySize="small" isPreset= true/>
                    {/if}
                </button>
        </div>
        <div class='option' >
                <button class="op-button" style={"background-image:url("+chest_img+");"} on:click={() => {main_img = chest_img; is_active=2; usePreset=false; lastPreset.style = "";}}>
                    {#if (is_active == 2)}
                        <Hexagons bind:activeHexagon={hexActive} bind:arrayType={hexType} arraySize="small" isPreset= true/>
                    {:else}
                        <Hexagons arraySize="small" isPreset= true/>
                    {/if}
                </button>
        </div>
        <div class='option' >
                <button class="op-button" style={"background-image:url("+thigh_img+");"} on:click={() => {main_img = thigh_img; is_active=3; usePreset=false; lastPreset.style = "";}}>
                   {#if (is_active == 3)}
                        <Hexagons bind:activeHexagon={hexActive} bind:arrayType={hexType} arraySize="small" isPreset= true/>
                    {:else}
                        <Hexagons arraySize="small" isPreset= true/>
                    {/if}
                </button>
        </div>
        <div class='option' >
                <button class="op-button" style={"background-image:url("+hand_img+");"} on:click={() => {main_img = hand_img; is_active=4; usePreset=false; lastPreset.style = "";}}>
                    {#if (is_active == 4)}
                        <Hexagons bind:activeHexagon={hexActive} bind:arrayType={hexType} arraySize="small" isPreset= true/>
                    {:else}
                        <Hexagons arraySize="small" isPreset= true/>
                    {/if}
                </button>
        </div>
        <div class='option' >
                <button class="op-button" style={"background-image:url("+shoulder_img+");"} on:click={() => {main_img = shoulder_img; is_active=5; usePreset=false; lastPreset.style = "";}}> 
                    {#if (is_active == 5)}
                        <Hexagons bind:activeHexagon={hexActive} bind:arrayType={hexType} arraySize="small" isPreset= true/>
                    {:else}
                        <Hexagons arraySize="small" isPreset= true/>
                    {/if}
                </button>
        </div>
    </div>

    <div class="virtual-touch">
        <div class="op-button" style={"background-image:url("+main_img+"); background-size: 200% 200%;"}>
            <Hexagons bind:activeHexagon={hexActive} bind:arrayType={hexType} presetName={presetName} isPreset={usePreset}/>
        </div>
    </div>

    <div class="scroll-box">
        <div class="option">
            <button id="FlashAll" class="op-button" on:click={() => setPreset("FlashAll")}>
                Flash All
            </button>
        </div>
        <div class="option">
            <button id="sweep" class="op-button" on:click={() => setPreset("sweep")}>
                Sweep
            </button>
        </div>
        <div class="option">
            <button id="ABCs" class="op-button" on:click={() => setPreset("ABCs")}>
                ABCs
            </button>
        </div>
    </div>
</div>

<style>
    .scroll-box{
        width: 10%;
        height: 100%;

        padding: 0em;
        margin: 0em;

        display: inline-block;
        vertical-align: top;
        overflow: auto;
    }

    .option{
        width: 100%;
        height: 30%;
    }

    .op-button{
        width: 100%;
        height: 100%;
        background-color: white;
        background-size: 100% 100%;
        background-position: center; 
        background-repeat: no-repeat;
        color: black;
    }
    .virtual-touch{
        width: 75%;
        height: 100%;

        display: inline-block;
        vertical-align: middle;
        text-align: center;
        margin: 0em;
        padding: 1em;
    }
</style>