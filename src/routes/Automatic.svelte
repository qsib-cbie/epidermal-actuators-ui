<script>
import { Router, Link, Route } from 'svelte-routing';
import Hexagons from '../Utils/Hexagons.svelte';
import Status from '../Utils/Status.svelte';
import { onMount } from 'svelte';

let hexActive;
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
let manual_img = "images/manual_icon.png";
let spiral_img = "images/spiral_icon.png";
let int2_img = "images/2int_icon.png";
let sweep_img = "images/sweep_icon.png";
let arrow_img = "images/arrow_icon.png";
let abc_img = "images/abc_icon.png";


let location_options = [{id: 0, hexType:"back", rotation: 20, size: null, top: 60, left: 50, style: "background-image:url("+back_img+"); background-position: 50% 80%;"},
                        {id: 1, hexType:"", rotation: 0, size: null, top: 40, left: 60, style: "background-image:url("+upper_arm_img+");"},
                        {id: 2, hexType:"chest", rotation: 180, size: null, top: 60, left: 50, style: "background-image:url("+chest_img+");"},
                        {id: 3, hexType:"thigh", rotation: 0, size: null, top: 30, left: 50, style: "background-image:url("+thigh_img+"); background-position: 10% 10%;"},
                        {id: 4, hexType:"hand", rotation: 30, size: null, top: 30, left: 50, style: "background-image:url("+hand_img+"); background-position: 50% 30%;"},
                        {id: 5, hexType:"shoulder", rotation: 30, size: null, top: 50, left: 50, style: "background-image:url("+shoulder_img+");"},];
                        
                                                
$: main_obj = location_options[0];

let preset_options = [{id:"spiral", label:"", style:"background-image:url("+spiral_img+");"}, 
                      {id:"2intensity", label:"", style:"background-image:url("+int2_img+");"}, 
                      {id:"sweep", label:"", style:"background-image:url("+sweep_img+");"},
                      {id:"arrows", label:"", style:"background-image:url("+arrow_img+");"}, 
                      {id:"ABCs", label:"", style:"background-image:url("+abc_img+");"}];

function handleClickOption(obj) {
    usePreset = false;
    if (lastPreset) {
        lastPreset.style = "";
        lastPreset = document.getElementById("Manual");
        lastPreset.style =  "border: .2em solid blue;";
    }
    main_obj = obj;
    is_active = obj.id;
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
<div style="text-align:center; height:100%;">
    <div class="scroll-box">
        {#each location_options as option}
            <button id={option.id} class="op-button" style={option.style+"position: relative; height: "+100/(location_options.length)+"%;"} on:click={() => handleClickOption(option)}>
            <div style={"position: absolute; top: "+option.top+"%; left: "+option.left+"%;transform:translate(-50%,-50%);"}>
                    {#if (is_active == option.id)}
                        <Hexagons bind:activeHexagon={hexActive} arrayType={option.hexType} orientation={option.rotation} arraySize={10} is_overlay={true};/>
                    {:else}
                        <Hexagons arrayType={option.hexType} orientation={option.rotation} arraySize={10} is_overlay={true}/>
                    {/if}
                </div>
            </button>
        {/each}
    </div>

    <div class="virtual-touch" >
        <div class="op-button" style={"position: relative;"+main_obj.style+"background-size: 200% 200%;"}>
            <div style={"position: absolute; top: "+(main_obj.top)+"%; left: "+main_obj.left+"%; transform:translate(-50%,-50%);"}>
                <Hexagons bind:activeHexagon={hexActive} arrayType={main_obj.hexType} orientation={main_obj.rotation} arraySize={main_obj.size} presetName={presetName} isPreset={usePreset}/>
            </div>
        </div>
    </div>
    <div class="scroll-box">
        <div style="height: 20%;">
            <div class="option" style={"height: 70%"}>
                <h2 style="margin: 0em;">Live</h2>
                <div class="op-button" style={"background-image:url("+manual_img+"); background-size: 80%;"}>
                    <button id={"Manual"} class="option" on:click={() => setPreset("Manual")}/>
                </div>
            </div>    
        </div>
        <h2 style="margin: 0em;height:5%;">Presets</h2>
        <div class="scroll-box" style="width: 100%; height: 75%;">
            {#each preset_options as option}
                <div class="op-button" style={option.style+"height: "+100/(preset_options.length)+"%;background-size: 80%;"}>
                    <button id={option.id} class="option" on:click={() => setPreset(option.id)}>
                            {option.label}
                    </button>
                </div>    
            {/each}
        </div>
    </div>
</div>
<Status/>
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
        height:100%;
        padding:0em;
        margin:0em;
        background-color: transparent; 
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
        height: 100%;

        display: inline-block;
        vertical-align: top;
        text-align: center;
        margin: 0em;
        padding: 0em;
    }
</style>