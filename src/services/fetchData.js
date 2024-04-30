export default async function fetchData(method, endpoint, body) {
    try {
        const response = await axios.request({
            method: method,
            url: `http://localhost:3000/api/${endpoint}`,
            // url: `${process.env.REACT_APP_API_URL}/api/public/${endpoint}`,
            headers: { 'Accept': 'application/json' },
            body: body
        })
        return response.data
    } catch (error) {
        console.log('Error fetchData:', error)
        return null
    }
}