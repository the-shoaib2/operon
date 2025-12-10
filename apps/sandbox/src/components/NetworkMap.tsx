import { useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Monitor } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { TopologyManager, type TopologyType } from '../core/TopologyManager';

interface NetworkMapProps {
  topology?: TopologyType;
}

export const NetworkMap = ({ topology = 'ring' }: NetworkMapProps) => {
  const { network, selectedPC, selectPC } = useSimulation();

  // Memoize pcs array to prevent unnecessary recalculations
  const pcs = useMemo(() => network.getAllPCs(), [network]);
  const pcIds = useMemo(() => pcs.map(pc => pc.id), [pcs]);
  const selectedPCId = selectedPC?.id;

  const initialNodes: Node[] = useMemo(() => {
    if (pcs.length === 0) return [];

    const positions = TopologyManager.calculatePositions(pcs.length, topology);

    return pcs.map((pc, index) => {
      const isSelected = selectedPCId === pc.id;
      const position = positions[index] || { x: 0, y: 0 };

      return {
        id: pc.id,
        data: {
          label: (
            <div className="flex flex-col items-center gap-1">
              <Monitor className="w-6 h-6" />
              <span className="text-xs font-medium">{pc.hostname}</span>
            </div>
          )
        },
        position,
        style: {
          padding: 8,
          borderRadius: 0,
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: isSelected ? '#3b82f6' : '#2a2a2a',
          backgroundColor: isSelected ? '#3b82f620' : '#121212',
          color: '#e5e5e5',
          boxShadow: isSelected
            ? '0 0 0 1px #3b82f6'
            : 'none',
        },
      } satisfies Node;
    });
  }, [pcs, selectedPCId, topology]);

  const initialEdges: Edge[] = useMemo(() => {
    if (pcs.length < 2) return [];

    const connections = TopologyManager.calculateConnections(pcIds, topology);

    return connections.map(conn => ({
      id: `${conn.from}-${conn.to}`,
      source: conn.from,
      target: conn.to,
      type: 'smoothstep',
      style: { stroke: '#4b5563' },
      animated: topology === 'mesh',
    } satisfies Edge));
  }, [pcIds, topology]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      selectPC(node.id);
    },
    [selectPC],
  );

  return (
    <div className="h-full w-full bg-dark-bg flex flex-col">
      <div className="p-2 border-b border-dark-border">
        <h2 className="text-lg font-bold text-white">Network Topology</h2>
        <p className="text-[10px] text-dark-muted mt-0.5">
          {topology.charAt(0).toUpperCase() + topology.slice(1)} topology • {pcs.length} nodes
        </p>
      </div>
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 0.2 }}
        >
          <MiniMap
            nodeStrokeColor="#2a2a2a" // dark-border
            nodeColor="#121212" // dark-surface
            maskColor="rgba(10,10,10,0.7)" // dark-bg
          />
          <Controls />
          <Background color="#2a2a2a" gap={16} />
        </ReactFlow>
      </div>
    </div>
  );
};
