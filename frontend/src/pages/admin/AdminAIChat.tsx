import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { animate } from 'animejs';
import { chatAPI } from '@/services/api';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MessageSquare, Send, Upload, FileText, Trash2, Bot, User, Sparkles,
  Loader2, Plus, History, Settings, ChevronDown, Copy, RefreshCw,
  FileUp, X, Check, AlertCircle, Zap, Brain, BookOpen, MoreHorizontal,
  Download, Eye, Clock, CheckCircle2, Database, FileSearch, Cpu,
  HardDrive, Search, MessageCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { ChatMessage, KnowledgeDocument, ChatResponse } from '@/types';

const SUGGESTED_PROMPTS = [
  "What's our company's leave policy?",
  "How do I request time off?",
  "What are the performance review criteria?",
  "Explain the onboarding process",
  "What benefits do we offer?",
];

// Upload progress steps
const UPLOAD_STEPS = [
  { id: 'uploading', label: 'Uploading file', icon: Upload },
  { id: 'extracting', label: 'Extracting text', icon: FileSearch },
  { id: 'chunking', label: 'Creating chunks', icon: FileText },
  { id: 'embedding', label: 'Generating embeddings', icon: Cpu },
  { id: 'storing', label: 'Storing vectors', icon: Database },
  { id: 'saving', label: 'Saving metadata', icon: HardDrive },
  { id: 'complete', label: 'Complete', icon: CheckCircle2 },
];

// Chat processing steps
const CHAT_STEPS = [
  { id: 'analyzing', label: 'Analyzing message', icon: MessageCircle },
  { id: 'embedding', label: 'Creating query embedding', icon: Cpu },
  { id: 'searching', label: 'Searching knowledge base', icon: Search },
  { id: 'retrieving', label: 'Retrieving relevant chunks', icon: FileSearch },
  { id: 'thinking', label: 'AI reasoning', icon: Brain },
  { id: 'generating', label: 'Generating response', icon: Sparkles },
];

// Progress Dialog Component
function ProcessingDialog({ 
  isOpen, 
  title, 
  steps, 
  currentStep, 
  onClose,
  error
}: { 
  isOpen: boolean;
  title: string;
  steps: typeof UPLOAD_STEPS;
  currentStep: number;
  onClose?: () => void;
  error?: string | null;
}) {
  const progress = Math.round(((currentStep + 1) / steps.length) * 100);
  
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
              <Cpu className="w-5 h-5 text-white animate-pulse" />
            </div>
            {title}
          </DialogTitle>
          <DialogDescription>
            Processing your request...
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-primary">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          {/* Steps */}
          <div className="space-y-2 mt-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isComplete = index < currentStep;
              const isPending = index > currentStep;
              
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-3 p-2.5 rounded-lg transition-all ${
                    isActive ? 'bg-violet-500/10 border border-violet-500/30' :
                    isComplete ? 'bg-green-500/10' :
                    'bg-secondary/50'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${
                    isActive ? 'bg-violet-500 text-white' :
                    isComplete ? 'bg-green-500 text-white' :
                    'bg-secondary text-muted-foreground'
                  }`}>
                    {isComplete ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isActive ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <span className={`text-sm ${
                    isActive ? 'font-medium text-violet-600' :
                    isComplete ? 'text-green-600' :
                    'text-muted-foreground'
                  }`}>
                    {step.label}
                  </span>
                  {isActive && (
                    <motion.div
                      className="ml-auto flex gap-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-violet-500"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
          
          {/* Error state */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">Error</span>
              </div>
              <p className="mt-1 text-xs">{error}</p>
            </motion.div>
          )}
        </div>
        
        {(currentStep >= steps.length - 1 || error) && onClose && (
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function AdminAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [lastResponse, setLastResponse] = useState<ChatResponse | null>(null);
  const [showReasoning, setShowReasoning] = useState(true);
  const [showSources, setShowSources] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Processing state
  const [uploadProgress, setUploadProgress] = useState({ isOpen: false, step: 0, error: null as string | null });
  const [chatProgress, setChatProgress] = useState({ isOpen: false, step: 0 });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Animate new messages
  useEffect(() => {
    const lastMsg = document.querySelector('.chat-message:last-child');
    if (lastMsg) {
      animate(lastMsg, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 400,
        easing: 'easeOutExpo'
      });
    }
  }, [messages]);

  const fetchDocuments = async () => {
    try {
      const data = await chatAPI.getDocuments();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    }
  };

  const simulateChatProgress = async () => {
    // Simulate progress through chat steps
    for (let i = 0; i < CHAT_STEPS.length - 1; i++) {
      setChatProgress(prev => ({ ...prev, step: i }));
      await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 300));
    }
  };

  const handleSend = async (promptOverride?: string) => {
    const messageText = promptOverride || input;
    if (!messageText.trim() || isLoading) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      sources: [],
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setChatProgress({ isOpen: true, step: 0 });

    try {
      // Start progress simulation
      const progressPromise = simulateChatProgress();
      
      const response = await chatAPI.sendMessage(messageText, sessionId || undefined);
      
      // Wait for progress animation to catch up
      await progressPromise;
      setChatProgress(prev => ({ ...prev, step: CHAT_STEPS.length - 1 }));
      
      setSessionId(response.session_id);
      setLastResponse(response);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        sources: response.sources?.map((s: any) => s.name) || [],
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Close progress after brief delay
      setTimeout(() => {
        setChatProgress({ isOpen: false, step: 0 });
      }, 500);
      
    } catch (error: any) {
      setChatProgress({ isOpen: false, step: 0 });
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to get response',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const simulateUploadProgress = async () => {
    const delays = [300, 500, 400, 800, 400, 300, 200];
    for (let i = 0; i < UPLOAD_STEPS.length - 1; i++) {
      setUploadProgress(prev => ({ ...prev, step: i }));
      await new Promise(resolve => setTimeout(resolve, delays[i] || 300));
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.name.match(/\.(pdf|doc|docx)$/i)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload PDF, DOC, or DOCX files only',
        variant: 'destructive'
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Maximum file size is 10MB',
        variant: 'destructive'
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress({ isOpen: true, step: 0, error: null });

    try {
      // Start progress simulation
      const progressPromise = simulateUploadProgress();
      
      const result = await chatAPI.uploadDocument(file);
      
      // Wait for progress animation
      await progressPromise;
      setUploadProgress(prev => ({ ...prev, step: UPLOAD_STEPS.length - 1 }));
      
      // Close dialog after brief delay
      setTimeout(() => {
        setUploadProgress({ isOpen: false, step: 0, error: null });
        toast({
          title: result.duplicate ? 'Document exists' : 'Upload successful!',
          description: result.duplicate 
            ? 'This document has already been uploaded' 
            : `${file.name} uploaded with ${result.chunks_created} chunks`,
        });
      }, 800);
      
      fetchDocuments();
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || 'Failed to upload document';
      setUploadProgress(prev => ({ ...prev, error: errorMsg }));
      
      // Keep dialog open to show error
      setTimeout(() => {
        setUploadProgress({ isOpen: false, step: 0, error: null });
      }, 3000);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteDocument = async (id: string) => {
    setIsDeleting(true);
    try {
      await chatAPI.deleteDocument(id);
      toast({ 
        title: 'Document deleted', 
        description: 'Document and its vector embeddings have been removed from the knowledge base' 
      });
      fetchDocuments();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete document', variant: 'destructive' });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  const handleClearHistory = async () => {
    try {
      await chatAPI.clearHistory(sessionId || undefined);
      setMessages([]);
      setSessionId(null);
      setLastResponse(null);
      toast({ title: 'Chat cleared', description: 'Conversation history has been cleared' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to clear history', variant: 'destructive' });
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setSessionId(null);
    setLastResponse(null);
    inputRef.current?.focus();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: 'Message copied to clipboard' });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-120px)] flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Card className="flex-1 flex flex-col border-0 shadow-xl bg-card/80 backdrop-blur-sm overflow-hidden">
            {/* Chat Header */}
            <CardHeader className="border-b bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-pink-500/10 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      AI HR Assistant
                      <Badge variant="outline" className="text-[10px] font-semibold bg-violet-500/10 text-violet-600 border-violet-200">
                        RAG Powered
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Ask questions about company policies & procedures
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleNewChat} className="gap-2" data-testid="new-chat-btn">
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">New Chat</span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleClearHistory} className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear History
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>

            {/* Messages Area */}
            <ScrollArea className="flex-1">
              <div className="p-4 lg:p-6">
                {messages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center py-12"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center mb-6">
                      <Brain className="w-10 h-10 text-violet-500" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">HR Knowledge Assistant</h3>
                    <p className="text-muted-foreground max-w-md mb-8">
                      I can help you find information from your uploaded HR documents.
                      Upload policies, handbooks, or procedures to get started.
                    </p>
                    
                    {/* Suggested prompts */}
                    <div className="w-full max-w-lg">
                      <p className="text-sm text-muted-foreground mb-3">Try asking:</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {SUGGESTED_PROMPTS.map((prompt, i) => (
                          <motion.button
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            onClick={() => handleSend(prompt)}
                            className="px-3 py-2 text-sm bg-secondary hover:bg-secondary/80 rounded-lg transition-colors text-left"
                            data-testid={`suggested-prompt-${i}`}
                          >
                            {prompt}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-6">
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        className={`chat-message flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {msg.role === 'assistant' && (
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                        )}
                        
                        <div className={`group relative max-w-[85%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                          <div
                            className={`rounded-2xl p-4 ${
                              msg.role === 'user'
                                ? 'bg-gradient-to-br from-primary to-violet-600 text-white rounded-br-md'
                                : 'bg-secondary/80 rounded-bl-md'
                            }`}
                          >
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                            
                            {/* Sources */}
                            {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && showSources && (
                              <div className="mt-3 pt-3 border-t border-current/10">
                                <p className="text-xs opacity-60 mb-2 flex items-center gap-1">
                                  <BookOpen className="w-3 h-3" />
                                  Sources
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {msg.sources.map((source, i) => (
                                    <Badge
                                      key={i}
                                      variant="outline"
                                      className="text-[10px] bg-white/10"
                                    >
                                      {source}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Message actions */}
                          <div className={`absolute top-0 ${msg.role === 'user' ? 'left-0 -translate-x-full pr-2' : 'right-0 translate-x-full pl-2'} opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1`}>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => copyToClipboard(msg.content)}
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                          
                          {/* Timestamp */}
                          <p className={`text-[10px] text-muted-foreground mt-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        
                        {msg.role === 'user' && (
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shrink-0">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                    
                    {/* Simple loading indicator when progress dialog is open */}
                    {isLoading && !chatProgress.isOpen && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-3"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-secondary/80 rounded-2xl rounded-bl-md p-4">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              {[0, 1, 2].map((i) => (
                                <motion.div
                                  key={i}
                                  className="w-2 h-2 rounded-full bg-violet-500"
                                  animate={{ y: [0, -6, 0] }}
                                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">Thinking...</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Reasoning Banner */}
            <AnimatePresence>
              {lastResponse?.reasoning && showReasoning && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 py-2 bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-t border-violet-200/30"
                >
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-violet-500" />
                    <span className="font-medium text-violet-600">Reasoning:</span>
                    {lastResponse.reasoning}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Area */}
            <div className="p-4 border-t bg-secondary/30">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    placeholder="Ask about company policies, HR procedures..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    disabled={isLoading}
                    className="pr-12 h-12 bg-card border-border/50 focus:border-violet-500 focus:ring-violet-500/20"
                    data-testid="chat-input"
                  />
                  <Button
                    size="icon"
                    onClick={() => handleSend()}
                    disabled={isLoading || !input.trim()}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25"
                    data-testid="send-message-btn"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 text-center">
                Press Enter to send • Responses based on {documents.length} uploaded document{documents.length !== 1 ? 's' : ''}
              </p>
            </div>
          </Card>
        </div>

        {/* Sidebar - Knowledge Base & Settings */}
        <div className="w-full lg:w-80 xl:w-96 flex flex-col gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="chat" className="gap-2">
                <FileText className="w-4 h-4" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Documents Tab */}
            <TabsContent value="chat" className="flex-1 m-0">
              <Card className="h-full border-0 shadow-xl bg-card/80 backdrop-blur-sm flex flex-col">
                <CardHeader className="border-b py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        Knowledge Base
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {documents.length} document{documents.length !== 1 ? 's' : ''} indexed
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-4 min-h-0">
                  {/* Upload Button */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleUpload}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    data-testid="file-input"
                  />
                  <Button
                    variant="outline"
                    className="w-full mb-4 h-12 border-dashed border-2 hover:border-primary hover:bg-primary/5 gap-2"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    data-testid="upload-document-btn"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FileUp className="w-5 h-5" />
                        Upload Document
                      </>
                    )}
                  </Button>
                  <p className="text-[10px] text-muted-foreground text-center mb-4">
                    PDF, DOC, DOCX • Max 10MB
                  </p>

                  {/* Documents List */}
                  <ScrollArea className="flex-1 -mx-4 px-4">
                    {documents.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-4">
                          <FileText className="w-7 h-7 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-foreground mb-1">No documents yet</p>
                        <p className="text-xs text-muted-foreground">
                          Upload HR policies and handbooks
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {documents.map((doc) => (
                          <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group relative p-3 bg-secondary/50 hover:bg-secondary rounded-xl transition-colors"
                            data-testid={`document-item-${doc.id}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg shrink-0 ${
                                doc.file_type === 'pdf' ? 'bg-red-100 text-red-600' :
                                'bg-blue-100 text-blue-600'
                              }`}>
                                <FileText className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate pr-8">{doc.filename}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[10px] text-muted-foreground uppercase font-medium">
                                    {doc.file_type}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground">•</span>
                                  <span className="text-[10px] text-muted-foreground">
                                    {doc.chunk_count} chunks
                                  </span>
                                  {doc.file_size && (
                                    <>
                                      <span className="text-[10px] text-muted-foreground">•</span>
                                      <span className="text-[10px] text-muted-foreground">
                                        {formatFileSize(doc.file_size)}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => {
                                  setDocumentToDelete(doc.id);
                                  setDeleteDialogOpen(true);
                                }}
                                className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
                                data-testid={`delete-document-${doc.id}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="flex-1 m-0">
              <Card className="h-full border-0 shadow-xl bg-card/80 backdrop-blur-sm">
                <CardHeader className="border-b py-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Settings className="w-4 h-4 text-primary" />
                    Chat Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-6">
                  {/* Display Settings */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-foreground">Display</h4>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm">Show Reasoning</Label>
                        <p className="text-[10px] text-muted-foreground">
                          Display AI thinking process
                        </p>
                      </div>
                      <Switch
                        checked={showReasoning}
                        onCheckedChange={setShowReasoning}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm">Show Sources</Label>
                        <p className="text-[10px] text-muted-foreground">
                          Display document references
                        </p>
                      </div>
                      <Switch
                        checked={showSources}
                        onCheckedChange={setShowSources}
                      />
                    </div>
                  </div>

                  {/* Model Info */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-foreground">Model Info</h4>
                    <div className="p-3 bg-secondary/50 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">LLM</span>
                        <span className="font-medium">LLaMA 3.1 8B</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Provider</span>
                        <span className="font-medium">Groq</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Embeddings</span>
                        <span className="font-medium">MiniLM-L6-v2</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Vector Store</span>
                        <span className="font-medium">Qdrant</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={handleClearHistory}
                    >
                      <History className="w-4 h-4" />
                      Clear Chat History
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Upload Processing Dialog */}
      <ProcessingDialog
        isOpen={uploadProgress.isOpen}
        title="Processing Document"
        steps={UPLOAD_STEPS}
        currentStep={uploadProgress.step}
        error={uploadProgress.error}
        onClose={() => setUploadProgress({ isOpen: false, step: 0, error: null })}
      />

      {/* Chat Processing Dialog */}
      <ProcessingDialog
        isOpen={chatProgress.isOpen}
        title="Processing Query"
        steps={CHAT_STEPS}
        currentStep={chatProgress.step}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              Delete Document
            </DialogTitle>
            <DialogDescription>
              This will permanently delete this document and all its indexed vector embeddings from the knowledge base.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => documentToDelete && handleDeleteDocument(documentToDelete)}
              disabled={isDeleting}
              data-testid="confirm-delete-btn"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Document'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
