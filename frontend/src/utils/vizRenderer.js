import ArrayVisualizer from '../components/visualizer/ArrayVisualizer.jsx';
import GraphVisualizer from '../components/visualizer/GraphVisualizer.jsx';
import TreeVisualizer from '../components/visualizer/TreeVisualizer.jsx';

export function getVisualizer(type) {
  if (type === 'tree') return TreeVisualizer;
  if (type === 'graph') return GraphVisualizer;
  return ArrayVisualizer;
}
