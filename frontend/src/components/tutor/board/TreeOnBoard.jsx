import { motion } from 'framer-motion';
import ChalkCircle from './ChalkCircle.jsx';

function flattenTree(node, depth = 0, x = 220, spread = 120, acc = { nodes: [], edges: [] }, parent = null) {
  if (!node) return acc;
  const id = String(node.val ?? node.id ?? acc.nodes.length);
  const point = { id, label: node.val ?? node.label ?? id, x, y: 42 + depth * 78 };
  acc.nodes.push(point);
  if (parent) acc.edges.push({ from: parent, to: point });
  flattenTree(node.left, depth + 1, x - spread, spread / 1.8, acc, point);
  flattenTree(node.right, depth + 1, x + spread, spread / 1.8, acc, point);
  return acc;
}

export default function TreeOnBoard({ data, highlights = [] }) {
  const { nodes, edges } = flattenTree(data);
  return (
    <svg className="my-4 h-64 w-full" viewBox="0 0 520 250">
      {edges.map((edge, index) => (
        <motion.line
          key={`${edge.from.id}-${edge.to.id}`}
          x1={edge.from.x}
          y1={edge.from.y}
          x2={edge.to.x}
          y2={edge.to.y}
          stroke="#E8E8D8"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.75 }}
          transition={{ delay: index * 0.08 }}
        />
      ))}
      {nodes.map((node, index) => {
        const active = highlights.includes(node.id) || highlights.includes(Number(node.id));
        return (
          <g key={node.id}>
            {active && <ChalkCircle cx={node.x} cy={node.y} r={26} />}
            <motion.circle cx={node.x} cy={node.y} r="21" fill={active ? 'rgba(252,211,77,0.2)' : 'rgba(255,255,255,0.05)'} stroke={active ? '#FCD34D' : '#E8E8D8'} strokeWidth="2" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: index * 0.07 }} />
            <text x={node.x} y={node.y + 6} textAnchor="middle" fill={active ? '#FCD34D' : '#E8E8D8'} fontFamily="'Caveat', cursive" fontSize="22" fontWeight="700">
              {node.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
