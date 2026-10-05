import React, { useState, useRef, useEffect } from 'react';
import {
  Activity,
  Send,
  ShieldCheck,
  AlertTriangle,
  Info,
  Sparkles,
  Bot,
  User,
  PhoneCall,
} from 'lucide-react';
import { UserProfile, AssessmentRecord } from '../types';

interface AiChatAssistantProps {
  user: UserProfile;
  latestAssessment?: AssessmentRecord;
  onOpenEmergency: () => void;
}

interface Message {
  role: 'user' | 'model';
  content: string;
  isEmergency?: boolean;
}

export const AiChatAssistant: React.FC<AiChatAssistantProps> = ({
  user,
  latestAssessment,
  onOpenEmergency,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: `Hello ${user.name}. I am the MediDiagnosis AI Health Education Companion.

I can explain medical terminology, provide general educational context on common symptoms, and suggest questions to ask your physician.

*Notice: I am an AI educational tool, not a doctor. I cannot provide a medical diagnosis or prescribe medications. If you are experiencing sudden, severe, or life-threatening symptoms, please call emergency services immediately.*`,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent, presetText?: string) => {
    if (e) e.preventDefault();
    const query = presetText || inputValue;
    if (!query.trim() || sending) return;

    const userMessage: Message = { role: 'user', content: query.trim() };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputValue('');
    setSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query.trim(),
          history: newHistory.slice(-8), // Send recent context
          assessmentContext: latestAssessment
            ? {
                symptoms: latestAssessment.symptoms,
                urgency: latestAssessment.assessment.urgency,
              }
            : undefined,
        }),
      });

      const data = await res.json();

      if (data.is_emergency) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'model',
            content: data.reply,
            isEmergency: true,
          },
        ]);
        onOpenEmergency();
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'model',
            content: data.reply || 'I am here to help you understand health topics. What else would you like to explore?',
          },
        ]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content: 'I apologize, but I am unable to connect to the medical knowledge service right now. Please seek advice directly from a licensed healthcare provider.',
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
          Patient Education Companion
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
          Clinical Education Assistant
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Evidence-grounded explanations of symptoms, lab tests, and doctor visit preparation.
        </p>
      </div>

      {/* Safety Guardrail Notice */}
      <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
        <div>
          <strong>Medical Safety Guardrails Active:</strong> The assistant will never prescribe doses, cannot confirm diagnoses, and will actively escalate any emergency symptoms to 911 / emergency services.
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[520px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                msg.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-teal-700 text-white'
                    : msg.isEmergency
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {msg.role === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              <div
                className={`max-w-[82%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-teal-700 text-white rounded-tr-xs'
                    : msg.isEmergency
                    ? 'bg-rose-50 border border-rose-300 text-rose-950 font-medium rounded-tl-xs'
                    : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {msg.isEmergency && (
                  <div className="mt-3 pt-3 border-t border-rose-200 flex justify-end">
                    <button
                      onClick={onOpenEmergency}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 text-white font-bold text-xs rounded-lg hover:bg-rose-700"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>View Emergency Dialing Details</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                <Activity className="w-4 h-4 animate-spin text-teal-600" />
              </div>
              <span>Searching clinical reference literature...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Prompts */}
        <div className="px-5 py-2 border-t border-slate-100 bg-slate-50/70 flex items-center gap-2 overflow-x-auto text-[11px] text-slate-600 scrollbar-none">
          <span className="shrink-0 font-semibold text-slate-400">Suggestions:</span>
          {[
            'What causes a sudden throbbing headache?',
            'When does a sore throat need antibiotics?',
            'What questions should I ask my doctor about asthma?',
            'Difference between viral vs bacterial bronchitis?',
          ].map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSend(undefined, prompt)}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg hover:border-teal-400 hover:text-teal-800 whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => handleSend(e)}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a health education question..."
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={sending || !inputValue.trim()}
            className="p-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white rounded-xl transition-colors shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
