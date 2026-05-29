import { Loader2, Wand2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { listApiKeys, visualize } from '../../api/algorithms.js';
import { llmProviders } from '../../config/llmProviders.js';
import { useVizStore } from '../../store/vizStore.js';
import ApiKeyInput from './ApiKeyInput.jsx';
import ModelSelector from './ModelSelector.jsx';

export default function AlgorithmInput({ onCreated, onSelectionChange }) {
  const [provider, setProvider] = useState('openai');
  const [model, setModel] = useState(llmProviders[0].models[0]);
  const [algorithmText, setAlgorithmText] = useState('Bubble sort an array of numbers');
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const setVizData = useVizStore((state) => state.setVizData);

  useEffect(() => {
    listApiKeys().then(setKeys).catch(() => setKeys([]));
  }, []);

  useEffect(() => {
    onSelectionChange?.({ provider, model });
  }, [provider, model, onSelectionChange]);

  function changeProvider(nextProvider) {
    const next = llmProviders.find((item) => item.id === nextProvider);
    setProvider(nextProvider);
    setModel(next.models[0]);
  }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await visualize({ algorithm_text: algorithmText, provider, model });
      setVizData(response.viz_data);
      onCreated?.(response.history_id);
      toast.success('Visualization ready');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Could not generate visualization');
    } finally {
      setLoading(false);
    }
  }

  const keyHint = keys.find((item) => item.provider === provider)?.key_hint;

  return (
    <form className="panel space-y-5 rounded-md p-5" onSubmit={submit}>
      <ModelSelector provider={provider} model={model} onProviderChange={changeProvider} onModelChange={setModel} />
      <ApiKeyInput provider={provider} keyHint={keyHint} onSaved={(saved) => setKeys((current) => [...current.filter((item) => item.provider !== saved.provider), saved])} />
      <label className="block text-sm font-medium">
        Algorithm
        <textarea
          className="focus-ring mt-1 min-h-40 w-full resize-y border border-black/15 bg-white px-3 py-2"
          maxLength={5000}
          required
          value={algorithmText}
          onChange={(event) => setAlgorithmText(event.target.value)}
        />
      </label>
      <button className="focus-ring inline-flex items-center gap-2 bg-coral px-4 py-2 font-semibold text-white" disabled={loading} type="submit">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
        Visualize
      </button>
    </form>
  );
}
