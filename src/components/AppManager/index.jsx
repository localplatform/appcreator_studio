import fetchData from '../../services/fetchData'
import './index.scss'

export default function AppManager(appId, setSelectedAppId) {

    const createApp = async () => {
        console.log('Creating app...')
        const data = await fetchData('post', 'createproject')
        console.log(data)
    }

    return (
        <div className='app_manager_container'>
            <div className="scrollable_screen">
                <div className='header'>
                    <h1>SELECT AN APP</h1>
                    <button onClick={createApp}>NEW APP</button>
                </div>
            </div>
        </div>
    )
}