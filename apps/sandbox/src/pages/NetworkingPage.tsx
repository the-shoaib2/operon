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
            <div className="space-y-2">
                {/* Control Panel */}
                <div className="bg-dark-surface/50 border border-dark-border p-2 backdrop-blur-sm">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        {/* Topology Selector */}
                        <div className="flex items-center gap-2">
                            <Network className="w-4 h-4 text-brand-primary" />
                            <span className="text-dark-muted text-xs font-medium">Topology:</span>
                            <div className="flex gap-1">
                                {topologies.map(({ value, label, icon }) => (
                                    <button
                                        key={value}
                                        onClick={() => setTopology(value)}
                                        className={`px-2 py-1 rounded text-xs font-medium transition-all ${topology === value
                                            ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                                            : 'bg-dark-bg text-dark-muted hover:bg-white/5 hover:text-dark-text'
                                            }`}
                                    >
                                        <span className="mr-1">{icon}</span>
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Network Stats & Actions */}
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 px-2 py-1 bg-dark-bg border border-dark-border rounded">
                                <Wifi className="w-3 h-3 text-brand-accent" />
                                <span className="text-xs text-dark-text">
                                    {connectedCount}/{pcs.length} Online
                                </span>
                            </div>

                            {selectedPC && (
                                <button
                                    onClick={() => setShowFileTransfer(!showFileTransfer)}
                                    className="flex items-center gap-2 px-2 py-1 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary border border-brand-primary/20 transition-colors rounded"
                                >
                                    <ArrowLeftRight className="w-3 h-3" />
                                    <span className="text-xs">File Transfer</span>
                                </button>
                            )}

                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="flex items-center gap-2 px-2 py-1 bg-dark-bg hover:bg-white/5 text-dark-muted hover:text-dark-text border border-dark-border transition-colors rounded"
                            >
                                {isExpanded ? (
                                    <>
                                        <Minimize2 className="w-3 h-3" />
                                        <span className="text-xs">Collapse</span>
                                    </>
                                ) : (
                                    <>
                                        <Maximize2 className="w-3 h-3" />
                                        <span className="text-xs">Expand</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                {isExpanded ? (
                    // Full-width topology, hide details panel
                    <div className="h-[calc(100vh-10rem)] border border-dark-border bg-dark-bg overflow-hidden relative">
                        <NetworkMap topology={topology} />
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-2 h-[calc(100vh-10rem)]">
                        {/* Left: Network Map */}
                        <div className="w-full lg:w-96 lg:flex-shrink-0 h-1/2 lg:h-full border border-dark-border bg-dark-bg overflow-hidden relative">
                            <NetworkMap topology={topology} />
                        </div>

                        {/* Right: PC Dashboard or File Transfer */}
                        <div className="flex-1 h-1/2 lg:h-full border border-dark-border bg-dark-bg overflow-hidden relative">
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
        <div className="flex flex-col h-full p-4">
            <div className="flex items-center gap-2 mb-4">
                <ArrowLeftRight className="w-5 h-5 text-brand-primary" />
                <h2 className="text-lg font-bold text-white">File Transfer</h2>
            </div>

            <div className="space-y-4">
                {/* Source PC */}
                <div className="bg-dark-surface/30 p-3 border border-dark-border rounded">
                    <h3 className="text-xs font-medium text-dark-muted mb-2">Source PC</h3>
                    <div className="flex items-center gap-2 mb-3">
                        <Wifi className="w-4 h-4 text-brand-accent" />
                        <div>
                            <div className="text-white text-sm font-medium">{selectedPC.hostname}</div>
                            <div className="text-[10px] text-dark-muted">{selectedPC.ip}</div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs text-dark-muted">Select File:</label>
                        <select
                            value={selectedFile}
                            onChange={(e) => setSelectedFile(e.target.value)}
                            className="w-full bg-dark-bg text-dark-text px-2 py-1.5 text-sm rounded border border-dark-border focus:border-brand-primary focus:outline-none"
                        >
                            <option value="">-- Select a file --</option>
                            {files.map(file => (
                                <option key={file} value={file}>{file}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Operation Type */}
                <div className="bg-dark-surface/30 p-3 border border-dark-border rounded">
                    <h3 className="text-xs font-medium text-dark-muted mb-2">Operation</h3>
                    <div className="flex gap-1">
                        {(['send', 'copy', 'move'] as const).map(op => (
                            <button
                                key={op}
                                onClick={() => setOperation(op)}
                                className={`flex-1 px-2 py-1.5 rounded text-xs font-medium transition-all ${operation === op
                                    ? 'bg-brand-primary text-white'
                                    : 'bg-dark-bg text-dark-muted hover:bg-white/5 border border-dark-border'
                                    }`}
                            >
                                {op.charAt(0).toUpperCase() + op.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Target PC */}
                <div className="bg-dark-surface/30 p-3 border border-dark-border rounded">
                    <h3 className="text-xs font-medium text-dark-muted mb-2">Target PC</h3>
                    <select
                        value={targetPCId}
                        onChange={(e) => setTargetPCId(e.target.value)}
                        className="w-full bg-dark-bg text-dark-text px-2 py-1.5 text-sm rounded border border-dark-border focus:border-brand-primary focus:outline-none"
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
                    className="w-full px-4 py-2 bg-brand-primary hover:bg-brand-secondary disabled:bg-dark-surface disabled:text-dark-muted text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 rounded"
                >
                    <ArrowLeftRight className="w-4 h-4" />
                    Transfer File
                </button>
            </div>
        </div>
    );
}
