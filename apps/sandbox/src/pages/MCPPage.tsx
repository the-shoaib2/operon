import { useState, useEffect, useMemo } from 'react';
import { PageLayout } from '../components/PageLayout';
import { MessageSquare, Send, Server, Cpu, Activity, Zap, Search } from 'lucide-react';
import { MockMCPServer } from '../core/MockMCP';
import { useSimulation } from '../context/SimulationContext';
import { motion, AnimatePresence } from 'framer-motion';

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
    const peers: PeerInfo[] = useMemo(() => pcs.map(pc => ({
        id: pc.id,
        name: pc.hostname,
        host: pc.ip,
        port: 8080,
        capabilities: ['mcp', 'tools'],
        tools: pc.mcpServer.listTools().map(t => t.name),
        status: pc.status,
        lastSeen: Date.now(),
        load: Math.floor(Math.random() * 100)
    })), [pcs]);

    // Use first PC's MCP server by default
    useEffect(() => {
        if (pcs.length > 0 && !selectedServer) {
            setSelectedServer(pcs[0].mcpServer);
        }
    }, [pcs, selectedServer]);

    const tools = selectedServer?.listTools() || [];
    const onlinePeers = peers.filter(p => p.status === 'online');
    const loadStats = useMemo(() => ({
        onlinePeers: onlinePeers.length,
        avgLoad: onlinePeers.reduce((sum, p) => sum + p.load, 0) / (onlinePeers.length || 1),
        minLoad: Math.min(...onlinePeers.map(p => p.load), 0),
        maxLoad: Math.max(...onlinePeers.map(p => p.load), 0)
    }), [onlinePeers]);

    const handleExecuteTool = async () => {
        if (!selectedTool || !selectedServer) return;

        setLoading(true);
        setResult('');

        try {
            const args = JSON.parse(toolArgs);

            setMessages(prev => [...prev, {
                type: 'tool:call',
                data: { name: selectedTool, args },
                timestamp: Date.now()
            }]);

            const toolResult = await selectedServer.callTool(selectedTool, args);

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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <PageLayout
            title="MCP Registry"
            description="Manage Message Control Protocol servers, peers, and tool execution."
        >
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
                {/* Left Column: Tools & Execution */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Tool Execution Panel */}
                    <motion.div variants={itemVariants} className="glass-card rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-6">
                            <Zap className="w-5 h-5 text-yellow-400" />
                            Tool Execution
                        </h2>

                        <div className="space-y-4">
                            {/* Tool Selection */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-dark-muted mb-2 block">Select Tool</label>
                                    <div className="relative">
                                        <select
                                            value={selectedTool}
                                            onChange={(e) => setSelectedTool(e.target.value)}
                                            className="w-full bg-dark-bg text-dark-text px-4 py-2.5 rounded-lg border border-dark-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary focus:outline-none appearance-none transition-colors"
                                        >
                                            <option value="">-- Select a tool --</option>
                                            {tools.map(tool => (
                                                <option key={tool.name} value={tool.name}>
                                                    {tool.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-dark-muted">
                                            <Search className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tool Description */}
                            <AnimatePresence>
                                {selectedTool && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-brand-primary/10 border border-brand-primary/20 rounded-lg p-3"
                                    >
                                        <p className="text-sm text-brand-primary font-medium">
                                            {tools.find(t => t.name === selectedTool)?.description}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Arguments */}
                            <div>
                                <label className="text-sm font-medium text-dark-muted mb-2 block">Arguments (JSON)</label>
                                <textarea
                                    value={toolArgs}
                                    onChange={(e) => setToolArgs(e.target.value)}
                                    className="w-full h-32 bg-dark-bg text-dark-text font-mono text-sm p-4 rounded-lg border border-dark-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary focus:outline-none resize-none transition-colors"
                                    placeholder='{"path": "/home/readme.txt"}'
                                />
                            </div>

                            {/* Execute Button */}
                            <div className="flex justify-end">
                                <button
                                    onClick={handleExecuteTool}
                                    disabled={!selectedTool || loading}
                                    className="px-6 py-2.5 bg-brand-primary hover:bg-brand-primary/90 disabled:bg-dark-border disabled:text-dark-muted text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-brand-primary/20 flex items-center gap-2"
                                >
                                    <Send className="w-4 h-4" />
                                    {loading ? 'Executing...' : 'Execute Tool'}
                                </button>
                            </div>

                            {/* Result */}
                            <AnimatePresence>
                                {result && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-4"
                                    >
                                        <label className="text-sm font-medium text-dark-muted mb-2 block">Result</label>
                                        <div className="relative group">
                                            <pre className="w-full bg-dark-bg text-green-400 font-mono text-sm p-4 rounded-lg border border-dark-border overflow-x-auto custom-scrollbar">
                                                {result}
                                            </pre>
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="flex gap-1">
                                                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Message Flow */}
                    <motion.div variants={itemVariants} className="glass-card rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
                            <MessageSquare className="w-5 h-5 text-brand-secondary" />
                            Message Flow
                        </h2>
                        <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                            {messages.slice(-10).reverse().map((msg, idx) => (
                                <motion.div
                                    key={msg.timestamp + idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-3 bg-dark-bg/50 rounded-lg border border-dark-border text-sm hover:border-brand-secondary/30 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`font-mono text-xs px-2 py-0.5 rounded ${msg.type.includes('error') ? 'bg-red-500/10 text-red-400' :
                                            msg.type.includes('result') ? 'bg-green-500/10 text-green-400' : 'bg-brand-primary/10 text-brand-primary'
                                            }`}>
                                            {msg.type}
                                        </span>
                                        <span className="text-dark-muted text-xs">
                                            {new Date(msg.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <pre className="text-dark-text/80 text-xs overflow-x-auto mt-2 font-mono">
                                        {JSON.stringify(msg.data, null, 2)}
                                    </pre>
                                </motion.div>
                            ))}
                            {messages.length === 0 && (
                                <div className="text-dark-muted text-center py-12 border-2 border-dashed border-dark-border rounded-lg">
                                    <p>No messages yet.</p>
                                    <p className="text-xs mt-1">Execute a tool to see activity.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Peers & Stats */}
                <div className="space-y-6">
                    {/* Load Statistics */}
                    <motion.div variants={itemVariants} className="glass-card rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
                            <Activity className="w-5 h-5 text-emerald-400" />
                            Load Statistics
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-dark-bg/50 rounded-lg">
                                <span className="text-dark-muted text-xs block mb-1">Online Peers</span>
                                <span className="text-2xl font-mono text-white">{loadStats.onlinePeers}</span>
                            </div>
                            <div className="p-3 bg-dark-bg/50 rounded-lg">
                                <span className="text-dark-muted text-xs block mb-1">Avg Load</span>
                                <span className="text-2xl font-mono text-white">{loadStats.avgLoad.toFixed(0)}%</span>
                            </div>
                            <div className="p-3 bg-dark-bg/50 rounded-lg">
                                <span className="text-dark-muted text-xs block mb-1">Min Load</span>
                                <span className="text-xl font-mono text-emerald-400">{loadStats.minLoad}%</span>
                            </div>
                            <div className="p-3 bg-dark-bg/50 rounded-lg">
                                <span className="text-dark-muted text-xs block mb-1">Max Load</span>
                                <span className="text-xl font-mono text-red-400">{loadStats.maxLoad}%</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Peer List */}
                    <motion.div variants={itemVariants} className="glass-card rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
                            <Server className="w-5 h-5 text-brand-secondary" />
                            Network Peers
                        </h2>
                        <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                            {peers.map(peer => (
                                <div key={peer.id} className="p-4 bg-dark-bg rounded-lg border border-dark-border hover:border-brand-primary/50 transition-colors group">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-brand-primary/10 rounded-md text-brand-primary">
                                                <Cpu className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <span className="text-white font-medium text-sm block">{peer.name}</span>
                                                <span className="text-xs text-dark-muted block">{peer.host}:{peer.port}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="flex items-center gap-1.5">
                                                <span className={`w-2 h-2 rounded-full ${peer.status === 'online' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-red-400'}`} />
                                            </div>
                                            <span className="text-xs font-mono text-dark-muted">{peer.load}% Load</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-dark-border/50">
                                        {peer.tools.slice(0, 3).map(tool => (
                                            <span key={tool} className="px-2 py-0.5 bg-brand-primary/10 text-brand-primary rounded text-[10px] border border-brand-primary/20">
                                                {tool}
                                            </span>
                                        ))}
                                        {peer.tools.length > 3 && (
                                            <span className="px-2 py-0.5 bg-dark-surface text-dark-muted rounded text-[10px] border border-dark-border">
                                                +{peer.tools.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </PageLayout>
    );
}
