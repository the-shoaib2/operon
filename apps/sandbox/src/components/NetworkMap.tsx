import { useSimulation } from '../context/SimulationContext';

export const NetworkMap = () => {
    const { network, selectedPC, selectPC } = useSimulation();
    const pcs = network.getAllPCs();

    return (
        <div className="p-4 bg-gray-900 h-full border-r border-gray-800 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-white">Network Topology</h2>
            <div className="grid grid-cols-2 gap-4">
                {pcs.map((pc) => (
                    <div
                        key={pc.id}
                        onClick={() => selectPC(pc.id)}
                        className={`
              p-4 rounded-lg cursor-pointer border transition-all hover:bg-gray-700
              ${selectedPC?.id === pc.id ? 'bg-gray-700 border-blue-500 ring-1 ring-blue-500' : 'bg-gray-800 border-gray-700'}
            `}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-sm font-bold text-gray-200">{pc.hostname}</span>
                            <div className={`w-3 h-3 rounded-full ${pc.status === 'online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
                        </div>
                        <div className="text-xs text-gray-400 font-mono">
                            IP: {pc.ip}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            ID: {pc.id.slice(0, 8)}...
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
