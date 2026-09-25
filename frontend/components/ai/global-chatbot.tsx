"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Plus,
  X,
  Sparkles,
  Send,
  Bot,
  User,
  ChevronDown,
  RotateCcw,
  ShieldCheck,
  Loader2,
} from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const suggestions = [
  "What is a cryptographic asset?",
  "Explain quantum risk.",
  "What is the Mosca algorithm?",
  "Which assets should we migrate first?",
];

function getDemoAnswer(question: string, page: string): string {
  const q = question.toLowerCase();

  if (
    q.includes("cryptographic asset") ||
    q.includes("what is crypto") ||
    q.includes("cryptography")
  ) {
    return `A cryptographic asset is any system component that uses cryptography to protect data or communications.

Examples include:
• TLS certificates
• RSA and ECC keys
• Encryption algorithms such as AES
• Digital signatures
• Cryptographic libraries and protocols

In QShieldX, these assets are discovered, classified, and assessed for cryptographic and post-quantum risks.

Current page: ${page}`;
  }

  if (
    q.includes("quantum risk") ||
    q.includes("quantum-vulnerable") ||
    q.includes("quantum vulnerable")
  ) {
    return `Quantum risk assessment evaluates how cryptographic assets may be affected by future cryptographically relevant quantum computers.

Key considerations:
• Algorithm: RSA and ECC are vulnerable to sufficiently capable quantum computers running Shor's algorithm.
• Data lifetime: sensitive data that must remain confidential for many years may need earlier protection.
• Migration time: replacing cryptography across dependent systems takes time.
• Exposure: public-facing services and critical systems may need careful prioritization.

QShieldX uses its risk assessment and migration priorities to help identify where to investigate first.

Note: this is a general explanation. A specific asset's risk requires its actual inventory and assessment records.`;
  }

  if (q.includes("mosca") || q.includes("d + t") || q.includes("d+t")) {
    return `Mosca's model helps assess whether data may remain sensitive beyond the expected arrival of a cryptographically relevant quantum computer.

The condition is:

D + T > Q

• D — how long the data must remain confidential.
• T — the time required to migrate the relevant systems.
• Q — the estimated time until a relevant quantum threat.

If D + T exceeds Q, the organization may need to begin migration planning sooner.

The result depends on the assumptions entered. It is a planning model, not a precise prediction of when a quantum computer will arrive.`;
  }

  if (
    q.includes("migrate first") ||
    q.includes("migration priority") ||
    q.includes("what should we migrate")
  ) {
    return `A practical migration order is:

1. Identify quantum-vulnerable public-facing services.
2. Prioritize systems protecting long-lived sensitive data.
3. Review certificates, key exchange, digital signatures, and dependencies.
4. Test suitable post-quantum or hybrid alternatives.
5. Validate compatibility and performance in a staging environment.
6. Roll out changes gradually with human approval.

For a data-driven priority list, the assistant must use the current QShieldX asset inventory and risk records. This frontend demo does not yet query those records.`;
  }

  if (q.includes("cbom") || q.includes("bill of materials")) {
    return `A Cryptographic Bill of Materials (CBOM) records cryptographic components used by a system.

A CBOM can help document:
• Algorithms and cryptographic assets
• Certificates and key-related information
• Component relationships and dependencies
• Evidence collected during discovery
• Findings that may affect migration planning

QShieldX's CBOM Explorer is intended to make this inventory searchable and easier to assess.

For exact component counts or a particular finding, I need to be connected to the current CBOM data.`;
  }

  if (q.includes("rsa")) {
    return `RSA is a public-key cryptographic algorithm commonly used for digital signatures and key establishment.

A sufficiently capable cryptographically relevant quantum computer running Shor's algorithm could break RSA's underlying factoring-based security.

Post-quantum migration should consider the specific use of RSA, protocol compatibility, certificate dependencies, and suitable alternatives. The replacement should be tested before deployment.`;
  }

  if (q.includes("sarvam") || q.includes("ai")) {
    return `QShieldX AI is the QShieldX assistant for understanding cryptographic assets, CBOM findings, quantum risk, and migration planning.

This frontend currently uses demo responses. The next step is to connect the chat to the FastAPI backend and Sarvam AI so answers can use your actual QShieldX data.`;
  }

  return `I can help explain cryptographic assets, CBOMs, quantum risk, Mosca's model, and post-quantum migration.

You are currently viewing: ${page}

This is the frontend demo assistant, so I don't yet have access to your live scan results or the complete hardcoded inventory. Once connected to the backend, I can answer questions using the relevant QShieldX records.

Try one of the suggested questions below.`;
}

export default function GlobalChatbot() {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm QShieldX AI, your QShieldX assistant. Ask me about cryptographic assets, CBOM findings, quantum risk, or migration recommendations.",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  async function sendMessage(text?: string) {
    const question = (text ?? input).trim();

    if (!question || isTyping) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
    };

    setMessages((previous) => [...previous, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // FRONTEND DEMO:
      // Replace this with the FastAPI /ai/chat request
      // when the backend endpoint is ready.
      await new Promise((resolve) => setTimeout(resolve, 500));

      const answer = getDemoAnswer(question, pathname || "/");

      setMessages((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: answer,
        },
      ]);
    } catch {
      setMessages((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Something went wrong. Please try asking your question again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  function resetChat() {
    setMessages([
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "Chat cleared. What would you like to know about QShieldX?",
      },
    ]);
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {/* Chat window */}
      {isOpen && (
        <section
          className="
            mb-4 flex h-[min(620px,calc(100dvh-120px))]
            w-[min(400px,calc(100vw-32px))]
            flex-col overflow-hidden rounded-2xl
            border border-white/10 bg-[#111114]
            text-white shadow-2xl shadow-black/40
          "
          aria-label="QShieldX AI chat"
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-white/10 bg-[#17171c] px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
              <Sparkles size={20} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="font-semibold">QShieldX AI</div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                QShieldX Assistant
              </div>
            </div>

            <button
              onClick={resetChat}
              className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
              title="Clear chat"
              aria-label="Clear chat"
            >
              <RotateCcw size={16} />
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
              title="Minimize chat"
              aria-label="Minimize chat"
            >
              <ChevronDown size={19} />
            </button>
          </div>

          {/* Demo notice */}
          <div className="border-b border-violet-400/10 bg-violet-500/[0.06] px-4 py-2">
            <p className="text-[11px] text-violet-200/80">
              Demo mode · Responses are not yet connected to live scan data
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-2.5 ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    message.role === "assistant"
                      ? "bg-violet-500/15 text-violet-300"
                      : "bg-blue-500/15 text-blue-300"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <Bot size={17} />
                  ) : (
                    <User size={17} />
                  )}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-3 text-sm leading-6 ${
                    message.role === "assistant"
                      ? "rounded-tl-sm bg-[#202026] text-zinc-200"
                      : "rounded-tr-sm bg-violet-600 text-white"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Loader2 size={16} className="animate-spin" />
                QshieldX AI is thinking...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested questions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-3">
              <p className="mb-2 text-xs text-zinc-500">
                Suggested questions
              </p>

              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    disabled={isTyping}
                    className="
                      rounded-full border border-white/10
                      px-3 py-2 text-left text-xs text-zinc-300
                      transition hover:border-violet-400/40
                      hover:bg-violet-500/10 hover:text-white
                      disabled:opacity-50
                    "
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void sendMessage();
            }}
            className="border-t border-white/10 p-3"
          >
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#1b1b21] p-2 focus-within:border-violet-400/50">
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about your crypto assets..."
                className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-zinc-500"
                disabled={isTyping}
              />

              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="
                  flex h-9 w-9 shrink-0 items-center justify-center
                  rounded-lg bg-violet-600 text-white
                  transition hover:bg-violet-500
                  disabled:cursor-not-allowed disabled:opacity-40
                "
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>

            <p className="mt-2 text-center text-[10px] text-zinc-600">
              Verify security recommendations before applying changes.
            </p>
          </form>
        </section>
      )}

      {/* Floating + button */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsOpen((previous) => !previous)}
          className="
            flex h-14 w-14 items-center justify-center
            rounded-full bg-violet-600 text-white
            shadow-lg shadow-violet-950/40
            transition duration-200
            hover:scale-105 hover:bg-violet-500
            focus:outline-none focus:ring-4 focus:ring-violet-400/30
          "
          aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
          title="Ask QShieldX AI"
        >
          {isOpen ? <X size={24} /> : <Plus size={27} />}
        </button>
      </div>
    </div>
  );
}