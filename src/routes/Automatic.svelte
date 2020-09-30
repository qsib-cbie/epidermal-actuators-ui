<script>
    import {Router} from 'svelte-routing';
    import Hexagons from '../Utils/Hexagons.svelte';

    export let test_ui = false;
</script>

<Router>
    <h1>Automatic</h1>
    <Hexagons bind:test_ui/>
</Router>