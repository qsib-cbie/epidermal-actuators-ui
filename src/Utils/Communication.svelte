<script>
$: pendingTimeout = false;
export let message = 'starting ...';


export const nopRoute = '';
export const success = '{ "Success": { } }';

export const hitEndpoint = async (endpoint, route, body) => {
    const response = await fetch(endpoint + route, { method: 'POST', body});
    const result = await response.json();
    message = JSON.stringify(result);
    return message;
}

let hostname = "localhost";
let port = "8088";
let route = "api_index";
export let endpoint = `http://${hostname}:${port}/${route}`;

$: connectionAttempt = (async () => {
    return await hitEndpoint(endpoint, nopRoute, success);
})();


</script>