import '@xyflow/react/dist/style.css';
import { ReactFlow, Background } from '@xyflow/react';
import { useMemo } from 'react';
import { useVizStore } from '../../store/vizStore.js';

export default function GraphVisualizer() {
  const { vizData, currentStep } = useVizStore();
  const step = vizData?.steps?.[currentStep];
  const graph = step?.state?.data || vizData?.initial_state?.data || { nodes: [], edges: [] };
  const nodes = useMemo(() => graph.nodes.map((node, index) => ({
    id: String(node.id),
    position: { x: 90 + (index % 4) * 150, y: 50 + Math.floor(index / 4) * 110 },
    data: { label: node.label || node.id },
    style: { background: step?.highlights?.includes(node.id) ? '#e45f4f' : '#2f9c7a', color: 'white', border: 0 },
  })), [graph.nodes, step]);
  const edges = useMemo(() => graph.edges.map((edge, index) => ({ id: `e-${index}`, source: String(edge.from), target: String(edge.to) })), [graph.edges]);
  return (
    <div className="h-80 border-b border-black/10">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
      </ReactFlow>
    </div>
  );
}
