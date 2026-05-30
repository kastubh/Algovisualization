import { motion } from 'framer-motion';
import ChalkCircle from './ChalkCircle.jsx';

function layout(nodes = []) {
  return nodes.map((node, index) => ({
    id: String(node.id),
    label: node.label || node.id,
    x: 80 + (index % 5) * 90,
    y: 52 + Math.floor(index / 5) * 84,
  }));
}

export default function GraphOnBoard({ data = { nodes: [], edges: [] }, highlights = [] }) {
  const nodes = layout(data.nodes || []);
  const byId = new Map(nodes.map((node) => [node.id, node]));
  return (
    <svg className="my-4 h-64 w-full" viewBox="0 0 560 250">
      {(data.edges || []).map((edge, index) => {
        const from = byId.get(String(edge.from));
        const to = byId.get(String(edge.to));
        if (!from || !to) return null;
        return (
          <motion.line key={`${edge.from}-${edge.to}-${index}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#E8E8D8" strokeWidth="2" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.65 }} transition={{ delay: index * 0.08 }} />
        );
      })}
      {nodes.map((node, index) => {
        const active = highlights.includes(node.id) || highlights.includes(Number(node.id));
        return (
          <g key={node.id}>
            {active && <ChalkCircle cx={node.x} cy={node.y} r={25} />}
            <motion.circle cx={node.x} cy={node.y} r="20" fill={active ? 'rgba(134,239,172,0.18)' : 'rgba(255,255,255,0.05)'} stroke={active ? '#86EFAC' : '#E8E8D8'} strokeWidth="2" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: index * 0.07 }} />
            <text x={node.x} y={node.y + 6} textAnchor="middle" fill={active ? '#86EFAC' : '#E8E8D8'} fontFamily="'Caveat', cursive" fontSize="20" fontWeight="700">
              {node.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
