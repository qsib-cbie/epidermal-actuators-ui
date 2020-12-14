<script>

export const nopRoute = '';
export const success = '{ "Success": { } }';

export let hostname = "10.105.97.178";
export let port = "8088";
export let route = "api_index";
export let endpoint = "";
$: {endpoint = `http://${hostname}:${port}/${route}`;} 


export const hitEndpoint = async (endpoint, route, body) => {
    const response = await fetch(endpoint + route, { method: 'POST', body});
    const result = await response.json();
    return result;
}

</script>