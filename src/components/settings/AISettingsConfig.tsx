import React, { useState } from 'react';
import { Cpu, Key, Eye, EyeOff, Check, RefreshCw, Zap, AlertTriangle } from 'lucide-react';
import { getGroqApiKey, callGroq } from '../../services/ai';
import { useProfileStore } from '../../stores/useProfileStore';

const AI_MODELS = [
  { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B Versatile', desc: 'Deep multi-step reasoning, architecture & code intuition (Recommended)' },
  { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant', desc: 'Ultra-fast inference (~150ms) with highest token quotas' },
  { id: 'qwen/qwen3.8-27b', name: 'Qwen 3.8 27B', desc: 'Experimental preview (Strict 1k OTPM quota on Groq free tier)' }
];

export const AISettingsConfig: React.FC = () => {
  const { updateGroqApiKey } = useProfileStore();

  const [currentKey, setCurrentKey] = useState(getGroqApiKey());
  const [showKey, setShowKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState(() => {
    return localStorage.getItem('groq_model') || 'llama-3.3-70b-versatile';
  });

  const [testState, setTestState] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testLatency, setTestLatency] = useState<number | null>(null);
  const [testError, setTestError] = useState<string | null>(null);

  const handleSaveKey = () => {
    updateGroqApiKey(currentKey);
    localStorage.setItem('groq_api_key', currentKey.trim());
    setTestState('idle');
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    localStorage.setItem('groq_model', modelId);
  };

  const handleTestConnection = async () => {
    setTestState('testing');
    setTestError(null);
    const start = performance.now();

    try {
      await callGroq({
        messages: [
          { role: 'user', content: 'Ping test. Reply with "pong".' }
        ],
        model: selectedModel,
        max_tokens: 10,
        temperature: 0.1
      });
      const duration = Math.round(performance.now() - start);
      setTestLatency(duration);
      setTestState('success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Connection test failed';
      setTestError(msg);
      setTestState('error');
    }
  };

  const handleResetDefaultKey = () => {
    const defaultKey = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_GROQ_API_KEY || '';
    setCurrentKey(defaultKey);
    updateGroqApiKey(defaultKey);
    localStorage.setItem('groq_api_key', defaultKey);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Cpu size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Groq Cloud LPU™ Inference</h3>
            <p className="text-[11px] text-slate-700">Sub-second AI mentor & Bug Doctor</p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center">
          <Zap size={11} className="mr-1 fill-emerald-600 text-emerald-600" /> Active
        </span>
      </div>

      {/* Model Selection */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-900">Active Inference Model</label>
        <div className="space-y-1.5">
          {AI_MODELS.map(m => {
            const isSelected = selectedModel === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => handleModelChange(m.id)}
                className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-500 text-blue-900'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                    <span>{m.name}</span>
                    {m.id === 'llama-3.3-70b-versatile' && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-600 font-medium mt-0.5">{m.desc}</div>
                </div>
                {isSelected && <Check size={16} className="text-blue-600 shrink-0 ml-2 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Groq API Key Input */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-900">API Key Override</label>
          <button
            type="button"
            onClick={handleResetDefaultKey}
            className="text-[10px] font-bold text-blue-600 hover:text-blue-700"
          >
            Restore Default Key
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Key size={14} />
          </div>
          <input
            type={showKey ? 'text' : 'password'}
            value={currentKey}
            onChange={e => setCurrentKey(e.target.value)}
            placeholder="gsk_..."
            style={{ fontSize: '16px' }}
            className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-10 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono shadow-sm"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-800"
          >
            {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </div>

      {/* Action Buttons: Save & Test Connection */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          type="button"
          onClick={handleSaveKey}
          className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-1.5"
        >
          <Check size={13} strokeWidth={3} />
          <span>Save Key</span>
        </button>

        <button
          type="button"
          onClick={handleTestConnection}
          disabled={testState === 'testing'}
          className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-900 border border-slate-300 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-1.5 disabled:opacity-50"
        >
          {testState === 'testing' ? (
            <>
              <RefreshCw size={13} className="animate-spin text-blue-600" />
              <span>Pinging...</span>
            </>
          ) : (
            <>
              <Zap size={13} className="text-blue-600" />
              <span>Test Latency</span>
            </>
          )}
        </button>
      </div>

      {/* Test Feedback */}
      {testState === 'success' && testLatency !== null && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-xs text-emerald-900 font-medium">
          <Check size={14} className="text-emerald-600 shrink-0 stroke-[3]" />
          <span>
            LPU™ Online: Ping response received in <strong>{testLatency}ms</strong>!
          </span>
        </div>
      )}

      {testState === 'error' && testError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2 text-xs text-red-900 font-medium">
          <AlertTriangle size={14} className="text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold text-red-950">Groq API Error</p>
            <p className="text-[11px] text-red-800">{testError}</p>
          </div>
        </div>
      )}
    </div>
  );
};
