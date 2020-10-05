<script>
import { Router, Link, Route } from 'svelte-routing';


import Devices from '../Utils/Devices.svelte';
import Hexagons from '../Utils/Hexagons.svelte';



</script>

<Router>
    <h1>Automatic</h1>
    <Devices />

    <div class='scroll-box'>
        <div class='option'>
            <!-- Option 1 is default -->
            <Link to="/"><button class="button">Option 1</button></Link>
        </div>
        <div class='option' >
            <Link to="OP2"><button class="button">Option 2</button></Link>
        </div>
        <div class='option' >
            <Link to="OP3"><button class="button">Option 3</button></Link>
        </div>
    </div>
    <Route path="/">
        <Hexagons/>
    </Route>

    <Route path="OP2">
        <Hexagons/>
    </Route>
    <Route path="OP3">
        <Hexagons/>
    </Route>
</Router>


<style>
    .scroll-box{
        width: 15%;
        height: 500px;

        padding: 1em;
        margin: 10px;

        display: inline-block;
        vertical-align: top;
        overflow: auto;

        outline: solid;
        outline-color: black;
        outline-width: 5px;
    }

    .option{
        width: 100%;
        height: 100px;
        /* margin: 5px; */
        margin-top: 10px;
        margin-bottom: 10px;
        outline: solid;
        outline-color: black;
        outline-width: 3px;
    }

    .button{
        width: 100%;
        height: 100%;
        /* background-image: url("../../img/preset_chest.png"); */
        background-color: white;
    }
    

</style>