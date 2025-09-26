import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { chatService, formatTime } from '@/lib/chat';
import type { Message } from '../../worker/types';
import { cn } from '@/lib/utils';
export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollAreaRef.current) {
      const scrollableView = scrollAreaRef.current.querySelector('div');
      if (scrollableView) {
        scrollableView.scrollTop = scrollableView.scrollHeight;
      }
    }
  }, [messages, streamingMessage]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userMessageContent = input.trim();
    setInput('');
    setIsLoading(true);
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userMessageContent,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMessage]);
    await chatService.sendMessage(userMessageContent, undefined, (chunk) => {
      setStreamingMessage(prev => prev + chunk);
    });
    const finalMessages = await chatService.getMessages();
    if (finalMessages.success && finalMessages.data) {
      setMessages(finalMessages.data.messages);
    }
    setStreamingMessage('');
    setIsLoading(false);
  };
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="p-4 space-y-4">
            {messages.length === 0 && !isLoading && (
              <div className="text-center text-muted-foreground py-8">
                <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Ask me about your production data.</p>
                <p className="text-xs">e.g., "Any critical alerts?" or "Summarize today's performance."</p>
              </div>
            )}
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn('flex items-start gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                {msg.role === 'assistant' && <Bot className="w-5 h-5 flex-shrink-0 mt-1" />}
                <div className={cn(
                  'max-w-[80%] p-3 rounded-lg',
                  msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}>
                  <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                  <p className="text-xs opacity-70 mt-1 text-right">{formatTime(msg.timestamp)}</p>
                </div>
                {msg.role === 'user' && <User className="w-5 h-5 flex-shrink-0 mt-1" />}
              </motion.div>
            ))}
            {streamingMessage && (
              <div className="flex items-start gap-3 justify-start">
                <Bot className="w-5 h-5 flex-shrink-0 mt-1" />
                <div className="max-w-[80%] p-3 rounded-lg bg-muted">
                  <p className="whitespace-pre-wrap text-sm">{streamingMessage}<span className="animate-pulse">|</span></p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI Assistant..."
            className="pr-12"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </form>
    </div>
  );
}