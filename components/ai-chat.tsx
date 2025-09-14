"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Response } from "@/components/ai-elements/response";
import { GlobeIcon } from "lucide-react";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/source";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Loader } from "@/components/ai-elements/loader";
import { ModelSelector } from "@/components/ai-elements/model-selector";
import { ModelChangeDialog } from "@/components/ai-elements/model-change-dialog";
import { allModels } from "@/lib/models";

const AIChat = () => {
  const [input, setInput] = useState("");
  const [model, setModel] = useState<string>(allModels[0].id);
  const [webSearch, setWebSearch] = useState(false);
  const [showModelDialog, setShowModelDialog] = useState(false);
  const [pendingModel, setPendingModel] = useState<string>("");
  const { messages, sendMessage, status, setMessages } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(
        { text: input },
        {
          body: {
            model: model,
            webSearch: webSearch,
          },
        }
      );
      setInput("");
    }
  };

  const handleModelChange = (newModel: string) => {
    if (messages.length > 0) {
      // Show warning dialog if there are existing messages
      setPendingModel(newModel);
      setShowModelDialog(true);
    } else {
      // No messages, safe to change immediately
      setModel(newModel);
    }
  };

  const handleConfirmModelChange = () => {
    setModel(pendingModel);
    setMessages([]);
    setShowModelDialog(false);
    setPendingModel("");
  };

  const handleCancelModelChange = () => {
    setShowModelDialog(false);
    setPendingModel("");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 relative size-full h-screen">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
          Script Creator
        </h1>
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent flex-1 max-w-32"></div>
          <span className="text-blue-300 font-medium text-lg">.online</span>
          <div className="h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent flex-1 max-w-32"></div>
        </div>
        <p className="text-slate-400 text-sm mt-2">AI-Powered Chat with 118 Models</p>
      </div>

      <div className="flex flex-col h-full bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden max-h-[700px]">
        <Conversation className="h-full">
          <ConversationContent className="px-6 py-4 text-white">
            {messages.map((message) => (
              <div key={message.id}>
                {message.role === "assistant" &&
                 message.parts.some(part => part.type === "source-url") && (
                  <Sources>
                    <SourcesTrigger
                      count={
                        message.parts.filter(
                          (part) => part.type === "source-url"
                        ).length
                      }
                    />
                    <SourcesContent>
                      {message.parts
                        .filter(part => part.type === "source-url")
                        .map((part, i) => (
                          <Source
                            key={`${message.id}-${i}`}
                            href={part.url}
                            title={part.url}
                          />
                        ))}
                    </SourcesContent>
                  </Sources>
                )}
                <Message from={message.role} key={message.id}>
                  <MessageContent>
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case "text":
                          return (
                            <Response key={`${message.id}-${i}`}>
                              {part.text}
                            </Response>
                          );
                        case "reasoning":
                          return (
                            <Reasoning
                              key={`${message.id}-${i}`}
                              className="w-full"
                              isStreaming={status === "streaming"}
                            >
                              <ReasoningTrigger />
                              <ReasoningContent>{part.text}</ReasoningContent>
                            </Reasoning>
                          );
                        default:
                          return null;
                      }
                    })}
                  </MessageContent>
                </Message>
              </div>
            ))}
            {status === "submitted" && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="p-6 bg-white/5 border-t border-white/10">
          <PromptInput onSubmit={handleSubmit} className="bg-white/10 border-white/20 rounded-xl">
            <PromptInputTextarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
              className="bg-transparent text-white placeholder:text-white/60 border-0 resize-none"
              placeholder="Type your message..."
            />
            <PromptInputToolbar className="bg-transparent border-t border-white/10">
              <PromptInputTools>
                <PromptInputButton
                  variant={webSearch ? "default" : "ghost"}
                  onClick={() => setWebSearch(!webSearch)}
                  className={webSearch ?
                    "bg-blue-600 hover:bg-blue-700 text-white" :
                    "text-white/80 hover:text-white hover:bg-white/10"
                  }
                >
                  <GlobeIcon size={16} />
                  <span>Search</span>
                </PromptInputButton>
                <ModelSelector
                  value={model}
                  onValueChange={handleModelChange}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                />
              </PromptInputTools>
              <PromptInputSubmit
                disabled={!input}
                status={status}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white disabled:from-gray-600 disabled:to-gray-600"
              />
            </PromptInputToolbar>
          </PromptInput>
        </div>

        <ModelChangeDialog
          open={showModelDialog}
          onOpenChange={setShowModelDialog}
          currentModel={model}
          newModel={pendingModel}
          onConfirm={handleConfirmModelChange}
          onCancel={handleCancelModelChange}
        />
      </div>
    </div>
  );
};

export default AIChat;
