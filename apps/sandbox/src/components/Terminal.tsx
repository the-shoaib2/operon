import React, { useState, useRef, useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';

export const Terminal = () => {
    const { selectedPC, refresh } = useSimulation();
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (selectedPC) {
            setHistory(selectedPC.logs.slice(-10)); // Show last 10 logs initially
        } else {
            setHistory([]);
        }
    }, [selectedPC]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPC || !input.trim()) return;

        const cmd = input.trim();
        setInput('');

        // Optimistic update
        setHistory(prev => [...prev, `user@${selectedPC.hostname}:~$ ${cmd}`]);

        // Execute
        try {
            const output = await selectedPC.executeCommand(cmd);
            selectedPC.log(`CMD: ${cmd} -> ${output}`);
            setHistory(prev => [...prev, output]);
        } catch (err: any) {
            setHistory(prev => [...prev, `Error: ${err.message}`]);
        }
        refresh(); // Update global state
    };

    if (!selectedPC) {
        return (
            <div className="flex items-center justify-center h-full text-gray-600 font-mono">
                Select a node to open terminal
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-black text-green-400 font-mono text-sm p-4 rounded-lg border border-gray-800 shadow-2xl">
            <div className="flex-1 overflow-y-auto mb-2 space-y-1" ref={scrollRef}>
                {history.map((line, i) => (
                    <div key={i} className="whitespace-pre-wrap break-words">{line}</div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2 border-t border-gray-800 pt-2">
                <span className="text-green-600">user@{selectedPC.hostname}:~$</span>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-gray-100 placeholder-gray-700"
                    placeholder="Type a command (try: ls, status, echo hi)..."
                    autoFocus
                />
            </form>
        </div>
    );
};
