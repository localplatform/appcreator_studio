import { useState, useEffect, useCallback } from "react"
import axios from "axios"

export default function useRequest(auto, method, endpoint) {
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchData = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await axios.request({
                method: method,
                URL: `http://localhost:3000/api/${endpoint}`,
                // url: `${process.env.REACT_APP_API_URL}/api/public/${endpoint}`,
                headers: { 'Accept': 'application/json' }
            })
            setData(response.data)
            setIsLoading(false)
        } catch (error) {
            setError(error)
        } finally {
            setIsLoading(false)
        }
    }, [endpoint])

    useEffect(() => {
        if (endpoint && method && auto) {
            fetchData()
        }
    }, [endpoint, method, fetchData])

    return { data, isLoading, error, fetchData }
}