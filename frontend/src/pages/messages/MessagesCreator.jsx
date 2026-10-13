import { Paperclip, Search, ChevronLeft, Ellipsis, Send, MessageCircle, X, LoaderCircle, FileText, Download } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import { useAuth } from "../../context/context"
import { singletonSockets } from "../../lib/Socket"
import { fetchConversations } from "../../services/Sockets/AcceptMessages"
import { fetchConversationMessages } from "../../services/Sockets/Convmessages"
import { attchmentUpload, saveAttchment } from "../../services/AvataerUser"
import axios from "axios"

const AVATARS = [
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-gray-100 text-gray-700",
]
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10mb
const ALLOWED_EXTS = ["jpg", "jpeg", "png", "webp", "pdf", "doc", "docx"]

const avatarFor = (id) =>
  AVATARS[[...String(id)].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % AVATARS.length]

const initialsOf = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "?"

const formatTime = (iso) =>
  iso ? new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : ""

const formatSize = (bytes) => {
  if (!bytes) return ""
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// Files are stored under random names, so we show a friendly label instead
const fileLabel = (type = "") => {
  if (type === "application/pdf") return "PDF document"
  if (type.includes("word")) return "Word document"
  return "File"
}

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
    attachmentUrl: m.attachment_url ?? null,
    attachmentType: m.attachment_type ?? null,
    attachmentSize: m.attachment_size ?? null,
  }
}

const MessagesCreator = () => {
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isUploadingAttachment, setIsUploadingAttachment]=useState(false)
    const [selectedImage, setSelectedImage] = useState(null);


  const socketRef = useRef(null)
  const activeRef = useRef(null)
  const convosRef = useRef([])
  const bottomRef = useRef(null)
  const fileInputRef= useRef(null)
  activeRef.current = active
  convosRef.current = conversations

  // while the sidebar list is still loading (or doesn't contain this chat),
  // show a placeholder header so the chat opens immediately
  const activeConversation =
    conversations.find((c) => c.id === active) ??
    (active
      ? { id: active, initials: "...", company: "Conversation", project: "", avatar: avatarFor(active) }
      : null)

  const visibleConversations = conversations.filter((c) =>`${c.company} ${c.project}`.toLowerCase().includes(search.trim().toLowerCase()))

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
                message: msg.text || (msg.attachmentUrl ? "Attachment" : ""),
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

    useEffect(() => {
    if (!selectedFile || !selectedFile.type.startsWith("image/")) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(selectedFile)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [selectedFile])

  const handleFileSelected = async (e) => {
  const file = e.target.files?.[0]
  e.target.value = ""
  if (!file) return

  const ext = file.name.split(".").pop().toLowerCase()

  if (!ALLOWED_EXTS.includes(ext)) {
    toast.error("Only JPG, PNG, WEBP, PDF, DOC and DOCX files are allowed")
    return
  }
  if (file.size > MAX_FILE_SIZE) {
    toast.error("File is too large (max 10 MB)")
    return
  }
  setSelectedFile(file)
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const attachUpload = async(file)=>{
    const fileExt = file.name.split(".").pop().toLowerCase()
    try{
      const { presigned_url, public_url, content_type, key } = await attchmentUpload(fileExt);

      await axios.put(presigned_url, file, {
          headers: { "Content-Type": content_type },
      });

      // if(!res.ok) throw new Error("Upload to storage failed")
      
      const { attachment_url, attachment_type, attachment_size }= await saveAttchment(key)
     
      return { attachment_url, attachment_type, attachment_size }

    }catch(err){
      toast.error(err.message || "Failed to upload photo");
    } 
    }

  // Scroll to the newest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    const message = text.trim()
    if ((!message && !selectedFile) || !active || isUploadingAttachment) return
    // avoid uploading a file we cant send since websocket is closed
    const socket = socketRef.current
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        toast.error("Not connected. Please try again in a moment.")
        return
      }
    
      const payload = { type: "message", conversation_id: active, message }

    if(selectedFile){
      try {
      setIsUploadingAttachment(true)
      const attachment = await attachUpload(selectedFile)
      Object.assign(payload, attachment) // add extra data to send
    } catch (err) {
      toast.error(err.message || "Could not upload the file")
      return 
    } finally {
      setIsUploadingAttachment(false)
    }
    }

    if (sendJson(payload)) {
      setText("")
      setSelectedFile(null)
    } else {
      toast.error("could not send. Please try again in a moment.")
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
        <aside className={`w-full md:w-96 border-r border-gray-300 flex flex-col flex-shrink-0 mt-0 ${showChat ? 'hidden md:flex' : 'flex'}`}>
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
            <div className="flex-1 flex items-center justify-center flex-col text-[12px] text-gray-600">
              Select a conversation to start chatting
              <MessageCircle size={24} className="animate-pulse text-gray-800 mt-4"/>
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
                      
                    
                      {message.attachmentUrl && (
                        message.attachmentType?.startsWith("image/") ? (
                          <a
                            href={message.attachmentUrl}
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedImage(message.attachmentUrl);
                            }}
                            className="block cursor-zoom-in"
                          >
                            <img
                              src={message.attachmentUrl}
                              alt="Attachment"
                              loading="lazy"
                              className="rounded-lg mb-2 max-h-96 w-auto max-w-full object-contain"
                            />
                          </a>
                        ) : (
                          <a
                            href={message.attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 mb-2 transition-colors
                              ${
                                message.sender === "me"
                                  ? "bg-gray-800 hover:bg-gray-700"
                                  : "bg-gray-50 hover:bg-gray-100"
                              }`}
                          >
                            <FileText className="w-6 h-6 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold truncate">
                                {fileLabel(message.attachmentType)}
                              </p>
                              <p className="text-[10px] opacity-70">
                                {formatSize(message.attachmentSize)}
                              </p>
                            </div>
                            <Download className="w-4 h-4 shrink-0 opacity-70" />
                          </a>
                        )
                      )}
                      
                      {selectedImage && (
                        <div
                          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/10 p-4"
                          onClick={() => setSelectedImage(null)}
                        >
                          {/* Close button */}
                          <button
                            type="button"
                            onClick={() => setSelectedImage(null)}
                            className="absolute right-5 top-5 rounded-full bg-black/50 p-2 text-white hover:bg-black/80"
                            aria-label="Close image"
                          >
                            <X className="h-6 w-6" />
                          </button>
                      
                          {/* Full-size image */}
                          <img
                            src={selectedImage}
                            alt="Full-size attachment"
                            onClick={(e) => e.stopPropagation()}
                            className="max-h-[80vh] max-w-[85vw] rounded-lg object-contain"
                          />
                        </div>
                      )}
                      {message.text && <p>{message.text}</p>}

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
                {selectedFile && (
                  <div className="flex w-fit items-center gap-2 rounded-md bg-gray-100 px-2.5 py-1.5 mb-1.5 text-xs text-gray-700">
                    {previewUrl ? (
                      <img src={previewUrl} alt="" className="w-8 h-8 rounded object-cover" />
                    ) : (
                      <Paperclip size={12} />
                    )}
                    <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                    <button
                      onClick={() => setSelectedFile(null)}
                      disabled={isUploadingAttachment}
                      aria-label="remove file"
                      className="ml-1 text-gray-400 hover:text-gray-600">
                      <X size={12} />
                    </button>
                  </div>
                )}

                <div className="flex gap-3 items-center">
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,application/pdf,.doc,.docx" className="hidden" onChange={handleFileSelected} />

                  <button 
                  onClick={()=>fileInputRef.current?.click()}
                  aria-label="attach file"
                  disabled={isUploadingAttachment}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
                    {isUploadingAttachment ? <LoaderCircle size={20} className="animate-spin" />: <Paperclip className="w-5 h-5" />}
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
                    disabled={(!text.trim() && !selectedFile) || isUploadingAttachment}
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

export default MessagesCreator