import { useState, useEffect, useRef } from "react";
import MainLayout from "../component/layouts/MainLayout";
import PageHeader from "../component/ui/PageHeader";
import { Bot, Send, User, Mic, MicOff, Volume2, VolumeX, Paperclip, X, AlertCircle } from "lucide-react";
import SkeletonLoader from "../component/ui/SkeletonLoader";

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I am your Amdox ERP Intelligent Assistant. You can ask me to fetch live reports (e.g. stock, expenses, leave) or ask me questions about this ERP system's architecture, modules, and security policies. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  
  // File attachments state
  const [attachment, setAttachment] = useState(null);
  const [attachmentText, setAttachmentText] = useState("");

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Speech-to-Text Setup
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Try Google Chrome.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onerror = (e) => {
      console.error("Speech recognition error", e);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.start();
  };

  // Text-to-Speech Output
  const speakText = (text) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Cancel current playing audio
    const cleanText = text.replace(/[*#`_\-]/g, ""); // Strip markdown tags
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Parse attached text/csv file client-side
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAttachment(file);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      setAttachmentText(text);
    };
    reader.readAsText(file);
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
    setAttachmentText("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async (e, customPrompt = null) => {
    if (e) e.preventDefault();
    
    const textToSend = customPrompt || input;
    if (!textToSend.trim() && !attachmentText) return;

    // Build query prompt
    let finalPrompt = textToSend;
    if (attachmentText) {
      finalPrompt += `\n\n[ATTACHED FILE: ${attachment.name}]\n\`\`\`\n${attachmentText}\n\`\`\``;
    }

    // Add user message to state
    const userMsg = { role: "user", content: textToSend, hasAttachment: !!attachment };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    handleRemoveAttachment();

    try {
      const token = localStorage.getItem("token");
      const history = messages.slice(-6).map(m => ({ role: m.role, content: m.content }));

      const res = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ prompt: finalPrompt, history })
      });

      if (!res.ok) throw new Error("AI query failed");
      const data = await res.json();
      
      const assistantMsg = { role: "assistant", content: data.response };
      setMessages(prev => [...prev, assistantMsg]);
      speakText(data.response);

    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "⚠️ Sorry, I encountered an error. Please check your network connection or verify your API configuration." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Markdown-like simple HTML parser
  const renderMessageContent = (content) => {
    const lines = content.split("\n");
    return lines.map((line, lIdx) => {
      // Headers
      if (line.startsWith("### ")) {
        return <h4 key={lIdx} style={{ margin: "12px 0 6px", fontWeight: "700" }}>{line.replace("### ", "")}</h4>;
      }
      if (line.startsWith("#### ")) {
        return <h5 key={lIdx} style={{ margin: "10px 0 4px", fontWeight: "600" }}>{line.replace("#### ", "")}</h5>;
      }
      // Lists
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return <li key={lIdx} style={{ marginLeft: "16px", marginBottom: "4px", fontSize: "14px" }}>{line.substring(2)}</li>;
      }
      if (/^\d+\.\s/.test(line)) {
        return <li key={lIdx} style={{ marginLeft: "16px", listStyleType: "decimal", marginBottom: "4px", fontSize: "14px" }}>{line.replace(/^\d+\.\s/, "")}</li>;
      }
      // Code blocks
      if (line.startsWith("```")) {
        return null; // Skip wrapper line
      }
      
      // Bold text markup regex
      let element = line;
      const boldRegex = /\*\*(.*?)\*\*/g;
      const codeRegex = /`(.*?)`/g;

      // Handle simple formatting
      if (boldRegex.test(line) || codeRegex.test(line)) {
        return (
          <p
            key={lIdx}
            style={{ margin: "0 0 8px", fontSize: "14px", lineHeight: 1.5 }}
            dangerouslySetInnerHTML={{
              __html: line
                .replace(boldRegex, "<strong>$1</strong>")
                .replace(codeRegex, "<code style='background:rgba(0,0,0,0.06);padding:2px 4px;border-radius:4px;'>$1</code>")
            }}
          />
        );
      }

      return <p key={lIdx} style={{ margin: "0 0 8px", fontSize: "14px", lineHeight: 1.5 }}>{line}</p>;
    });
  };

  const quickPrompts = [
    { label: "Explain Amdox ERP architecture", icon: "🏗️" },
    { label: "List active security policies", icon: "🔒" },
    { label: "Which products are low in stock?", icon: "📦" },
    { label: "Show pending tickets", icon: "🎫" }
  ];

  return (
    <MainLayout>
      <PageHeader
        title="AI Assistant"
        subtitle="Intelligent context-aware analytics and natural language automation."
      />

      <div
        className="content-card"
        style={{
          height: "calc(100vh - 210px)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          padding: 0
        }}
      >
        {/* Chat area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {messages.map((msg, index) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: "12px",
                  maxWidth: "80%",
                  alignSelf: isUser ? "flex-end" : "flex-start",
                  flexDirection: isUser ? "row-reverse" : "row"
                }}
              >
                {/* Avatar icon */}
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: isUser ? "var(--primary-color)" : "var(--border-color)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isUser ? "#ffffff" : "var(--primary-color)",
                    flexShrink: 0
                  }}
                >
                  {isUser ? <User size={18} /> : <Bot size={18} />}
                </div>

                {/* Bubble bubble */}
                <div
                  style={{
                    background: isUser ? "var(--primary-color)" : "var(--bg-page)",
                    color: isUser ? "#ffffff" : "var(--text-main)",
                    padding: "12px 18px",
                    borderRadius: isUser ? "18px 18px 2px 18px" : "18px 18px 18px 2px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
                  }}
                >
                  {renderMessageContent(msg.content)}
                  {msg.hasAttachment && (
                    <div style={{ marginTop: "8px", fontSize: "11px", opacity: 0.8, display: "flex", alignItems: "center", gap: "4px" }}>
                      📎 File parsed & analyzed
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {loading && (
            <div style={{ display: "flex", gap: "12px", alignSelf: "flex-start" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--border-color)", display: "flex", alignItems: "center", justifyCenter: "center", flexShrink: 0 }}>
                <Bot size={18} style={{ color: "var(--primary-color)", margin: "auto" }} />
              </div>
              <div style={{ background: "var(--bg-page)", padding: "16px", borderRadius: "18px 18px 18px 2px", width: "120px" }}>
                <div className="skeleton-box" style={{ height: "12px", width: "100%", marginBottom: "6px" }} />
                <div className="skeleton-box" style={{ height: "12px", width: "70%" }} />
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Quick Prompts Panel */}
        {messages.length === 1 && !loading && (
          <div style={{ padding: "0 24px 16px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(null, p.label)}
                style={{
                  padding: "10px 14px",
                  background: "var(--bg-page)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  textAlign: "left",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "var(--text-main)",
                  transition: "background 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--border-color)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "var(--bg-page)"}
              >
                <span>{p.icon}</span>
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border-color)", background: "var(--bg-card)" }}>
          {/* File Attachment Pill */}
          {attachment && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "var(--primary-light)", padding: "6px 12px", borderRadius: "20px", marginBottom: "12px", fontSize: "12px", color: "var(--primary-color)", fontWeight: "600" }}>
              <Paperclip size={14} />
              <span>{attachment.name} ({Math.round(attachment.size / 1024)} KB)</span>
              <button onClick={handleRemoveAttachment} style={{ border: "none", background: "transparent", cursor: "pointer", display: "flex", color: "var(--primary-color)" }}>
                <X size={14} />
              </button>
            </div>
          )}

          <form onSubmit={handleSend} style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
            {/* Main Text Input */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about employees, stock levels, payroll budget..."
              style={{
                width: "100%",
                height: "42px",
                margin: 0,
                boxSizing: "border-box",
                padding: "10px 14px",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                background: "var(--bg-page)",
                color: "var(--text-main)"
              }}
              disabled={loading}
            />

            {/* Actions Toolbar Row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {/* Left actions */}
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                {/* Attachments Trigger */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".csv,.txt,.json"
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    flexShrink: 0
                  }}
                  title="Attach File (.txt, .csv, .json)"
                >
                  <Paperclip size={18} />
                </button>

                {/* Voice Rec / Mic */}
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  style={{
                    background: isListening ? "#ef4444" : "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: isListening ? "#ffffff" : "var(--text-muted)",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    flexShrink: 0
                  }}
                  title="Voice Input"
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>

                {/* Text-To-Speech Toggle */}
                <button
                  type="button"
                  onClick={() => setVoiceEnabled(prev => !prev)}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: voiceEnabled ? "var(--primary-color)" : "var(--text-muted)",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    flexShrink: 0
                  }}
                  title={voiceEnabled ? "Mute Voice Output" : "Enable Voice Output"}
                >
                  {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
              </div>

              {/* Right Send Button */}
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  height: "36px",
                  padding: "0 18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  minWidth: "auto",
                  border: "none"
                }}
                disabled={loading || (!input.trim() && !attachmentText)}
              >
                <span>Send</span>
                <Send size={14} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}