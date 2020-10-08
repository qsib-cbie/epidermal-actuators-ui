<script>
$: pendingTimeout = false;
export let message = 'starting ...';


export const nopRoute = '';
export const success = '{ "Success": { } }';

let hostname = "localhost";
let port = "8088";
let route = "api_index";
export const endpoint = `http://${hostname}:${port}/${route}`; //needs export or else JSON syntax error(doesn't find correct url)


export const hitEndpoint = async (endpoint, route, body) => {
    const response = await fetch(endpoint + route, { method: 'POST', body});
    const result = await response.json();
    message = JSON.stringify(result);
    return message;
}

</script>