import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MessageCircle, 
  Send, 
  Bot,
  User,
  Sparkles
} from "lucide-react";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your FitRaze AI assistant. I can help you with meal planning, workout suggestions, and answer any fitness questions you have!",
      sender: "ai",
      timestamp: new Date()
    },
    {
      id: 2,
      text: "What would you like to know about your fitness journey today?",
      sender: "ai", 
      timestamp: new Date()
    }
  ]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: "user",
        timestamp: new Date()
      };
      setMessages([...messages, newMessage]);
      setMessage("");
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          text: "Thanks for your message! This is a placeholder response. In the full app, I would provide personalized fitness advice based on your goals and progress.",
          sender: "ai",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
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
            <p className="text-sm text-muted-foreground">Your personal fitness assistant</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 px-4 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start space-x-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <Avatar className="w-8 h-8">
                <AvatarFallback className={msg.sender === 'user' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'}>
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
              
              <Card className={`glass-card border-glass-border ${msg.sender === 'user' ? 'glow-accent' : 'glow'}`}>
                <CardContent className="p-3">
                  <p className="text-sm">{msg.text}</p>
                  <span className="text-xs text-muted-foreground">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

      {/* Input */}
      <div className="p-4">
        <div className="glass-card p-3 rounded-2xl border border-glass-border">
          <div className="flex items-center space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask me anything about fitness..."
              className="flex-1 bg-transparent border-none focus:ring-0 focus:ring-offset-0"
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button 
              size="sm" 
              onClick={sendMessage}
              className="glow-accent"
              disabled={!message.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
