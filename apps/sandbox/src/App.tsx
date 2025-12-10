import { SimulationProvider } from './context/SimulationContext';
import { NetworkMap } from './components/NetworkMap';
import { PCDashboard } from './components/PCDashboard';

function App() {
  return (
    <SimulationProvider>
      <div className="flex h-screen w-screen bg-black overflow-hidden">
        {/* Left Sidebar: Network Map */}
        <div className="w-80 flex-shrink-0 h-full border-r border-gray-800 bg-gray-900">
          <NetworkMap />
        </div>

        {/* Main Content: PC Dashboard */}
        <div className="flex-1 h-full relative">
          <PCDashboard />
        </div>
      </div>
    </SimulationProvider>
  );
}

export default App;
