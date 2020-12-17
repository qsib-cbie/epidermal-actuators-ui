<script>

export const nopRoute = '';
export const success = '{ "Success": { } }';


export const hitEndpoint = async (endpoint, route, body) => {
    const response = await fetch(endpoint + route, { method: 'POST', body});
    const result = await response.json();
    return result;
}

</script>