import { GroqCompletionRequest, GroqCompletionResponse, GroqMessage } from '../../types';
import { 
  ANTI_GUILT_DIRECTIVE, 
  RECALL_PROMPT, 
  ERROR_DIAGNOSTIC_PROMPT, 
  CONCEPT_ANALOGY_PROMPT 
} from './prompts';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_KEY = '';

export const DEFAULT_AI_MODEL = 'qwen/qwen3.8-27b';
export const FAST_AI_MODEL = 'qwen/qwen3.8-27b';

export function getGroqApiKey(): string {
  if (typeof window !== 'undefined') {
    const localKey = localStorage.getItem('groq_api_key');
    if (localKey && localKey.trim()) {
      return localKey.trim();
    }
  }
  const envKey = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_GROQ_API_KEY;
  if (envKey && envKey.trim()) {
    return envKey.trim();
  }
  return DEFAULT_KEY;
}

export function setCustomGroqApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    if (key.trim()) {
      localStorage.setItem('groq_api_key', key.trim());
    } else {
      localStorage.removeItem('groq_api_key');
    }
  }
}

export async function callGroq(request: GroqCompletionRequest): Promise<string> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    throw new Error('You are currently offline. Groq Cloud requires an internet connection. Your local study progress and notes are safely saved!');
  }

  const apiKey = getGroqApiKey();
  if (!apiKey) {
    throw new Error('Groq API key not configured. Please set your key in Settings.');
  }

  const payload = {
    model: request.model || DEFAULT_AI_MODEL,
    messages: request.messages,
    temperature: request.temperature ?? 0.3,
    max_tokens: request.max_tokens ?? 1500,
    top_p: request.top_p ?? 0.95,
    stream: false
  };

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => null);
      const errMsg = errJson?.error?.message || `Groq API Error (${response.status}): ${response.statusText}`;
      throw new Error(errMsg);
    }

    const data: GroqCompletionResponse = await response.json();
    if (!data.choices || data.choices.length === 0 || !data.choices[0].message) {
      throw new Error('Received an empty response from Groq Cloud.');
    }

    const choice = data.choices[0];
    const content = choice.message?.content || (choice.message as unknown as { reasoning?: string })?.reasoning || '';
    if (!content.trim()) {
      throw new Error('Received an empty completion from Groq Cloud.');
    }

    return content;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('An unexpected error occurred while communicating with Groq Cloud.');
  }
}

export async function generateRecallQuestions(topic: string, context?: string): Promise<string> {
  const userContent = context 
    ? `Topic: ${topic}\n\nTask Notes & Context:\n${context}`
    : `Topic: ${topic}`;

  const messages: GroqMessage[] = [
    { role: 'system', content: RECALL_PROMPT },
    { role: 'user', content: userContent }
  ];

  return callGroq({
    model: FAST_AI_MODEL,
    messages,
    temperature: 0.4,
    max_tokens: 1200
  });
}

export interface ParsedDiagnostic {
  rawMarkdown: string;
  symptom: string;
  rootCause: string;
  codeFix: string;
  interviewLesson: string;
}

export function parseDiagnosticResponse(rawText: string): ParsedDiagnostic {
  let symptom = '';
  let rootCause = '';
  let codeFix = '';
  let interviewLesson = '';

  const symptomMatch = rawText.match(/### Symptom\s*([\s\S]*?)(?=### Root Cause|$)/i);
  if (symptomMatch) symptom = symptomMatch[1].trim();

  const rootCauseMatch = rawText.match(/### Root Cause\s*([\s\S]*?)(?=### Code Fix|$)/i);
  if (rootCauseMatch) rootCause = rootCauseMatch[1].trim();

  const codeFixMatch = rawText.match(/### Code Fix\s*([\s\S]*?)(?=### Interview Lesson|$)/i);
  if (codeFixMatch) {
    let fix = codeFixMatch[1].trim();
    // Strip markdown code fences if wrapped
    const fenceMatch = fix.match(/```(?:python)?\s*([\s\S]*?)```/i);
    if (fenceMatch) {
      fix = fenceMatch[1].trim();
    }
    codeFix = fix;
  }

  const lessonMatch = rawText.match(/### Interview Lesson\s*([\s\S]*?)$/i);
  if (lessonMatch) interviewLesson = lessonMatch[1].trim();

  return {
    rawMarkdown: rawText,
    symptom: symptom || rawText.slice(0, 150),
    rootCause: rootCause || 'See full diagnostic response.',
    codeFix: codeFix || '# Review raw explanation',
    interviewLesson: interviewLesson || 'Always inspect runtime data structures and types.'
  };
}

export async function diagnoseError(
  errorTrace: string,
  codeSnippet?: string,
  topic?: string
): Promise<ParsedDiagnostic> {
  const content = [
    topic ? `Topic/Context: ${topic}` : '',
    `Traceback / Error:\n${errorTrace}`,
    codeSnippet ? `Failing Code:\n\`\`\`python\n${codeSnippet}\n\`\`\`` : ''
  ].filter(Boolean).join('\n\n');

  const messages: GroqMessage[] = [
    { role: 'system', content: ERROR_DIAGNOSTIC_PROMPT },
    { role: 'user', content }
  ];

  const raw = await callGroq({
    model: DEFAULT_AI_MODEL,
    messages,
    temperature: 0.2,
    max_tokens: 1500
  });

  return parseDiagnosticResponse(raw);
}

export async function explainConceptAnalogy(
  concept: string, 
  language: 'en' | 'hinglish' = 'en'
): Promise<string> {
  const langPrompt = language === 'hinglish'
    ? 'Please explain this in natural, conversational Hinglish (like CampusX / CodeWithHarry style), mixing Hindi and English intuitively.'
    : 'Please explain this in clear, punchy English with an intuitive real-world analogy.';

  const messages: GroqMessage[] = [
    { role: 'system', content: `${CONCEPT_ANALOGY_PROMPT}\n${ANTI_GUILT_DIRECTIVE}` },
    { role: 'user', content: `Explain this concept: "${concept}".\n${langPrompt}` }
  ];

  return callGroq({
    model: DEFAULT_AI_MODEL,
    messages,
    temperature: 0.5,
    max_tokens: 1200
  });
}
