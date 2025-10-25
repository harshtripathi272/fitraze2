import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, User, Sparkles, Send } from "lucide-react";

const API_BASE = "http://localhost:8000/api"; 

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your FitRaze AI assistant. I can help you with meal planning, workout suggestions, and answer any fitness questions you have!",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);

  const [embeddingReady, setEmbeddingReady] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);

  //Build embeddings when entered the chat page
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    const token = localStorage.getItem("access_token") || storedUser.token;
    if (!token) return;

    const buildEmbeddings = async () => {
      try {
        const res = await fetch(`${API_BASE}/build_embed`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log("Embeddings built:", data);
        setEmbeddingReady(true);
      } catch (err) {
        console.log("Error building embeddings:", err);
        setEmbeddingReady(false);
      }
    };

    buildEmbeddings();
  }, []);

  
  const sendMessage = async () => {
    const text = message.trim();
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    const token = localStorage.getItem("access_token") || storedUser.token;
    if (!text || !embeddingReady) {
      console.log("Message empty or embeddings not ready");
      return;
    }

    setMessage("");

    const newMessage = {
      id: messages.length + 1,
      text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setLoading(true);

    try {
      let sid = sessionId;
      const storedUser = JSON.parse(localStorage.getItem("fitRazeUser")) || {};
      const user_id = storedUser.userId;
      if (!user_id) throw new Error("No user found");

      if (!sid) {
        const res = await fetch(`${API_BASE}/start_session?user_id=${user_id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json"},
        });
        if (!res.ok) throw new Error("Failed to start session");
        const data = await res.json();
        sid = data.session_id;
        setSessionId(sid);
      }

      const chatRes = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", 
                  Authorization:`Bearer ${token}`},
        body: JSON.stringify({
          user_id,
          session_id: sid,
          message: text,
          require_retrieval: true,
        }),
      });

      if (!chatRes.ok) throw new Error("Chat request failed");
      const chatData = await chatRes.json();

      const aiResponse = {
        id: messages.length + 2,
        text: chatData.assistant_message,
        sender: "ai",
        timestamp: new Date(chatData.timestamp),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 2,
          text: "Failed to connect to AI server.",
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex flex-col">
      {/* Header */}
      <div className="glass-card m-4 p-4 rounded-2xl border border-glass-border">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10 glow">
            <AvatarFallback className="bg-primary/20 text-primary">
              <Bot className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-lg font-bold flex items-center">
              <Sparkles className="w-4 h-4 mr-1 text-accent" />
              FitRaze AI
            </h1>
            <p className="text-sm text-muted-foreground">
              Your personal fitness assistant
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 px-4 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex items-start space-x-2 max-w-[80%] ${
                msg.sender === "user"
                  ? "flex-row-reverse space-x-reverse"
                  : ""
              }`}
            >
              <Avatar className="w-8 h-8">
                <AvatarFallback
                  className={
                    msg.sender === "user"
                      ? "bg-accent/20 text-accent"
                      : "bg-primary/20 text-primary"
                  }
                >
                  {msg.sender === "user" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </AvatarFallback>
              </Avatar>

              <Card
                className={`glass-card border-glass-border ${
                  msg.sender === "user" ? "glow-accent" : "glow"
                }`}
              >
                <CardContent className="p-3">
                  <p className="text-sm">{msg.text}</p>
                  <span className="text-xs text-muted-foreground">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Suggestions */}
      <div className="px-4 py-2">
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            className="glass-card text-xs"
            onClick={() => setMessage("What should I eat for lunch?")}
          >
            Meal suggestions
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="glass-card text-xs"
            onClick={() => setMessage("Plan my workout for today")}
          >
            Workout plan
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="glass-card text-xs"
            onClick={() => setMessage("How am I progressing towards my goals?")}
          >
            Progress check
          </Button>
        </div>
      </div>

      
      <div className="p-4">
        <div className="glass-card p-3 rounded-2xl border border-glass-border">
          
          <form onSubmit={(e)=>{
            console.log("Form submitted");
            console.log("sendMessage:", sendMessage);
            e.preventDefault();
            sendMessage();
          }}
          className="flex items-center space-x-2"
          >
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask me anything about fitness..."
              className="flex-1 bg-transparent border-none focus:ring-0 focus:ring-offset-0"
            />
            <Button
              type="submit"
              size="sm"
              className="glow-accent"
              disabled={!message.trim() || loading}
            >
              <Send className="w-4 h-4" />
            </Button>
            </form>
          </div>
        
      </div>
    </div>
  );
}
