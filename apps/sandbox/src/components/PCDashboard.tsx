import { useSimulation } from '../context/SimulationContext';
import { Terminal } from './Terminal';

export const PCDashboard = () => {
    const { selectedPC } = useSimulation();

    if (!selectedPC) {
        return (
            <div className="h-full flex items-center justify-center bg-gray-900/50">
                <div className="text-center">
                    <div className="text-6xl mb-4">🖥️</div>
                    <h2 className="text-2xl text-gray-400">Select a computer from the network map</h2>
                </div>
            </div>
        )
    }

    const tools = selectedPC.mcpServer.listTools();

    return (
        <div className="flex flex-col h-full bg-gray-900 text-white">
            {/* Header */}
            <div className="p-4 border-b border-gray-800 bg-gray-800/50 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">{selectedPC.hostname}</h1>
                    <p className="text-sm text-gray-400 font-mono">{selectedPC.ip} | {selectedPC.id}</p>
                </div>
                <div className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30">
                    ONLINE
                </div>
            </div>

            {/* Content Split */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Info & MCP */}
                <div className="w-1/3 p-4 border-r border-gray-800 overflow-y-auto bg-gray-900/50">
                    <div className="mb-6">
                        <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-3 font-bold">FileSystem</h3>
                        <div className="bg-black/50 p-3 font-mono text-xs text-gray-400">
                            {selectedPC.fs.ls('/').map(f => (
                                <div key={f} className="mb-1 flex items-center gap-2">
                                    <span>📄</span> {f}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-3 font-bold">Available MCP Tools</h3>
                        <div className="space-y-2">
                            {tools.map(tool => (
                                <div key={tool.name} className="p-3 bg-gray-800 border border-gray-700 hover:border-gray-600 transition-colors">
                                    <div className="font-mono text-sm font-bold text-blue-400">{tool.name}</div>
                                    <div className="text-xs text-gray-400 mt-1">{tool.description}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Terminal */}
                <div className="flex-1 p-4 bg-black/20">
                    <Terminal />
                </div>
            </div>
        </div>
    );
};
