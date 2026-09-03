"use client"

import * as React from "react"
import { Bot, Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export default function MigrationPage() {
  const [query, setQuery] = React.useState("")
  const [messages, setMessages] = React.useState([
    { role: "assistant", content: "Hello! I am the QShieldX AI Copilot. I can help you plan your post-quantum migration based on the cryptographic assets discovered in your network. What would you like to know?" }
  ])

  React.useEffect(() => {
    document.title = "Migration Planner | QShieldX"
  }, [])

  const handleSend = () => {
    if (!query.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: "user", content: query }]);
    setQuery("");
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Based on your latest scan, I recommend prioritizing the migration of the Core Payment Gateway. It is currently using RSA-2048 which is vulnerable to Shor's algorithm on a CRQC. I suggest migrating this to a hybrid TLS 1.3 setup using ML-KEM (Kyber) and ECDHE."
      }]);
    }, 1000);
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Post-Quantum Migration Planner</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Interact with our AI Copilot to generate structured migration reports and prioritize cryptographic upgrades.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="col-span-2 flex flex-col gap-4 min-h-0">
          <Card className="flex flex-col h-full border-primary/20 shadow-sm">
            <CardHeader className="bg-primary/5 pb-4 border-b">
              <div className="flex items-center gap-2">
                <Bot className="size-5 text-primary" />
                <CardTitle className="text-lg">AI Copilot</CardTitle>
              </div>
              <CardDescription>Ask questions about your CBOM or get migration advice.</CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 p-0 overflow-hidden relative">
              <ScrollArea className="h-full p-4">
                <div className="flex flex-col gap-4">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-lg p-3 text-sm ${
                        msg.role === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted/50 border'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
            
            <Separator />
            
            <CardFooter className="p-3 bg-muted/20">
              <div className="flex w-full items-center space-x-2">
                <Input 
                  type="text" 
                  placeholder="Ask about migrating RSA to Kyber..." 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1"
                />
                <Button size="icon" onClick={handleSend}>
                  <Send className="size-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="flex flex-col gap-4 h-full overflow-y-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-amber-500" />
                <CardTitle className="text-md">Generated Reports</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 border rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
                <p className="font-medium text-sm">Draft Migration Plan</p>
                <p className="text-xs text-muted-foreground mt-1">Generated today at 10:00 AM</p>
              </div>
              <div className="p-3 border rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
                <p className="font-medium text-sm">RSA Deprecation Strategy</p>
                <p className="text-xs text-muted-foreground mt-1">Generated yesterday</p>
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                Generate New Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
