<script>
import { Router, Link, Route } from 'svelte-routing';
import Devices from '../Utils/Devices.svelte';
import Hexagons from '../Utils/Hexagons.svelte';
import { message } from "../../stores/stores.js";

let hexActive;
let hexType;
let is_active = 0;

$: main_img = back_img;
let back_img = "images/back.png";
let chest_img = "images/chest.png";
let hand_img = "images/hand.png";
let shoulder_img = "images/shoulder.png";
let thigh_img = "images/thigh.png";
let upper_arm_img = "images/upper_arm.png";

</script>

<div>
    <div class='scroll-box'>
        <div class='option'>
            <!-- Option 0 is default -->
                <button class="button" style={"background-image:url("+back_img+");"} on:click={() => {main_img = back_img; is_active=0;}}>
                    {#if (is_active == 0)}
                        <Hexagons bind:activeHexagon={hexActive} bind:arrayType={hexType} arraySize="small" isPreset= true/>
                    {:else}
                        <Hexagons arraySize="small" isPreset= true/>
                    {/if}
                </button>
        </div>
        <div class='option' >
                <button class="button" style={"background-image:url("+upper_arm_img+");"} on:click={() => {main_img = upper_arm_img; is_active=1;}}>
                    {#if (is_active == 1)}
                        <Hexagons bind:activeHexagon={hexActive} bind:arrayType={hexType} arraySize="small" isPreset= true/>
                    {:else}
                        <Hexagons arraySize="small" isPreset= true/>
                    {/if}
                </button>
        </div>
        <div class='option' >
                <button class="button" style={"background-image:url("+chest_img+");"} on:click={() => {main_img = chest_img; is_active=2;}}>
                    {#if (is_active == 2)}
                        <Hexagons bind:activeHexagon={hexActive} bind:arrayType={hexType} arraySize="small" isPreset= true/>
                    {:else}
                        <Hexagons arraySize="small" isPreset= true/>
                    {/if}
                </button>
        </div>
        <div class='option' >
                <button class="button" style={"background-image:url("+thigh_img+");"} on:click={() => {main_img = thigh_img; is_active=3;}}>
                   {#if (is_active == 3)}
                        <Hexagons bind:activeHexagon={hexActive} bind:arrayType={hexType} arraySize="small" isPreset= true/>
                    {:else}
                        <Hexagons arraySize="small" isPreset= true/>
                    {/if}
                </button>
        </div>
        <div class='option' >
                <button class="button" style={"background-image:url("+hand_img+");"} on:click={() => {main_img = hand_img; is_active=4;}}>
                    {#if (is_active == 4)}
                        <Hexagons bind:activeHexagon={hexActive} bind:arrayType={hexType} arraySize="small" isPreset= true/>
                    {:else}
                        <Hexagons arraySize="small" isPreset= true/>
                    {/if}
                </button>
        </div>
        <div class='option' >
                <button class="button" style={"background-image:url("+shoulder_img+");"} on:click={() => {main_img = shoulder_img; is_active=5;}}> 
                    {#if (is_active == 5)}
                        <Hexagons bind:activeHexagon={hexActive} bind:arrayType={hexType} arraySize="small" isPreset= true/>
                    {:else}
                        <Hexagons arraySize="small" isPreset= true/>
                    {/if}
                </button>
        </div>
    </div>

    <div class="virtual-touch">
        <div class="button" style={"background-image:url("+main_img+"); background-size: 200% 200%;"}>
            <Hexagons bind:activeHexagon={hexActive} bind:arrayType={hexType}/>
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

        outline: none;
        /* outline-color: black;
        outline-width: .2em; */
    }

    .option{
        width: 100%;
        height: 30%;
        /* margin-top: 1em;
        margin-bottom: 1em; */
        outline: none;
        /* outline-color: black;
        outline-width: .3em; */
    }

    .button{
        width: 100%;
        height: 100%;
        background-color: white;
        background-size: 100% 100%;
        background-position: center; 
        background-repeat: no-repeat;
        color: white;
    }
    /* .button:focus{
        background-color: rgb(0, 183, 255);
    } */
     
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