import { Sparkles, ChevronDown, Send, Loader2, RotateCcw } from "lucide-react"
import { useAuth } from "../../context/context"
import { useEffect, useState, useRef } from "react"
import { AI, fetchHistory } from "../../services/AI";



const MessageBubble = ({ text, sender }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const MAX_LENGTH = 100; 
  
  const needsTruncation = text?.length > MAX_LENGTH;
  const displayText = needsTruncation && !isExpanded 
    ? text.slice(0, MAX_LENGTH) + "..." 
    : text;

  return (
    <div
      className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm
        ${sender === "user"
          ? "bg-gray-900 text-white rounded-tr-sm"
          : "bg-white border border-gray-100 text-gray-700 rounded-tl-sm"
        }`}
    >
      <span className="whitespace-pre-wrap">{displayText}</span>
      
      {/* Show toggle button if the message is long enough */}
      {needsTruncation && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`block mt-1 text-xs font-semibold opacity-80 hover:opacity-100 transition-opacity
            ${sender === 'user' ? 'text-blue-300' : 'text-blue-600'}`}
        >
          {isExpanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
};

export default function Chatbot(){

 const { openAi,toggleAiState }= useAuth()
 const [input, setInput] = useState("")
  const [conversationId, setConversationId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
   const [historyLoaded, setHistoryLoaded]   = useState(false)

   const [messages, setMessages] = useState([
    { sender: "model", text: "Hi! I'm your Creator-Lift assistant. How can I help you today?" }
  ])

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

 

  useEffect(() => {
    const savedId = localStorage.getItem("chat_id")
    if (savedId) {
        setConversationId(savedId)
        loadHistory(savedId)    // calls GET /api/chat/history/?conversation_id=uuid
    }else{
        setHistoryLoaded(true)
    }
  }, [])

//   focus on input once history is loaded
useEffect(() => {
    if (historyLoaded) inputRef.current?.focus()
  }, [historyLoaded])


const loadHistory = async (id) => {
    try {
      const history = await fetchHistory(id)
      if (history && history.length > 0) {
        setMessages(history) 
      }
    } catch(err){
        console.log(err)
      // failed silently — welcome message stays, user can still chat
      localStorage.removeItem("chat_id")
        setConversationId(null)
    } finally {
      setHistoryLoaded(true)
    }
  }


  const handleReset = () => {
    localStorage.removeItem("chat_id")
    setConversationId(null)
    setMessages([{ sender: "model", text: "Hi! I'm your Creator-Lift assistant. How can I help you today?" }])
    setInput("")
    inputRef.current?.focus()
  }


  const handleSend =async(e, suggestionText)=>{
    e?.preventDefault()

    const textToSend = suggestionText || input
    if(!textToSend.trim() || isLoading) return;
    
    setInput('')
    setMessages((prev) => [...prev, { sender: "user", text: textToSend }])
    setIsLoading(true)

    try{
    
     const data= await AI(textToSend, conversationId)
     
     const { reply, conversation_id}= data.result

    if(conversation_id){
        setConversationId(conversation_id)
        localStorage.setItem("chat_id", conversation_id)
    }


     setMessages((prev) => [...prev, { sender: "model", text: reply }])

    }catch(err){
     setMessages((prev) => [
        ...prev, 
        { sender: "model", text: "Something went wrong, Please try again." }
      ])
    }finally{
        setIsLoading(false)
    }

  }

  const suggestions = [
    "Help me improve my profile",
    "How do I find brands?",
    "How do I get started?"
  ]
 const showSuggestions = historyLoaded && messages.length === 1
    return (
        <>
       <div className="w-[360px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl flex flex-col">

      <div className="flex items-center justify-between bg-gray-900 px-4 py-3.5 text-white shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Creator-Lift AI</h3>
            <p className="text-[11px] text-gray-400">Creator Assistant</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleReset}
            title="Start new conversation"
            className="rounded-lg p-1.5 transition hover:bg-white/10 text-gray-400 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          {/* close */}
          <button
            onClick={toggleAiState}
            className="rounded-lg p-1.5 transition hover:bg-white/10"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 h-[320px] flex-col gap-3 overflow-y-auto bg-gray-50/50 px-4 py-4">

        {/* history loading state */}
        {!historyLoaded && (
          <div className="flex items-center justify-center gap-2 py-6 text-gray-400 text-xs">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading conversation...
          </div>
        )}

        {/* message bubbles */}
        {historyLoaded && messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {/* model avatar dot */}
            {msg.sender === "model" && (
              <div className="mr-2 mt-1 h-5 w-5 shrink-0 rounded-full bg-blue-500 flex items-center justify-center">
                <Sparkles className="h-2.5 w-2.5 text-white" />
              </div>
            )}

            {/* <div
              className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm
                ${msg.sender === "user"
                  ? "bg-gray-900 text-white rounded-tr-sm"
                  : "bg-white border border-gray-100 text-gray-700 rounded-tl-sm"
                }`}
            >
              {msg.text}
            </div> */}
            <MessageBubble text={msg.text} sender={msg.sender} />
          </div>
        ))}

        {/* thinking indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="mr-2 mt-1 h-5 w-5 shrink-0 rounded-full bg-blue-500 flex items-center justify-center">
              <Sparkles className="h-2.5 w-2.5 text-white" />
            </div>
            <div className="rounded-2xl rounded-tl-sm border border-gray-100 bg-white px-3.5 py-3 shadow-sm">
              <div className="flex gap-1 items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
      {showSuggestions && (
        <div className="flex flex-wrap gap-2 border-t border-gray-100 px-4 py-3 shrink-0">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSend(undefined, s)}
              disabled={isLoading}
              className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}

    
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 border-t border-gray-100 px-3 py-3 shrink-0"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading || !historyLoaded}
          placeholder="Ask me anything..."
          className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading || !historyLoaded}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>

    </div>
        </>
    )
}