<script>
import { Router, Link, Route } from 'svelte-routing';
import Devices from '../Utils/Devices.svelte';
import Hexagons from '../Utils/Hexagons.svelte';
import { message } from "../../stores/stores.js";

let hexActive;
let hexType;
let is_active = 0;
let numOptions = 6;
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

function handleClickOption(img, num) {
    usePreset = false;
    if (lastPreset) {
        lastPreset.style = "";
        lastPreset = null;
    }
    main_img = img;
    is_active = num;
}

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

    <div class="scroll-box" >
        <div class="option" style={"height: "+100/numOptions+"%"}>
            <!-- Option 0 is default -->
                <button class="op-button" style={"background-image:url("+back_img+");"} on:click={() => handleClickOption(back_img, 0)}>
                    {#if (is_active == 0)}
                        <Hexagons bind:activeHexagon={hexActive} bind:arrayType={hexType} arraySize="small" isPreset= true/>
                    {:else}
                        <Hexagons arraySize="small" isPreset= true/>
                    {/if}
                </button>
        </div>
        <div class="option" style={"height: "+100/numOptions+"%"}>
                <button class="op-button" style={"background-image:url("+upper_arm_img+");"} on:click={() => handleClickOption(upper_arm_img, 1)}>
                    {#if (is_active == 1)}
                        <Hexagons bind:activeHexagon={hexActive} bind:arrayType={hexType} arraySize="small" isPreset= true/>
                    {:else}
                        <Hexagons arraySize="small" isPreset= true/>
                    {/if}
                </button>
        </div>
        <div class="option" style={"height: "+100/numOptions+"%"}>
                <button class="op-button" style={"background-image:url("+chest_img+");"} on:click={() => handleClickOption(chest_img, 2)}>
                    {#if (is_active == 2)}
                        <Hexagons bind:activeHexagon={hexActive} bind:arrayType={hexType} arraySize="small" isPreset= true/>
                    {:else}
                        <Hexagons arraySize="small" isPreset= true/>
                    {/if}
                </button>
        </div>
        <div class="option" style={"height: "+100/numOptions+"%"}>
                <button class="op-button" style={"background-image:url("+thigh_img+");"} on:click={() => handleClickOption(thigh_img, 3)}>
                   {#if (is_active == 3)}
                        <Hexagons bind:activeHexagon={hexActive} bind:arrayType={hexType} arraySize="small" isPreset= true/>
                    {:else}
                        <Hexagons arraySize="small" isPreset= true/>
                    {/if}
                </button>
        </div>
        <div class="option" style={"height: "+100/numOptions+"%"}>
                <button class="op-button" style={"background-image:url("+hand_img+");"} on:click={() => handleClickOption(hand_img, 4)}>
                    {#if (is_active == 4)}
                        <Hexagons bind:activeHexagon={hexActive} bind:arrayType={hexType} arraySize="small" isPreset= true/>
                    {:else}
                        <Hexagons arraySize="small" isPreset= true/>
                    {/if}
                </button>
        </div>
        <div class="option" style={"height: "+100/numOptions+"%"}>
                <button class="op-button" style={"background-image:url("+shoulder_img+");"} on:click={() => handleClickOption(shoulder_img, 5)}> 
                    {#if (is_active == 5)}
                        <Hexagons bind:activeHexagon={hexActive} bind:arrayType={hexType} arraySize="small" isPreset= true/>
                    {:else}
                        <Hexagons arraySize="small" isPreset= true/>
                    {/if}
                </button>
        </div>
    </div>

    <div class="virtual-touch" >
        <div class="op-button" style={"background-image:url("+main_img+"); background-size: 200% 200%;"}>
            <Hexagons bind:activeHexagon={hexActive} bind:arrayType={hexType} presetName={presetName} isPreset={usePreset}/>
        </div>
    </div>

    <div class="scroll-box">
        <div class="option" style={"height: "+100/6+"%"}>
            <button id="FlashAll" class="op-button" on:click={() => setPreset("FlashAll")}>
                Flash All
            </button>
        </div>
       <div class="option" style={"height: "+100/6+"%"}>
            <button id="sweep" class="op-button" on:click={() => setPreset("sweep")}>
                Sweep
            </button>
        </div>
        <div class="option" style={"height: "+100/6+"%"}>
            <button id="ABCs" class="op-button" on:click={() => setPreset("ABCs")}>
                ABCs
            </button>
        </div>
    </div>


<style>
    .scroll-box{
        width: 10%;
        height: 100%;

        padding: 0em;
        margin: 0em;
        margin-left: 2em;
        margin-right: 2em;

        display: inline-block;
        vertical-align: top;
    }

    .option{
        width: 100%;
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
        width: 70%;
        height: 90%;

        display: inline-block;
        vertical-align: top;
        text-align: center;
        margin: 0em;
        padding: 1em;
    }
</style>