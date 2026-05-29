import { useVizStore } from '../../store/vizStore.js';

function flatten(node, depth = 0, index = 0, acc = []) {
  if (!node) return acc;
  acc.push({ id: String(node.val), label: node.val, x: 80 + index * 120, y: 50 + depth * 90 });
  flatten(node.left, depth + 1, index * 2, acc);
  flatten(node.right, depth + 1, index * 2 + 1, acc);
  return acc;
}

export default function TreeVisualizer() {
  const { vizData, currentStep } = useVizStore();
  const step = vizData?.steps?.[currentStep];
  const nodes = flatten(step?.state?.data || vizData?.initial_state?.data);
  return (
    <svg className="h-80 w-full border-b border-black/10" viewBox="0 0 760 320">
      {nodes.map((node) => (
        <g key={node.id}>
          <circle cx={node.x} cy={node.y} r="24" fill={step?.highlights?.includes(node.id) ? '#e45f4f' : '#2f9c7a'} />
          <text x={node.x} y={node.y + 5} textAnchor="middle" fill="white" fontSize="14" fontWeight="700">{node.label}</text>
        </g>
      ))}
    </svg>
  );
}
