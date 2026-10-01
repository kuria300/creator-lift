import { ChevronRight, MapPin, MessageSquare, Sparkles } from "lucide-react"
import { useState } from "react"


export default function CreatorCard({ username, bio, speciality_tags, creator_avatar_url, num_deals_done, match_percent }) {

    const [expanded , setExpanded] = useState(false)
  
    return(
        <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-emerald-100 transition-all duration-300 flex flex-col">
            <div className="relative h-40 overflow-hidden bg-gray-100">
            <img
                src={creator_avatar_url}
                alt={username}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-lg text-[10px] font-bold text-emerald-700 shadow-sm flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                {match_percent}% match
            </div>

            <div className="absolute bottom-3 left-4">
                <p className="text-white font-extrabold text-sm drop-shadow">{username}</p>
                <p className="text-white/80 text-[11px]">{speciality_tags.slice(0,2).join(' & ')}</p>
            </div>
            </div>

            <div className="px-5 py-4 flex-1 flex flex-col gap-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <MapPin className="w-3 h-3" /> Nairobi, Kenya
            </div>

            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                {bio.length > 100 && (
                    <button
                    onClick={() => setExpanded((prev) => !prev)}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-1"
                    >
                    {expanded ? "Show less" : "Read more"}
                    </button>
                )}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-auto">
                {speciality_tags.map((tag) => (
                <span
                    key={tag}
                    className="px-2 py-0.5 bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-wide rounded-md border border-gray-100"
                >
                    {tag}
                </span>
                ))}
            </div>

            <button
                    onClick={() => {}}
                    className="w-full py-2.5 bg-gray-800 text-white font-bold text-xs rounded-xl hover:bg-gray-900 transition-all flex items-center justify-center gap-2">
                    <MessageSquare size={14} />
                    <span>Start Conversation</span>
                </button>

            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <div className="flex gap-4">
                {/* <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Avg Rate</p>
                    <p className="text-sm font-extrabold text-gray-800">{avgRate}</p>
                </div> */}
                <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Deals Done</p>
                    <p className="text-sm font-extrabold text-gray-800">{num_deals_done}</p>
                </div>
                </div>

                <button className="flex items-center gap-1 text-xs font-bold text-emerald-600 transition-all">
                Invite <ChevronRight className="group-hover:translate-x-1 transition-all w-3.5 h-3.5" />
                </button>
            </div>
            </div>
        </div>
    )
}

