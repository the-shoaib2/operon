import { useState } from 'react'
import { ChatInterface } from './components/chat-interface'
import { Layout } from './components/layout'
import { SettingsPanel } from './components/settings-panel'
import { MemoryInspector } from './components/memory-inspector'
import './App.css'

export type View = 'chat' | 'memory' | 'settings'

function App() {
    const [activeView, setActiveView] = useState<View>('chat')

    return (
        <Layout activeView={activeView} onNavigate={setActiveView}>
            {activeView === 'chat' && <ChatInterface />}
            {activeView === 'memory' && <MemoryInspector />}
            {activeView === 'settings' && <SettingsPanel />}
        </Layout>
    )
}

export default App
