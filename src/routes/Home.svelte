<script>
    import {Link} from 'svelte-routing';
</script>

<style>
    main {
        max-width: 75%;
        text-align: center;
        margin: auto;
    }

    ul {
        text-align: left;
    }

</style>

<main>
    <h1>Epidermal Actuators</h1>

    <p> Welcome to the home page of the Epidermal VR actuators. This tool will help you manipulate actuator block fabrics to emulate the sensation of touch remotely</p>

    <p>Emulate remote sensations of touch for configurable fabrics and locations</p>

    <ul>
        <li> <Link to="manual">Manual</Link> configure connection and manually test devices </li>
        <li> <Link to="automatic">Automatic</Link> emulate touch with automatically inferred properties </li>
        <li> <Link to="prepared">Prepared Sequences</Link> prepare and visualize interaction routines to emulate remotely </li>
    </ul>

</main>