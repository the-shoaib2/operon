import { createContext, useContext, useState, type ReactNode } from 'react';
import { Network } from '../core/Network';
import { PC } from '../core/PC';

interface SimulationContextType {
    network: Network;
    selectedPC: PC | null;
    selectPC: (id: string | null) => void;
    refresh: () => void; // Force UI update
}

const SimulationContext = createContext<SimulationContextType | null>(null);

export const SimulationProvider = ({ children }: { children: ReactNode }) => {
    const [network] = useState(() => new Network(5)); // Start with 5 PCs
    const [selectedPC, setSelectedPC] = useState<PC | null>(null);
    const [, setTick] = useState(0);

    const selectPC = (id: string | null) => {
        if (!id) {
            setSelectedPC(null);
            return;
        }
        const pc = network.getPC(id);
        setSelectedPC(pc || null);
    };

    const refresh = () => setTick(t => t + 1);

    return (
        <SimulationContext.Provider value={{ network, selectedPC, selectPC, refresh }}>
            {children}
        </SimulationContext.Provider>
    );
};

export const useSimulation = () => {
    const context = useContext(SimulationContext);
    if (!context) throw new Error('useSimulation must be used within SimulationProvider');
    return context;
};
