import { llmProviders } from '../../config/llmProviders.js';

export default function ModelSelector({ provider, model, onProviderChange, onModelChange }) {
  const selected = llmProviders.find((item) => item.id === provider) || llmProviders[0];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="field-label">
        Provider
        <select className="select-field focus-ring mt-1" value={provider} onChange={(e) => onProviderChange(e.target.value)}>
          {llmProviders.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      </label>
      <label className="field-label">
        Model
        <select className="select-field focus-ring mt-1" value={model} onChange={(e) => onModelChange(e.target.value)}>
          {selected.models.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
    </div>
  );
}
