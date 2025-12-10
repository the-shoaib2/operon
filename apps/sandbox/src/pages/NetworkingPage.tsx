import { useState, useMemo } from 'react';
import { PageLayout } from '../components/PageLayout';
import { NetworkMap } from '../components/NetworkMap';
import { PCDashboard } from '../components/PCDashboard';
import { Network, ArrowLeftRight, Wifi, Maximize2, Minimize2 } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import type { TopologyType } from '../core/TopologyManager';

export function NetworkingPage() {
    const { network, selectedPC } = useSimulation();
    const [topology, setTopology] = useState<TopologyType>('ring');
    const [showFileTransfer, setShowFileTransfer] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const topologies: { value: TopologyType; label: string; icon: string }[] = [
        { value: 'star', label: 'Star', icon: '⭐' },
        { value: 'mesh', label: 'Mesh', icon: '🕸️' },
        { value: 'bus', label: 'Bus', icon: '🚌' },
        { value: 'ring', label: 'Ring', icon: '⭕' },
        { value: 'tree', label: 'Tree', icon: '🌳' },
    ];

    const pcs = useMemo(() => network.getAllPCs(), [network]);
    const connectedCount = useMemo(() => pcs.filter(pc => pc.status === 'online').length, [pcs]);

    return (
        <PageLayout
            title="Networking"
            description="Network topology simulation with multiple PCs supporting all topology types"
        >
            <div className="space-y-4">
                {/* Control Panel */}
                <div className="bg-gray-900 border border-gray-800 p-4">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        {/* Topology Selector */}
                        <div className="flex items-center gap-3">
                            <Network className="w-5 h-5 text-blue-400" />
                            <span className="text-gray-400 text-sm font-medium">Topology:</span>
                            <div className="flex gap-2">
                                {topologies.map(({ value, label, icon }) => (
                                    <button
                                        key={value}
                                        onClick={() => setTopology(value)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${topology === value
                                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                                            }`}
                                    >
                                        <span className="mr-1">{icon}</span>
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Network Stats & Actions */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800">
                                <Wifi className="w-4 h-4 text-green-400" />
                                <span className="text-sm text-gray-300">
                                    {connectedCount}/{pcs.length} Online
                                </span>
                            </div>

                            {selectedPC && (
                                <button
                                    onClick={() => setShowFileTransfer(!showFileTransfer)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 transition-colors"
                                >
                                    <ArrowLeftRight className="w-4 h-4" />
                                    File Transfer
                                </button>
                            )}

                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm transition-colors"
                            >
                                {isExpanded ? (
                                    <>
                                        <Minimize2 className="w-4 h-4" />
                                        Collapse Topology
                                    </>
                                ) : (
                                    <>
                                        <Maximize2 className="w-4 h-4" />
                                        Expand Topology
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                {isExpanded ? (
                    // Full-width topology, hide details panel
                    <div className="h-[calc(100vh-16rem)] border border-gray-800 bg-gray-900 overflow-hidden">
                        <NetworkMap topology={topology} />
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-16rem)]">
                        {/* Left: Network Map */}
                        <div className="w-full lg:w-96 lg:flex-shrink-0 h-1/2 lg:h-full border border-gray-800 bg-gray-900 overflow-hidden">
                            <NetworkMap topology={topology} />
                        </div>

                        {/* Right: PC Dashboard or File Transfer */}
                        <div className="flex-1 h-1/2 lg:h-full border border-gray-800 bg-gray-900 overflow-hidden">
                            {showFileTransfer && selectedPC ? (
                                <FileTransferPanel />
                            ) : (
                                <PCDashboard />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </PageLayout>
    );
}

function FileTransferPanel() {
    const { selectedPC, network } = useSimulation();
    const [targetPCId, setTargetPCId] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<string>('');
    const [operation, setOperation] = useState<'copy' | 'move' | 'send'>('send');

    if (!selectedPC) return null;

    const otherPCs = network.getAllPCs().filter(pc => pc.id !== selectedPC.id && pc.status === 'online');
    const files = selectedPC.fs.ls('/');

    const handleTransfer = () => {
        if (!targetPCId || !selectedFile) return;

        const targetPC = network.getPC(targetPCId);
        if (!targetPC) return;

        const content = selectedPC.fs.readFile(selectedFile);
        if (!content) return;

        // Perform transfer
        targetPC.fs.writeFile(selectedFile, content);
        targetPC.log(`Received file ${selectedFile} from ${selectedPC.hostname}`);
        selectedPC.log(`Sent file ${selectedFile} to ${targetPC.hostname}`);

        if (operation === 'move') {
            selectedPC.fs.deleteFile(selectedFile);
            selectedPC.log(`Moved file ${selectedFile} to ${targetPC.hostname}`);
        }

        alert(`${operation.toUpperCase()}: ${selectedFile} → ${targetPC.hostname}`);
    };

    return (
        <div className="flex flex-col h-full p-6">
            <div className="flex items-center gap-3 mb-6">
                <ArrowLeftRight className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">File Transfer</h2>
            </div>

            <div className="space-y-6">
                {/* Source PC */}
                <div className="bg-gray-800 p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Source PC</h3>
                    <div className="flex items-center gap-3 mb-4">
                        <Wifi className="w-5 h-5 text-green-400" />
                        <div>
                            <div className="text-white font-medium">{selectedPC.hostname}</div>
                            <div className="text-xs text-gray-400">{selectedPC.ip}</div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Select File:</label>
                        <select
                            value={selectedFile}
                            onChange={(e) => setSelectedFile(e.target.value)}
                            className="w-full bg-gray-900 text-gray-300 px-3 py-2 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                        >
                            <option value="">-- Select a file --</option>
                            {files.map(file => (
                                <option key={file} value={file}>{file}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Operation Type */}
                <div className="bg-gray-800 p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Operation</h3>
                    <div className="flex gap-2">
                        {(['send', 'copy', 'move'] as const).map(op => (
                            <button
                                key={op}
                                onClick={() => setOperation(op)}
                                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${operation === op
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-900 text-gray-400 hover:bg-gray-700'
                                    }`}
                            >
                                {op.charAt(0).toUpperCase() + op.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Target PC */}
                <div className="bg-gray-800 p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Target PC</h3>
                    <select
                        value={targetPCId}
                        onChange={(e) => setTargetPCId(e.target.value)}
                        className="w-full bg-gray-900 text-gray-300 px-3 py-2 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                    >
                        <option value="">-- Select target PC --</option>
                        {otherPCs.map(pc => (
                            <option key={pc.id} value={pc.id}>
                                {pc.hostname} ({pc.ip})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Transfer Button */}
                <button
                    onClick={handleTransfer}
                    disabled={!targetPCId || !selectedFile}
                    className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium transition-colors flex items-center justify-center gap-2"
                >
                    <ArrowLeftRight className="w-5 h-5" />
                    Transfer File
                </button>
            </div>
        </div>
    );
}
