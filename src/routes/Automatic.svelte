<script>
import { Router, Link, Route } from 'svelte-routing';
import Devices from '../Utils/Devices.svelte';
import Hexagons from '../Utils/Hexagons.svelte';
import { message } from "../../stores/stores.js";
import Status from '../Utils/Status.svelte';
import { onMount } from 'svelte';

let winSize = window.innerHeight/window.innerWidth;
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

let location_options = [{id: 0, hexType:"", size: null, top: 70, left: 50, main_top: 25, main_left: 0, style: "background-image:url("+back_img+");"},
                        {id: 1, hexType:"", size: null, top: 40, left: 60, main_top: 10, main_left: 10, style: "background-image:url("+upper_arm_img+");"},
                        {id: 2, hexType:"", size: null, top: 50, left: 50, main_top: 10, main_left: 0, style: "background-image:url("+chest_img+");"},
                        {id: 3, hexType:"", size: null, top: 30, left: 50, main_top: 5, main_left: 3, style: "background-image:url("+thigh_img+"); background-position: 10%; "},
                        {id: 4, hexType:"hand", size: null, top: 30, left: 50, main_top: 3, main_left: 2, style: "background-image:url("+hand_img+");"},
                        {id: 5, hexType:"", size: null, top: 50, left: 50, main_top: 30, main_left: 0, style: "background-image:url("+shoulder_img+");"},];
                        
                                                
$: main_obj = location_options[0];

let preset_options = [{id:"Manual", label:"Manual"},
                      {id:"FlashAll", label:"Flash All"}, 
                      {id:"sweep", label:"Sweep"}, 
                      {id:"ABCs", label:"ABCs"}];

function handleClickOption(obj) {
    usePreset = false;
    if (lastPreset) {
        lastPreset.style = "";
        lastPreset = document.getElementById("Manual");
        lastPreset.style =  "border: .2em solid blue;";
    }
    main_obj = obj;
    is_active = obj.id;
    hexType = obj.hexType;
}

function setPreset(name) {
    presetName = name;
    let element = document.getElementById(name);
    if (lastPreset) {lastPreset.style = "";}
    if (name === "Manual") {
        element.style =  "border: .2em solid blue;";
        usePreset = false;
        lastPreset = element;
    }
    if (lastPreset == element) {
        usePreset = false;
        element = document.getElementById("Manual");
        element.style =  "border: .2em solid blue;";
        lastPreset = element;
    } else if(name !== "Manual") {
        usePreset = true;
        element.style =  "border: .2em solid blue;";
        lastPreset = element;
    }
}

onMount(() => {
    lastPreset = document.getElementById("Manual");
    lastPreset.style = "border: .2em solid blue;";
});
</script>
<Status/>
<Router>
    <div class="scroll-box">
        {#each location_options as option}
            <button id={option.id} class="op-button" style={option.style+"position: relative; height: "+100/(location_options.length)+"%;"} on:click={() => handleClickOption(option)}>
            <div style={"position: absolute; top: "+option.top+"%; left: "+option.left+"%;transform:translate(-50%,-50%);"}>
                    {#if (is_active == option.id)}
                        <Hexagons bind:activeHexagon={hexActive} arrayType={option.hexType} arraySize=10 isPreset= true/>
                    {:else}
                        <Hexagons arrayType={option.hexType} arraySize=10 isPreset= true/>
                    {/if}
                </div>
            </button>
        {/each}
    </div>

    <div class="virtual-touch" >
        <div class="op-button" style={"position: relative;"+main_obj.style+"background-size: 200% 200%;"}>
            <div style={"position: absolute; top: "+main_obj.top+"%; left: "+main_obj.left+"%; transform:translate(-50%,-50%);"}>
                <Hexagons bind:activeHexagon={hexActive} bind:arrayType={hexType} arraySize={main_obj.size} presetName={presetName} isPreset={usePreset}/>
            </div>
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
        margin-left: 0%;
        margin-right: 0%;

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
        background-size: 170% 100%;
        background-position: center; 
        background-repeat: no-repeat;
        color: black;
        margin: 0em;
    }
    .virtual-touch{
        
        width: 75%;
        height: 90%;

        display: inline-block;
        vertical-align: top;
        text-align: center;
        margin: 0em;
        padding: 1em;
    }
</style>