import { llmProviders } from '../../config/llmProviders.js';

export default function ModelSelector({ provider, model, onProviderChange, onModelChange }) {
  const selected = llmProviders.find((item) => item.id === provider) || llmProviders[0];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="block text-sm font-medium">
        Provider
        <select className="focus-ring mt-1 w-full border border-black/15 bg-white px-3 py-2" value={provider} onChange={(e) => onProviderChange(e.target.value)}>
          {llmProviders.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      </label>
      <label className="block text-sm font-medium">
        Model
        <select className="focus-ring mt-1 w-full border border-black/15 bg-white px-3 py-2" value={model} onChange={(e) => onModelChange(e.target.value)}>
          {selected.models.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
    </div>
  );
}
