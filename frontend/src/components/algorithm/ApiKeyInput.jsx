import { KeyRound, Save } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { saveApiKey } from '../../api/algorithms.js';
import { llmProviders } from '../../config/llmProviders.js';

export default function ApiKeyInput({ provider, keyHint, onSaved }) {
  const [apiKey, setApiKey] = useState('');
  const selected = llmProviders.find((item) => item.id === provider);

  async function save() {
    if (!apiKey.trim()) return;
    try {
      const saved = await saveApiKey({ provider, api_key: apiKey.trim() });
      setApiKey('');
      onSaved?.(saved);
      toast.success('API key saved');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Could not save key');
    }
  }

  return (
    <div className="space-y-2">
      <label className="field-label">Provider API key</label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/45" />
          <input
            className="input-field focus-ring py-2 pl-9 pr-3"
            placeholder={keyHint || selected?.keyPlaceholder}
            type="password"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
          />
        </div>
        <button className="btn-secondary focus-ring whitespace-nowrap px-4 py-2 text-sm" onClick={save} type="button">
          <Save className="h-4 w-4" />Save
        </button>
      </div>
    </div>
  );
}
