import { useState, useEffect } from 'react';
import { PageLayout } from '../components/PageLayout';
import { MessageSquare, Send, Server, Cpu, Activity, Zap, CheckCircle, XCircle } from 'lucide-react';
import { MockMCPServer } from '../core/MockMCP';
import { useSimulation } from '../context/SimulationContext';

// Define PeerInfo locally for display
interface PeerInfo {
    id: string;
    name: string;
    host: string;
    port: number;
    capabilities: string[];
    tools: string[];
    status: 'online' | 'offline' | 'booting';
    lastSeen: number;
    load: number;
}

export function MCPPage() {
    const { network } = useSimulation();
    const [selectedServer, setSelectedServer] = useState<MockMCPServer | null>(null);
    const [selectedTool, setSelectedTool] = useState<string>('');
    const [toolArgs, setToolArgs] = useState<string>('{}');
    const [result, setResult] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<Array<{ type: string; data: any; timestamp: number }>>([]);

    // Get all PCs as "peers"
    const pcs = network.getAllPCs();
    const peers: PeerInfo[] = pcs.map(pc => ({
        id: pc.id,
        name: pc.hostname,
        host: pc.ip,
        port: 8080,
        capabilities: ['mcp', 'tools'],
        tools: pc.mcpServer.listTools().map(t => t.name),
        status: pc.status,
        lastSeen: Date.now(),
        load: Math.floor(Math.random() * 100)
    }));

    // Use first PC's MCP server by default
    useEffect(() => {
        if (pcs.length > 0 && !selectedServer) {
            setSelectedServer(pcs[0].mcpServer);
        }
    }, [pcs, selectedServer]);

    const tools = selectedServer?.listTools() || [];
    const onlinePeers = peers.filter(p => p.status === 'online');
    const loadStats = {
        onlinePeers: onlinePeers.length,
        avgLoad: onlinePeers.reduce((sum, p) => sum + p.load, 0) / (onlinePeers.length || 1),
        minLoad: Math.min(...onlinePeers.map(p => p.load), 0),
        maxLoad: Math.max(...onlinePeers.map(p => p.load), 0)
    };

    const handleExecuteTool = async () => {
        if (!selectedTool || !selectedServer) return;

        setLoading(true);
        setResult('');

        try {
            const args = JSON.parse(toolArgs);

            // Log the call
            setMessages(prev => [...prev, {
                type: 'tool:call',
                data: { name: selectedTool, args },
                timestamp: Date.now()
            }]);

            const toolResult = await selectedServer.callTool(selectedTool, args);

            // Log the result
            setMessages(prev => [...prev, {
                type: 'tool:result',
                data: { name: selectedTool, result: toolResult },
                timestamp: Date.now()
            }]);

            setResult(JSON.stringify(toolResult, null, 2));
        } catch (error: any) {
            setResult(`Error: ${error.message}`);
            setMessages(prev => [...prev, {
                type: 'tool:error',
                data: { name: selectedTool, error: error.message },
                timestamp: Date.now()
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageLayout
            title="MCP"
            description="Message Control Protocol - Tool Registry and Peer Management"
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Tools & Execution */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Tool Execution Panel */}
                    <div className="border border-gray-800 rounded-lg bg-gray-900 p-6">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
                            <Zap className="w-5 h-5 text-yellow-400" />
                            Tool Execution
                        </h2>

                        <div className="space-y-4">
                            {/* Tool Selection */}
                            <div>
                                <label className="text-sm text-gray-400 mb-2 block">Select Tool:</label>
                                <select
                                    value={selectedTool}
                                    onChange={(e) => setSelectedTool(e.target.value)}
                                    className="w-full bg-gray-800 text-gray-300 px-3 py-2 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="">-- Select a tool --</option>
                                    {tools.map(tool => (
                                        <option key={tool.name} value={tool.name}>
                                            {tool.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Tool Description */}
                            {selectedTool && (
                                <div className="p-3 bg-gray-800 rounded border border-gray-700">
                                    <p className="text-sm text-gray-400">
                                        {tools.find(t => t.name === selectedTool)?.description}
                                    </p>
                                </div>
                            )}

                            {/* Arguments */}
                            <div>
                                <label className="text-sm text-gray-400 mb-2 block">Arguments (JSON):</label>
                                <textarea
                                    value={toolArgs}
                                    onChange={(e) => setToolArgs(e.target.value)}
                                    className="w-full h-24 bg-gray-800 text-gray-300 font-mono text-sm p-3 rounded border border-gray-700 focus:border-blue-500 focus:outline-none resize-none"
                                    placeholder='{"path": "/home/readme.txt"}'
                                />
                            </div>

                            {/* Execute Button */}
                            <button
                                onClick={handleExecuteTool}
                                disabled={!selectedTool || loading}
                                className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <Send className="w-5 h-5" />
                                {loading ? 'Executing...' : 'Execute Tool'}
                            </button>

                            {/* Result */}
                            {result && (
                                <div>
                                    <label className="text-sm text-gray-400 mb-2 block">Result:</label>
                                    <pre className="w-full bg-black text-green-400 font-mono text-sm p-4 rounded border border-gray-700 overflow-x-auto">
                                        {result}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Message Flow */}
                    <div className="border border-gray-800 rounded-lg bg-gray-900 p-6">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
                            <MessageSquare className="w-5 h-5 text-blue-400" />
                            Message Flow
                        </h2>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {messages.slice(-10).reverse().map((msg, idx) => (
                                <div key={idx} className="p-3 bg-gray-800 rounded text-sm">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-blue-400 font-medium">{msg.type}</span>
                                        <span className="text-gray-500 text-xs">
                                            {new Date(msg.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <pre className="text-gray-300 text-xs overflow-x-auto">
                                        {JSON.stringify(msg.data, null, 2)}
                                    </pre>
                                </div>
                            ))}
                            {messages.length === 0 && (
                                <p className="text-gray-500 text-center py-8">No messages yet. Execute a tool to see activity.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Peers & Stats */}
                <div className="space-y-6">
                    {/* Load Statistics */}
                    <div className="border border-gray-800 rounded-lg bg-gray-900 p-6">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
                            <Activity className="w-5 h-5 text-green-400" />
                            Load Statistics
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Online Peers:</span>
                                <span className="text-white font-mono">{loadStats.onlinePeers}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Avg Load:</span>
                                <span className="text-white font-mono">{loadStats.avgLoad.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Min Load:</span>
                                <span className="text-green-400 font-mono">{loadStats.minLoad}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Max Load:</span>
                                <span className="text-red-400 font-mono">{loadStats.maxLoad}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Peer List */}
                    <div className="border border-gray-800 rounded-lg bg-gray-900 p-6">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
                            <Server className="w-5 h-5 text-purple-400" />
                            Network Peers
                        </h2>
                        <div className="space-y-3">
                            {peers.map(peer => (
                                <div key={peer.id} className="p-3 bg-gray-800 rounded border border-gray-700">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Cpu className="w-4 h-4 text-blue-400" />
                                            <span className="text-white font-medium text-sm">{peer.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {peer.status === 'online' ? (
                                                <CheckCircle className="w-4 h-4 text-green-400" />
                                            ) : (
                                                <XCircle className="w-4 h-4 text-red-400" />
                                            )}
                                            <span className={`text-xs ${peer.status === 'online' ? 'text-green-400' : 'text-red-400'}`}>
                                                {peer.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-400 space-y-1">
                                        <div>Host: {peer.host}:{peer.port}</div>
                                        <div>Load: {peer.load}%</div>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {peer.tools.map(tool => (
                                                <span key={tool} className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded text-xs">
                                                    {tool}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Registered Tools */}
                    <div className="border border-gray-800 rounded-lg bg-gray-900 p-6">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
                            <Zap className="w-5 h-5 text-yellow-400" />
                            Available Tools
                        </h2>
                        <div className="space-y-2">
                            {tools.map((tool, idx) => (
                                <div key={`${tool.name}-${idx}`} className="p-2 bg-gray-800 rounded text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-blue-400 font-mono">{tool.name}</span>
                                        <span className="text-xs text-gray-500">💻 Local</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
