import { Paperclip, Search, ChevronLeft, Ellipsis, Send } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import { useAuth } from "../../context/context"
import { singletonSockets } from "../../lib/Socket"
import { fetchConversations } from "../../services/Sockets/AcceptMessages"
import { fetchConversationMessages } from "../../services/Sockets/Convmessages"

const AVATARS = [
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-gray-100 text-gray-700",
]

const avatarFor = (id) =>
  AVATARS[[...String(id)].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % AVATARS.length]

const initialsOf = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "?"

const formatTime = (iso) =>
  iso ? new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : ""

const toConversation = (c) => {
  const name = c.other_name || "Conversation"
  return {
    id: String(c.id),
    initials: initialsOf(name),
    company: name,
    time: formatTime(c.last_message_at),
    project: c.project ?? "",
    message: c.last_message ?? "say hello",
    unread: c.unread_count ?? 0,
    avatar: avatarFor(c.id),
  }
}
// Works for both REST messages and websocket messages
const toMessage = (m, myId) => {
  const senderId = typeof m.sender === "object" ? m.sender?.id : m.sender
  return {
    id: String(m.id),
    sender: String(senderId) === String(myId) ? "me" : "other",
    text: m.message ?? m.text ?? "",
    time: formatTime(m.created_at),
  }
}

const MessagesBrand = () => {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [active, setActive] = useState(() => searchParams.get("c"))
  const [showChat, setShowChat] = useState(() => Boolean(searchParams.get("c")))
  const [text, setText] = useState("")
  const [search, setSearch] = useState("")
  const [loadingConvos, setLoadingConvos] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)

  const socketRef = useRef(null)
  const activeRef = useRef(null)
  const convosRef = useRef([])
  const bottomRef = useRef(null)
  activeRef.current = active
  convosRef.current = conversations

  // while the sidebar list is still loading (or doesn't contain this chat),
  // show a placeholder header so the chat opens immediately
  const activeConversation =
    conversations.find((c) => c.id === active) ??
    (active
      ? { id: active, initials: "...", company: "Conversation", project: "", avatar: avatarFor(active) }
      : null)

  const visibleConversations = conversations.filter((c) =>
    `${c.company} ${c.project}`.toLowerCase().includes(search.trim().toLowerCase())
  )

  // Returns true if the frame was sent over websockets uses singleton socket conn
  const sendJson = (payload) => {
    const socket = socketRef.current
    if (!socket || socket.readyState !== WebSocket.OPEN) return false
    socket.send(JSON.stringify(payload))  // send over websocket to backend asgi will take
    return true // tell it was successful
  }

  const markRead = (id) => {
    sendJson({ type: "mark_read", conversation_id: id })  // check backend receive
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)))
  }

 const loadConversations = async () => {
  try {
    const list = await fetchConversations()
    setConversations(list.map(toConversation))
  } catch {
    toast.error("Could not load conversations")
  } finally {
    setLoadingConvos(false)
  }
}

  useEffect(() => {
    const c = searchParams.get("c")
    if (!c) return
    setActive(c)
    setShowChat(true)
    setSearchParams({}, { replace: true })
  }, [searchParams])

  useEffect(() => {
    loadConversations()
  }, [])

  // Load messages when a conversation is selected
useEffect(() => {
  if (!active || !user?.id) return
  let cancelled = false

  const loadMessages = async () => {
    setLoadingMessages(true)
    setMessages([])
    try {
      const list = await fetchConversationMessages(active)
      if (cancelled) return
      setMessages(list.map((m) => toMessage(m, user.id)))
      markRead(active)
    } catch {
      if (!cancelled) toast.error("Could not load messages") //Only show this error if this request is still relevant to the conversation the user is currently viewing
    } finally {
      if (!cancelled) setLoadingMessages(false)
    }
  }

  loadMessages()
  // an effect is the first one to be runs before a component runs a new effect on a re-render
  return () => { cancelled = true } // cleanes up so we dont see  messages of A in messages of B ( imagine when u navigate from convo a to b very fast)
}, [active, user?.id])

  // Listen for live websocket events
  useEffect(() => {
    if (!user?.id) return
    let socket
    try {
      socket = singletonSockets().chatSocket // reuses the socket opened by useAuthSocket
    } catch {
      return
    }
    socketRef.current = socket
 // run everytime you receive anything from django
    const onMessage = (e) => {
      let data
      try { data = JSON.parse(e.data) } catch { return }  // convert incomg data json into js objects as webscokets normally give you data as a string

      if (data.type === "error") {
        toast.error(data.message)
        return
      }

      if (data.type !== "new_message" && data.type !== "message_sent") return

      const convId = String(data.conversation_id)

      // A message for a conversation that isn't in the sidebar yet: reload the list
      if (!convosRef.current.some((c) => c.id === convId)) { // cehck current convo list
        loadConversations()
        return
      }

      const msg = toMessage(data.data, user.id)
      const isActive = convId === activeRef.current

      if (isActive) {
        setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]))
        if (data.type === "new_message") markRead(convId)
      }

      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? {
                ...c,
                message: msg.text,
                time: msg.time,
                unread: data.type === "new_message" && !isActive ? c.unread + 1 : c.unread,
              }
            : c
        )
      )
    }

    socket.addEventListener("message", onMessage) // whenenver this sockte receives a message call onMessage
    return () => socket.removeEventListener("message", onMessage)
  }, [user?.id])

  // Scroll to the newest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    const message = text.trim()
    if (!message || !active) return
    if (sendJson({ type: "message", conversation_id: active, message })) {
      setText("")
    } else {
      toast.error("Not connected. Please try again in a moment.")
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <div className="flex h-[calc(100vh-4rem)]">
        <aside className={`w-full md:w-96 border-r border-gray-200 flex flex-col flex-shrink-0 mt-0 ${showChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold ml-2">Messages</h2>
            </div>

            <div className='relative'>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Conversations..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingConvos && (
              <p className="p-6 text-sm text-gray-500 animate-pulse">Loading conversations...</p>
            )}

            {!loadingConvos && conversations.length === 0 && (
              <p className="p-6 text-sm text-gray-400">No conversations yet.</p>
            )}

            {!loadingConvos && conversations.length > 0 && visibleConversations.length === 0 && (
              <p className="p-6 text-sm text-gray-400">No matches.</p>
            )}

            {visibleConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => {
                  setActive(conversation.id)
                  setShowChat(true)
                }}
                className={`w-full text-left py-4 px-4 transition-colors duration-200 flex gap-3 hover:bg-blue-100/80
                  ${active === conversation.id ? 'bg-blue-100/60' : 'bg-gray-100'}`}>
                <div className={`w-10 h-10 rounded-full items-center justify-center font-bold text-sm shrink-0 flex ${conversation.avatar}`}>
                  {conversation.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-bold text-gray-900 truncate">
                      {conversation.company}
                    </span>

                    <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">
                      {conversation.time}
                    </span>
                  </div>

                  <p className="text-xs text-blue-400 font-medium mb-0.5 truncate">
                    {conversation.project}
                  </p>

                  <p
                    className={`text-xs truncate ${conversation.unread > 0 ? "text-gray-700 font-medium" : "text-gray-400"}`}>
                    {conversation.message}
                  </p>
                </div>

                {conversation.unread > 0 && (
                  <span className="w-5 h-5 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    {conversation.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </aside>

        <section className={`flex-1 min-w-0 md:flex flex-col ${showChat ? 'flex' : 'hidden'}`}>
          {!activeConversation ? (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
              Select a conversation to start chatting
            </div>
          ) : (
            <>
              <div className="px-6 py-4 border-b border-t-2 border-gray-100 flex items-center gap-4 bg-gray-50/80">
                <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg" onClick={() => setShowChat(false)}>
                  <ChevronLeft className="w-5 h-5 text-gray-500" />
                </button>

                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${activeConversation.avatar}`}>
                  {activeConversation.initials}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm">
                    {activeConversation.company}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {activeConversation.project}
                  </p>
                </div>

                <button className="p-2 hover:bg-gray-50 rounded-lg">
                  <Ellipsis className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-gray-100/30">
                {loadingMessages && (
                  <p className="text-center text-sm text-gray-500 animate-pulse">Loading messages...</p>
                )}

                {!loadingMessages && messages.length === 0 && (
                  <p className="text-center text-sm text-gray-400">No messages yet. Say hello!</p>
                )}

                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-3 ${message.sender === "me" ? "flex-row-reverse" : "flex-row"} `}>

                    {message.sender === "other" && (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1 ${activeConversation.avatar}`}>
                        {activeConversation.initials}
                      </div>
                    )}

                    <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                      ${message.sender === "me" ? "bg-gray-900 text-white rounded-tr-sm" : "bg-white text-gray-700 rounded-tl-sm border border-gray-100 shadow-sm"}`}>
                      <p>{message.text}</p>

                      <p className={`text-[10px] mt-1.5
                        ${message.sender === "me" ? "text-gray-400" : "text-gray-300"}`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/80">
                <div className="flex gap-3 items-center">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <div className="flex-1">
                    <textarea
                      rows={1}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Write a message..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                    />
                  </div>

                  <button
                    onClick={handleSend}
                    disabled={!text.trim()}
                    className="p-3 rounded-xl bg-gray-900 text-gray-300 hover:bg-gray-800 transition-colors disabled:opacity-50">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </>
  )
}

export default MessagesBrand