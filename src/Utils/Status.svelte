<script>
import {is_success, is_connected} from "../../stores/stores.js"
</script>

<div style={"position: absolute; top: "+window.innerHeight*.75+"px; left: "+window.innerWidth*.70+"px;"}>   
    <div class="status">
        <h2>Status:  
            {#if $is_connected}
                <img class="status" id="green_power_icon" src="images/power_green.png" alt="Green Power Icon"/> 
            {:else}
                <img class="status" id="red_power_icon" src="images/power_red.png" alt="Red Power Icon"/> 
            {/if}
            {#if $is_success}
                <img class="status" id="green_signal_icon" src="images/signal_green.png" alt="Green Signal Icon"/> 
            {:else}
                <img class="status" id="red_signal_icon" src="images/signal_red.png" alt="Red Signal Icon"/> 
            {/if}
        </h2>
    </div>
</div>
<style>
    .status{
        width: auto;
    }
    img.status{
        height: auto;
		width: 7%;
    }

</style>