import { useState } from 'react'
import './App.scss'

import AppManager from './components/AppManager'

function App() {
  const [selectedAppId, setSelectedAppId] = useState(null)

  if (!selectedAppId) {
    return <AppManager appId={selectedAppId} setSelectedAppId={setSelectedAppId} />
  }

  return (
    <div className='app_container'>
      <div className='app_header'>
        <div className='header_container'>
          <h1>App Creator Studio</h1>
        </div>
      </div>
      <div className='studio_container'>
        <div className='studio_header'>
          <div className='banner_button'>
            <p>Container</p>
          </div>
          <div className='banner_button'>
            <p>Text</p>
          </div>
        </div>
        <div className='studio_workplace'>
          <div className='studio_left_section'></div>
          <div className='studio_middle_section'></div>
          <div className='studio_right_section'></div>
        </div>
      </div>
    </div>
  )
}

export default App