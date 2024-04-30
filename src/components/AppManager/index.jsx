import fetchData from '../../services/fetchData'
import './index.scss'

export default function AppManager(appId, setSelectedAppId) {

    const createApp = async () => {
        const data = fetchData('post', 'createproject')
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