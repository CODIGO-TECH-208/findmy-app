import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockConversations, mockMessages, currentUser, Message } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Search, Send, ImagePlus, Check, CheckCheck, ArrowLeft } from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    mockConversations[0]?.id || null
  );
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);

  const activeConversation = mockConversations.find(
    (c) => c.id === selectedConversation
  );
  const conversationMessages = mockMessages.filter(
    (m) => m.conversationId === selectedConversation
  );
  const otherParticipant = activeConversation?.participants.find(
    (p) => p.id !== currentUser.id
  );

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, "HH:mm");
    }
    if (isYesterday(date)) {
      return "Yesterday";
    }
    return format(date, "MMM d");
  };

  const getMessageStatus = (status: Message["status"]) => {
    switch (status) {
      case "sent":
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-primary" />;
    }
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    // In a real app, this would send the message
    setMessageInput("");
  };

  const handleSelectConversation = (convId: string) => {
    setSelectedConversation(convId);
    setShowMobileChat(true);
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
  };

  // Filter conversations
  const filteredConversations = mockConversations.filter((conv) => {
    const other = conv.participants.find((p) => p.id !== currentUser.id);
    return other?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex h-[calc(100vh-8rem)] md:h-[calc(100vh-10rem)] bg-card rounded-xl border overflow-hidden">
          {/* Conversations List */}
          <div
            className={cn(
              "w-full md:w-80 lg:w-96 border-r flex flex-col",
              showMobileChat && "hidden md:flex"
            )}
          >
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold mb-3">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              {filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No conversations yet
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const other = conv.participants.find(
                    (p) => p.id !== currentUser.id
                  );
                  return (
                    <button
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv.id)}
                      className={cn(
                        "w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors border-b",
                        selectedConversation === conv.id && "bg-muted"
                      )}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={other?.avatar} />
                          <AvatarFallback>
                            {other?.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {conv.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-sm truncate">
                            {other?.name}
                          </p>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {conv.lastMessage &&
                              formatMessageTime(conv.lastMessage.timestamp)}
                          </span>
                        </div>
                        {conv.item && (
                          <Badge
                            variant="secondary"
                            className="text-xs mb-1 mt-0.5"
                          >
                            Re: {conv.item.title}
                          </Badge>
                        )}
                        <p className="text-sm text-muted-foreground truncate">
                          {conv.lastMessage?.content}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </ScrollArea>
          </div>

          {/* Chat View */}
          <div
            className={cn(
              "flex-1 flex flex-col",
              !showMobileChat && "hidden md:flex"
            )}
          >
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={handleBackToList}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Avatar>
                    <AvatarImage src={otherParticipant?.avatar} />
                    <AvatarFallback>
                      {otherParticipant?.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{otherParticipant?.name}</p>
                    {activeConversation.item && (
                      <p className="text-xs text-muted-foreground">
                        About: {activeConversation.item.title}
                      </p>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {conversationMessages.map((message) => {
                      const isOwn = message.senderId === currentUser.id;
                      return (
                        <div
                          key={message.id}
                          className={cn(
                            "flex",
                            isOwn ? "justify-end" : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[80%] rounded-2xl px-4 py-2",
                              isOwn
                                ? "bg-primary text-primary-foreground rounded-br-sm"
                                : "bg-muted rounded-bl-sm"
                            )}
                          >
                            <p className="text-sm">{message.content}</p>
                            <div
                              className={cn(
                                "flex items-center gap-1 mt-1",
                                isOwn ? "justify-end" : "justify-start"
                              )}
                            >
                              <span
                                className={cn(
                                  "text-xs",
                                  isOwn
                                    ? "text-primary-foreground/70"
                                    : "text-muted-foreground"
                                )}
                              >
                                {format(new Date(message.timestamp), "HH:mm")}
                              </span>
                              {isOwn && getMessageStatus(message.status)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <ImagePlus className="h-5 w-5" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      size="icon"
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
