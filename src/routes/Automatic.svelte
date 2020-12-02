<script>
import { Router, Link, Route } from 'svelte-routing';
import Devices from '../Utils/Devices.svelte';
import Hexagons from '../Utils/Hexagons.svelte';
import { message } from "../../stores/stores.js";
import Status from '../Utils/Status.svelte';

let hexActive;
let hexType;
let is_active = 0;
let presetName;
let usePreset = false;
let lastPreset;

let back_img = "images/back.png";
let chest_img = "images/chest.png";
let hand_img = "images/hand.png";
let shoulder_img = "images/shoulder.png";
let thigh_img = "images/thigh.png";
let upper_arm_img = "images/upper_arm.png";

$: main_style = "background-image:url("+back_img+");";

let location_options = [ {id: 0, style: "background-image:url("+back_img+");"},
                {id: 1, style: "background-image:url("+upper_arm_img+");"},
                {id: 2, style: "background-image:url("+chest_img+");"},
                {id: 3, style: "background-image:url("+thigh_img+");"},
                {id: 4, style: "background-image:url("+hand_img+");"},
                {id: 5, style: "background-image:url("+shoulder_img+");"},];

let preset_options = [{id:"FlashAll", label:"Flash All"}, 
                      {id:"sweep", label:"Sweep"}, 
                      {id:"ABCs", label:"ABCs"}];

function handleClickOption(style, num) {
    usePreset = false;
    if (lastPreset) {
        lastPreset.style = "";
        lastPreset = null;
    }
    main_style = style;
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
<Status/>
<Router>
    <div class="scroll-box">
        {#each location_options as option}
            <div class="option" style={"height: "+100/(location_options.length)+"%"}>
                    <button class="op-button" style={option.style} on:click={() => handleClickOption(option.style, option.id)}>
                        {#if (is_active == option.id)}
                            <Hexagons bind:activeHexagon={hexActive} bind:arrayType={hexType} arraySize="small" isPreset= true/>
                        {:else}
                            <Hexagons arraySize="small" isPreset= true/>
                        {/if}
                    </button>
            </div>
        {/each}
    </div>

    <div class="virtual-touch" >
        <div class="op-button" style={""+main_style+"background-size: 200% 200%;"}>
            <Hexagons bind:activeHexagon={hexActive} bind:arrayType={hexType} presetName={presetName} isPreset={usePreset}/>
        </div>
    </div>

    <div class="scroll-box">
        {#each preset_options as option}
            <div class="option" style={"height: "+100/preset_options.length+"%"}>
                <button id={option.id} class="op-button" on:click={() => setPreset(option.id)}>
                    {option.label}
                </button>
            </div>    
        {/each}
    </div>
</Router>

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