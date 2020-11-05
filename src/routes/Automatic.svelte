<script>
import { Router, Link, Route } from 'svelte-routing';
import Devices from '../Utils/Devices.svelte';
import Hexagons from '../Utils/Hexagons.svelte';
import { message } from "../../stores/stores.js";

let numArray = 1;
let array = [{id:0, name:"original"}];

$: img1 = "images/preset_chest.png";

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
            <!-- Option 1 is default <div class="button" style="background-image:url({img1});"></div>  -->
            <Link to="/"><button style="width: 100%;
        height: 100%;
        background-image:url({img1});
        background-color: rgb(0, 119, 255);
        background-size: 100% 100%;
        background-position: center; 
        background-repeat: no-repeat;
        color: white;"><Hexagons arraySize="small" isPreset= true/></button></Link>
        </div>
        <div class='option' >
            <Link to="OP2"><button class="button">Option 2 </button></Link> 
            <!-- <Hexagons arraySize="small" orientation="vertical"/> -->
        </div>
        <div class='option' >
            <Link to="OP3"><button class="button">Option 3</button></Link>
        </div>
    </div>

    <Route path="/">
        <!-- backgroundAsset={img1} -->
        <div class="col-50">
            <Hexagons />
        </div>
    </Route>
    <Route path="OP2">
        <div class="col-50">
            <Hexagons orientation="vertical"/>
        </div>
        
    </Route>
    <Route path="OP3">
        <div class="col-50">
            <Hexagons />
        </div>
    </Route>
</Router>


<style>
    .scroll-box{
        width: 15%;
        height: 50em;

        padding: 1em;
        margin: 3em;

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
        background-image:url({img1});
        background-color: rgb(0, 119, 255);
        background-size: 100% 100%;
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