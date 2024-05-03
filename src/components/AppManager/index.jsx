import fetchData from '../../services/fetchData'
import './index.scss'

const Apps = [
    {
        id: 1,
        name: 'App 1',
        description: 'App 1 description',
        modified: '2021-01-01'
    },
    {
        id: 2,
        name: 'App 2',
        description: 'App 2 description',
        modified: '2021-01-02'
    },
    {
        id: 3,
        name: 'App 3',
        description: 'App 3 description',
        modified: '2021-01-03'
    }
]

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
                <div className="apps_list_container">
                    <div className="apps_list_header">
                        <div className="app_name">App Name</div>
                        <div className="app_description">Description</div>
                        <div className="app_modified">Modified</div>
                    </div>
                    <div className="apps_list">
                        {
                            Apps.map(app => {
                                return (
                                    <div className="app" key={app.id} onClick={() => setSelectedAppId(app.id)}>
                                        <div className="app_name">{app.name}</div>
                                        <div className="app_description">{app.description}</div>
                                        <div className="app_modified">{app.modified}</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}