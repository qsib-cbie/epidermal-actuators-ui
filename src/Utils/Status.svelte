<script>
import {is_success, is_connected} from "../../stores/stores.js"
</script>

<div style={"position: absolute; top: "+window.innerHeight*.80+"px; left: "+window.innerWidth*.75+"px;"}>   
    <div class="status">
        <h2>Status:  
            {#if $is_connected}
                <img id="green_power_icon" src="images/power_green.png" alt="Green Power Icon"/> 
            {:else}
                <img id="red_power_icon" src="images/power_red.png" alt="Red Power Icon"/> 
            {/if}
            {#if $is_success}
                <img  id="green_signal_icon" src="images/signal_green.png" alt="Green Signal Icon"/> 
            {:else}
                <img id="red_signal_icon" src="images/signal_red.png" alt="Red Signal Icon"/> 
            {/if}
        </h2>
    </div>
</div>
<style>
    .status{
        width: 9.5em;
    }
</style>