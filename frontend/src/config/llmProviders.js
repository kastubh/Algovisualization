export const llmProviders = [
  { id: 'openai', name: 'OpenAI', models: ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo'], keyPlaceholder: 'sk-proj-... or demo-local-key' },
  { id: 'anthropic', name: 'Anthropic', models: ['claude-sonnet-4-5', 'claude-opus-4-5', 'claude-haiku-4-5'], keyPlaceholder: 'sk-ant-...' },
  { id: 'gemini', name: 'Google Gemini', models: ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash'], keyPlaceholder: 'AIza...' },
  { id: 'groq', name: 'Groq', models: ['llama-3.1-8b-instant', 'llama-3.3-70b-versatile'], keyPlaceholder: 'gsk_...' },
  { id: 'mistral', name: 'Mistral AI', models: ['mistral-large-latest', 'mistral-small-latest'], keyPlaceholder: '...' },
];
