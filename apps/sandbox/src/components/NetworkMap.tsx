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
          padding: 12,
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: isSelected ? '#3b82f6' : '#374151',
          backgroundColor: isSelected ? '#1e3a8a' : '#111827',
          color: '#e5e7eb',
          boxShadow: isSelected
            ? '0 0 0 2px rgba(59,130,246,0.8), 0 0 16px rgba(59,130,246,0.6)'
            : '0 0 0 1px rgba(31,41,55,1)',
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
    <div className="h-full w-full bg-gray-900 flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-xl font-bold text-white">Network Topology</h2>
        <p className="text-xs text-gray-400 mt-1">
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
            nodeStrokeColor="#4b5563"
            nodeColor="#111827"
            maskColor="rgba(17,24,39,0.7)"
          />
          <Controls />
          <Background color="#1f2937" gap={16} />
        </ReactFlow>
      </div>
    </div>
  );
};
