import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AI_RESPONSES = {
  greeting: "Hello! I'm Medify AI Assistant. I can help you verify medications, understand supply chains, or answer questions about counterfeit drugs. How can I assist you today?",
  verify: "To verify a medication, click on 'Scan Now' in the navigation menu or go to the Scan page. You can scan the QR code or enter the batch ID manually.",
  counterfeit: "Counterfeit drugs are fake medications that may contain wrong ingredients, no active ingredients, or harmful substances. Our blockchain system helps detect them by tracking the complete supply chain from manufacturer to patient.",
  howItWorks: "Medify uses blockchain technology to create an immutable record of each drug's journey. Our AI analyzes patterns, packaging, and distribution routes to detect anomalies. Simply scan a QR code to instantly verify authenticity!",
  statistics: "We've verified over 2.3M drugs, detected 15,247 counterfeits, and operate in 18 African countries with 98.7% accuracy. Visit our Statistics page for detailed insights.",
  manufacturer: "If you're a manufacturer, you can register your products through our Manufacturer Dashboard. This allows you to create batch records, generate QR codes, and track distribution.",
  pharmacy: "Pharmacies can use our Pharmacy Portal to log dispensed medications, verify incoming stock, and report suspicious products to regulators.",
  regulator: "Regulators have access to comprehensive analytics, audit trails, and counterfeit alert systems through our Regulator Dashboard.",
  default: "I'm here to help! You can ask me about:\n• How to verify medications\n• Understanding counterfeit drugs\n• Our technology and statistics\n• Different user portals (Manufacturer, Pharmacy, Regulator)\n• Anything about Medify!",
};

const getAIResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return AI_RESPONSES.greeting;
  }
  if (lowerMessage.includes('verify') || lowerMessage.includes('scan') || lowerMessage.includes('check')) {
    return AI_RESPONSES.verify;
  }
  if (lowerMessage.includes('counterfeit') || lowerMessage.includes('fake')) {
    return AI_RESPONSES.counterfeit;
  }
  if (lowerMessage.includes('how') && (lowerMessage.includes('work') || lowerMessage.includes('does'))) {
    return AI_RESPONSES.howItWorks;
  }
  if (lowerMessage.includes('statistic') || lowerMessage.includes('number') || lowerMessage.includes('data')) {
    return AI_RESPONSES.statistics;
  }
  if (lowerMessage.includes('manufacturer') || lowerMessage.includes('produce')) {
    return AI_RESPONSES.manufacturer;
  }
  if (lowerMessage.includes('pharmacy') || lowerMessage.includes('pharmacist')) {
    return AI_RESPONSES.pharmacy;
  }
  if (lowerMessage.includes('regulator') || lowerMessage.includes('audit') || lowerMessage.includes('government')) {
    return AI_RESPONSES.regulator;
  }
  
  return AI_RESPONSES.default;
};

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: AI_RESPONSES.greeting,
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000));

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: getAIResponse(inputValue),
      sender: 'ai',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiResponse]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 size-16 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white shadow-2xl shadow-primary/40 flex items-center justify-center z-50 hover:shadow-3xl transition-shadow"
          >
            <MessageCircle className="size-7" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-6 right-6 w-[420px] h-[600px] bg-white rounded-3xl shadow-2xl border border-border z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-primary to-primary/80 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="size-6" />
                </div>
                <div>
                  <h3 className="text-lg">Medify AI</h3>
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-verified-green animate-pulse" />
                    <span className="text-xs text-white/90">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="size-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-background">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`size-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'ai'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-secondary/10 text-secondary'
                    }`}
                  >
                    {message.sender === 'ai' ? <Bot className="size-4" /> : <User className="size-4" />}
                  </div>
                  <div className="max-w-[75%]">
                    <div
                      className={`p-4 rounded-2xl ${
                        message.sender === 'ai'
                          ? 'bg-white border border-border rounded-tl-none'
                          : 'bg-primary text-white rounded-tr-none'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 px-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Bot className="size-4" />
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-border rounded-tl-none">
                    <div className="flex gap-1">
                      <div className="size-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="size-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="size-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="px-4 py-3 rounded-xl bg-primary text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="size-5" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                AI responses are for guidance. Always verify critical information.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
