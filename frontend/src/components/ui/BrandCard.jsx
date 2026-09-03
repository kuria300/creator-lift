import { ChevronRight, MapPin, Sparkles } from "lucide-react";
import { useState } from "react";

export default function BrandCard({ username, brand_avatarUrl, bio, speciality_tags, active_deals }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = bio.length > 100;

  return (
    <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-emerald-100 transition-all duration-300 flex flex-col">
      <div className="relative h-40 overflow-hidden bg-gray-100">
        <img
          src={brand_avatarUrl}
          alt={username}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-lg text-[10px] font-bold text-emerald-700 shadow-sm flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-emerald-500" />
          {active_deals} open
        </div>

        <div className="absolute bottom-3 left-4">
          <p className="text-white font-extrabold text-sm drop-shadow">{username}</p>
          <p className="text-white/80 text-[11px]">{speciality_tags.join(", ")}</p>
        </div>
      </div>

      <div className="px-5 py-4 flex-1 flex flex-col gap-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <MapPin className="w-3 h-3" /> Nairobi, Kenya
        </div>

        <div>
          <p className={`text-sm text-gray-500 leading-relaxed ${expanded ? "" : "line-clamp-2"}`}>
            {bio}
          </p>
          {isLong && (
            <button
              onClick={() => setExpanded((prev) => !prev)}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-1"
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 mt-auto">
          {speciality_tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-wide rounded-md border border-gray-100"
            >
              {tag}
            </span>
          ))}
          {speciality_tags.length > 3 && (
            <span className="px-2 py-0.5 bg-gray-50 text-gray-400 text-[10px] font-bold rounded-md border border-gray-100">
              +{speciality_tags.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          

          <button className="flex items-center gap-1 text-xs font-bold text-emerald-600 group-hover:gap-2 transition-all">
            View Profile <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}