import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  User,
  Send,
  Sparkles,
  Shield,
  HelpCircle,
  Copy,
  Check,
  Code2,
  Terminal,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { ChatMessage, VulnerabilityFinding } from '../../types';

interface SecurityAssistantProps {
  findings: VulnerabilityFinding[];
  activeFinding?: VulnerabilityFinding | null;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    timestamp: 'Just now',
    content:
      'Hello! I am SentinelAI, your API security defense intelligence assistant. I analyze zero-trust scan telemetry, OWASP API risks, BOLA authorization flaws, and provide tailored remediation code for your tech stack. What would you like to investigate today?',
    suggestedActions: [
      'Explain this vulnerability',
      'How can I fix it?',
      'Show reproduction steps',
      'What is the potential impact?',
    ],
  },
];

export const SecurityAssistant: React.FC<SecurityAssistantProps> = ({
  findings,
  activeFinding = null,
}) => {
  const [selectedFinding, setSelectedFinding] = useState<VulnerabilityFinding | null>(
    activeFinding || (findings.length > 0 ? findings[0] : null)
  );
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeFinding) {
      setSelectedFinding(activeFinding);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-context-${Date.now()}`,
          sender: 'assistant',
          timestamp: 'Just now',
          content: `Context switched to: **${activeFinding.title}** on \`${activeFinding.endpoint}\` (${activeFinding.severity} severity). You can ask me how to patch this, generate test vectors, or explain the underlying root cause.`,
          suggestedActions: [
            `Why is ${activeFinding.endpoint} vulnerable?`,
            `Provide Express / Node.js fix for this`,
            `What is the CVSS exploitability factor?`,
          ],
        },
      ]);
    }
  }, [activeFinding]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputValue.trim();
    if (!query) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: 'Just now',
      content: query,
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    // Contextual intelligent responses
    setTimeout(() => {
      const finding = selectedFinding || findings[0];
      const lower = query.toLowerCase();
      let responseText = '';
      let codeSnippet: string | undefined = undefined;
      let suggested: string[] = [];

      if (lower.includes('why') || lower.includes('explain') || lower.includes('vulnerable')) {
        responseText = `The endpoint \`${finding.endpoint}\` appears vulnerable to **${finding.category}** because the server does not sufficiently verify whether the authenticated caller has legitimate ownership or authorized grant over the requested resource.\n\nSpecifically, the application accepts a user-controlled identifier in the request path and queries the datastore without joining against \`req.user.id\` or verifying an access control policy (CWE-639 / OWASP API1:2023).`;
        suggested = ['How can I fix it?', 'Show reproduction steps', 'What is the potential impact?'];
      } else if (lower.includes('fix') || lower.includes('remediat') || lower.includes('patch')) {
        responseText = `To remediate **${finding.title}**, implement strict server-side authorization checks before fulfilling the read/mutation action. Do not rely on client-side obfuscation or unverified proxy headers.\n\nHere is an enterprise-grade hardened pattern:`;
        codeSnippet = finding.recommendedFix.codeSnippet;
        suggested = ['Show reproduction steps', 'What is the potential impact?', 'Explain this vulnerability'];
      } else if (lower.includes('step') || lower.includes('reproduc') || lower.includes('poc')) {
        responseText = `Here are the exact reproduction steps for **${finding.title}** on \`${finding.endpoint}\`:\n\n${finding.reproductionSteps
          .map((s, i) => `${i + 1}. ${s}`)
          .join('\n')}\n\nReproducible curl payload:\n\`\`\`bash\n${finding.pocCurl}\n\`\`\``;
        suggested = ['How can I fix it?', 'What is the potential impact?'];
      } else if (lower.includes('impact') || lower.includes('consequence') || lower.includes('risk')) {
        responseText = `**Potential Impact Analysis:**\n\n${finding.impact}\n\n* **Confidentiality:** High — allows horizontal privilege traversal.\n* **Integrity:** Unauthorized modifications if applied to state-changing methods.\n* **Regulatory:** Violation of GDPR Article 32 and PCI DSS v4 Section 6.5.`;
        suggested = ['How can I fix it?', 'Explain this vulnerability'];
      } else if (lower.includes('rate limit') || lower.includes('brute')) {
        responseText = `To prevent credential stuffing and resource exhaustion, apply an atomic distributed token-bucket rate limiter at the API gateway or reverse proxy using Redis.\n\nKey parameters:\n* Window: 60 seconds\n* Max attempts: 5 per client IP\n* Account lockout: 15 minutes after 5 consecutive bad passwords\n* Status code returned: HTTP 429 Too Many Requests with \`Retry-After\` header.`;
        codeSnippet = `// Gateway rate limiter configuration
import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many requests, please try again in 15 minutes.' }
});`;
        suggested = ['How can I fix it?', 'Show reproduction steps'];
      } else {
        responseText = `Based on SentinelAPI scan telemetry for **${finding.apiName}** on endpoint \`${finding.endpoint}\`, we recommend enforcing zero-trust boundary verification on all inbound requests. Let me know if you would like me to generate a PoC, inspect request diffs, or provide unit test templates.`;
        suggested = [
          'Explain this vulnerability',
          'How can I fix it?',
          'Show reproduction steps',
          'What is the potential impact?',
        ];
      }

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        timestamp: 'Just now',
        content: responseText,
        codeSnippet,
        suggestedActions: suggested,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 600);
  };

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(idx);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded shadow-xl flex flex-col h-[calc(100vh-140px)] min-h-[550px]">
      {/* Panel Header with Finding Context Selector */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-tight">
                SentinelAI Security Assistant
              </h2>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                Context-Aware
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Interactive vulnerability analysis, PoC walkthroughs, and code patches
            </p>
          </div>
        </div>

        {/* Target Finding Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden md:inline">Inspect:</span>
          <select
            value={selectedFinding?.id || ''}
            onChange={(e) => {
              const f = findings.find((x) => x.id === e.target.value) || null;
              setSelectedFinding(f);
            }}
            className="text-xs bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            {findings.map((f) => (
              <option key={f.id} value={f.id}>
                [{f.severity.toUpperCase()}] {f.endpoint} — {f.title.slice(0, 30)}...
              </option>
            ))}
          </select>

          <button
            onClick={() => setMessages(INITIAL_MESSAGES)}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Reset Conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message Chat Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg, idx) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded p-3.5 space-y-2 leading-relaxed ${
                  isUser
                    ? 'bg-cyan-600 text-slate-950 font-medium rounded-tr-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {msg.codeSnippet && (
                  <div className="mt-3 relative rounded bg-slate-900 border border-slate-800 overflow-hidden font-mono text-[11px]">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950/80 border-b border-slate-800 text-slate-400 text-[10px]">
                      <span>Remediation Patch</span>
                      <button
                        onClick={() => handleCopyCode(msg.codeSnippet!, idx)}
                        className="hover:text-white flex items-center gap-1"
                      >
                        {copiedCodeIndex === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-3 text-emerald-300 overflow-x-auto">
                      <code>{msg.codeSnippet}</code>
                    </pre>
                  </div>
                )}

                {msg.suggestedActions && msg.suggestedActions.length > 0 && !isUser && (
                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                    {msg.suggestedActions.map((action, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => handleSendMessage(action)}
                        className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-cyan-300 text-[11px] transition-colors"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-3 text-xs items-center text-slate-400 font-mono">
            <div className="w-7 h-7 rounded bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] text-slate-500 ml-1">Analyzing vulnerability matrix...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Question Prompts */}
      <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[11px]">
        <span className="text-slate-500 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" /> Prompts:
        </span>
        <button
          onClick={() => handleSendMessage('Explain this vulnerability')}
          className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 whitespace-nowrap"
        >
          Explain this vulnerability
        </button>
        <button
          onClick={() => handleSendMessage('How can I fix it?')}
          className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 whitespace-nowrap"
        >
          How can I fix it?
        </button>
        <button
          onClick={() => handleSendMessage('Show reproduction steps')}
          className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 whitespace-nowrap"
        >
          Show reproduction steps
        </button>
        <button
          onClick={() => handleSendMessage('What is the potential impact?')}
          className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 whitespace-nowrap"
        >
          What is the potential impact?
        </button>
      </div>

      {/* User Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask SentinelAI about BOLA, auth bypass, rate limit mitigation, or test generation..."
          className="flex-1 px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isTyping}
          className="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
