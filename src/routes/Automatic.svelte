<script>
import { Router, Link, Route } from 'svelte-routing';
import Devices from '../Utils/Devices.svelte';
import Hexagons from '../Utils/Hexagons.svelte';
import { message } from "../../stores/stores.js";

let op1Active;
let op1Type;
let op2Active;
let op2Type;
let op3Active;
let op3Type;
let op4Active;
let op4Type = "thermal";

let numArray = 1;
let array = [{id:0, name:"original"}];

let back_img = "images/back.png";
let hand_img = "images/hand.png";
let shoulder_img = "images/shoulder.png";
let thigh_img = "images/thigh.png";

function handleAddActuators() { 
    array[numArray] = {id: numArray, name: "array "+numArray.toString(), type: "stich"};
    numArray++;
}

</script>

<Router>
    <div class="col-25">
        <h1>Automatic</h1>
        <h2>Messages</h2>
        <p>{$message}</p>
        <Devices />
        <button on:click={handleAddActuators}>Add Actuators</button>
    </div>
    <div class='scroll-box'>
        <div class='option'>
            <!-- Option 1 is default -->
            <Link to="/">
                <button class="button" style={"background-image:url("+back_img+");"}>
                    <Hexagons bind:activeHexagon={op1Active} bind:arrayType={op1Type} arraySize="small" isPreset = true/>
                </button>
            </Link>
        </div>
        <div class='option'>
            <Link to="OP2">
                <button class="button" style={"background-image:url("+hand_img+");"}>
                    <Hexagons bind:activeHexagon={op2Active} bind:arrayType={op2Type} arraySize="small" isPreset = true orientation="vertical"/>
                </button>
            </Link> 
        </div>
        <div class='option'>
            <Link to="OP3">
                <button class="button" style={"background-image:url("+shoulder_img+");"}>
                    <Hexagons bind:activeHexagon={op3Active} bind:arrayType={op3Type} arraySize="small" isPreset = true/>
                </button>
            </Link>
        </div>
        <div class='option'>
            <Link to="OP4">
                <button class="button" style={"background-image:url("+thigh_img+");"}>
                    <Hexagons bind:activeHexagon={op4Active} bind:arrayType={op4Type}  arraySize="small" isPreset = true/>
                </button>
            </Link>
        </div>
    </div>

    <Route path="/">
        <div class="col-50">
            <Hexagons bind:activeHexagon={op1Active} bind:arrayType={op1Type}/>
        </div>
    </Route>
    <Route path="OP2">
        <div class="col-50">
            <Hexagons bind:activeHexagon={op2Active} bind:arrayType={op2Type} orientation="vertical"/>
        </div>
    </Route>
    <Route path="OP3">
        <div class="col-50">
            <Hexagons bind:activeHexagon={op3Active} bind:arrayType={op3Type}/>
        </div>
    </Route>
    <Route path="OP4">
        <div class="col-50">
            <Hexagons bind:activeHexagon={op4Active} bind:arrayType={op4Type} />
        </div>
    </Route>
</Router>


<style>
    .scroll-box{
        width: 15%;
        height: 50em;

        padding: 1em;
        margin: .5em;

        display: inline-block;
        vertical-align: top;
        overflow: auto;

        outline: solid;
        outline-color: black;
        outline-width: .4em;
    }

    .option{
        width: 100%;
        height: 30%;
        margin-top: 1em;
        margin-bottom: 1em;
        outline: solid;
        outline-color: black;
        outline-width: .3em;
    }

    .button{
        width: 100%;
        height: 100%;
        background-color: rgb(0, 119, 255);
        background-size: 150% 150%;
        background-position: center; 
        background-repeat: no-repeat;
        color: white;
    }
    .button:focus{
        background-color: rgb(0, 183, 255);
    }
    
    .col-25 {
        width: 15%;
        height: 100%;

        display: inline-block;
        vertical-align: top;

        margin: 0px auto;
        padding: 1em;
    } 
    .col-50 {
        width: 50%;
        height: 100%;

        display: inline-block;
        vertical-align: middle;

        margin: 0em auto;
        padding: 1em;
    }
</style>