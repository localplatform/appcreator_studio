import useRequest from '../../useRequest'
import './index.scss'

export default function AppManager(appId, setSelectedAppId) {
    const { data, isLoading, error, fetchData } = useRequest(`newapp`)

    const createApp = async () => {
        
    }

    return (
        <div className='app_manager_container'>
            <div className='header'>
                <h1>SELECT AN APP</h1>
                <button onClick={createApp}>NEW APP</button>
            </div>
        </div>
    )
}