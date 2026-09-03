import React, { useEffect, useState } from 'react'
import { CheckCircle2, Filter, Instagram, MessageSquare, Play, Plus, Sparkles, TrendingUp, Users, X } from 'lucide-react'
import { useAuth } from '../../context/context'
import { ShoppingBag, Clock, Briefcase, DollarSign, ChevronRight, LoaderCircle} from 'lucide-react'
import { Link } from 'react-router-dom'

const colorStyles = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-100 text-green-600",
};

const stats = [
  { id: 1, label: "Active Requests", value: "4", icon: Briefcase, color: "blue" },
  { id: 2, label: "Proposals Received", value: "18", icon: Users, color: "blue"  },
  { id: 3, label: "Deals In Progress", value: "3", icon: TrendingUp, color: "blue"  },
  { id: 4, label: "Total Spent", value: "KES 420K", icon: DollarSign, color: "green" },
];
const categoryStyles = {
  blue: "bg-blue-50 text-blue-600 border-blue-100",
  purple: "bg-purple-50 text-purple-600 border-purple-100",
  amber: "bg-amber-50 text-amber-600 border-amber-100",
};

const proposals = [
  {
    id: 1,
    name: "Wanjiku Kamau",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200&h=200",
    niche: "Lifestyle Photography",
    forRequest: "M-PESA Everyday Heroes Campaign (3 Videos)",
    rate: "KES 85,000",
    delivery: "7d",
    status: "pending",
  },
  {
    id: 2,
    name: "Brian Otieno",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200&h=200",
    niche: "Tech & UGC",
    forRequest: "Youth Data Bundle UGC Shorts",
    rate: "KES 32,000",
    delivery: "5d",
    status: "pending",
  },
  {
    id: 3,
    name: "Njeri Gitau",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
    niche: "Lifestyle & Editorial",
    forRequest: "Fiber Internet Lifestyle Photos (10 Stills)",
    rate: "KES 42,000",
    delivery: "6d",
    status: "pending",
  },
  {
    id: 4,
    name: "David Ochieng",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
    niche: "Comedy & Entertainment",
    forRequest: "Zuri Festival Brand Activation Reels",
    rate: "KES 58,000",
    delivery: "8d",
    status: "pending",
  },
];


const DashboardBrand = () => {
  const {user , loading}= useAuth()
  const [filter, SetFilter] = useState('all')

  
  const visibleProposals = filter === 'all' ? proposals: proposals.filter((proposal)=> proposal.status === filter)

  const pendingCount = proposals.filter((p) => p.status === "pending").length;

  const requests = [
  {
    id: 1,
    category: "Video",
    categoryColor: "blue",
    status: "Open",
    title: "M-PESA Everyday Heroes Campaign (3 Videos)",
    amount: "KES 90,000",
    dueDate: "Jul 10",
    proposals: 8,
  },
  {
    id: 2,
    category: "Photography",
    categoryColor: "purple",
    status: "Open",
    title: "Fiber Internet Lifestyle Photos (10 Stills)",
    amount: "KES 45,000",
    dueDate: "Jul 20",
    proposals: 5,
  },
  {
    id: 3,
    category: "UGC",
    categoryColor: "amber",
    status: "Open",
    title: "Youth Data Bundle UGC Shorts",
    amount: "KES 35,000",
    dueDate: "Jul 25",
    proposals: 5,
  },
  {
    id: 4,
    category: "Video",
    categoryColor: "blue",
    status: "Open",
    title: "Zuri Festival Brand Activation Reels",
    amount: "KES 65,000",
    dueDate: "Jul 15",
    proposals: 4,
  },
];
const matches = [
  {
    id: 1,
    name: "Wanjiku Kamau",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200&h=200",
    niche: "Lifestyle Photography",
    matchPercent: 96,
    tags: ["Lifestyle", "Video", "Nairobi"],
  },
  {
    id: 2,
    name: "Njeri Gitau",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
    niche: "Fashion & Lifestyle",
    matchPercent: 93,
    tags: ["Fashion", "Editorial", "Lifestyle"],
  },
  {
    id: 3,
    name: "Brian Otieno",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200&h=200",
    niche: "Tech & UGC",
    matchPercent: 88,
    tags: ["Tech", "UGC", "Youth"],
  },
  {
    id: 4,
    name: "David Ochieng",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
    niche: "Comedy & Entertainment",
    matchPercent: 82,
    tags: ["Comedy", "UGC", "Events"],
  },
];
  

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  if (loading) return (
      <div className="flex items-center justify-center min-h-screen">
          <LoaderCircle className="animate-spin w-6 h-6 text-sky-500" />
      </div>
  )

//   const { works, offers, requests } = dashData ?? []

  return (
      <>
        {/* Welcome header */}
        <section className='py-12 px-6'>
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 ">
            <div className='flex items-center gap-3'>
              <div className=' w-14 h-14 rounded-2xl bg-green-200 text-green-600 flex items-center justify-center text-lg font-extrabold border border-green-200 shadow-sm'>SF</div>
                <div>
                     <p className='text-sm tracking-[0.2em] uppercase text-sky-500 mb-3'>
                        {days[new Date().getDay()]}, {months[new Date().getMonth()]} <span className='text-sm'>{new Date().getDate()}</span>
                    </p>
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                        Welcome back, {user.username || user.data.username}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Three new matches and one proposal awaiting your reply.
                    </p>
                </div>
            </div>
                <div className='flex gap-4 ml-auto'>
                    <Link
                        to='/messages'
                        className='flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 border border-gray-200 text-sm rounded-xl hover:bg-gray-100 transition-all'
                        >
                        <MessageSquare size={12}/>
                        Messages
                    </Link>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition">
                        <Plus className="w-4 h-4" />
                        New Offer
                    </button>
                </div>
          </div>
            <div className=' max-w-[1200px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 mt-20'>
            {stats.map(({ id, label, value, icon: Icon, color }) => (
                <div
                key={id}
                className='bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4'
                >
                <div className={`p-2.5 rounded-xl flex-shrink-0 ${colorStyles[color]}`}>
                    <Icon size={14} />
                </div>
                <div className='min-w-0'>
                    <p className='text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-tight'>
                    {label}
                    </p>
                    <p className='text-2xl font-extrabold text-gray-900 mt-1'>
                    {value}
                    </p>
                </div>
                </div>
            ))}
            </div>

            <section className='max-w-[1200px] mx-auto '>
                <div className='flex items-center justify-between mb-4 mt-12'>
                    <h2 className='text-[16px] font-extrabold text-gray-900'>
                        Your Active requests
                    </h2>
                    <button className='text-[14px] font-bold text-blue-500 flex items-center gap-1 transition-colors hover:text-blue-600'>
                      <Plus size={14}/>
                      Post request
                    </button>

                </div>

                <div className='space-y-3'>
                      {requests.map(({ id, category, categoryColor, status, title, amount, dueDate, proposals }) => (
                        <div
                        key={id}
                        className="group bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md hover:border-blue-100 transition-all"
                        >
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                            <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${categoryStyles[categoryColor]}`}>
                                {category}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] text-gray-400">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                                {status}
                            </span>
                            </div>

                            <p className="font-bold text-gray-900">{title}</p>

                            <div className="flex flex-wrap gap-4 mt-1.5">
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                                <DollarSign className="w-3 h-3" />
                                <span className="font-bold text-gray-700">{amount}</span>
                            </span>

                            <span className="flex items-center gap-1 text-xs text-gray-400">
                                <Clock className="w-3 h-3" />
                                Due {dueDate}
                            </span>

                            <span className="flex items-center gap-1 text-xs text-gray-400">
                                <Users className="w-3 h-3" />
                                <span className="font-bold text-purple-600">{proposals} proposals</span>
                            </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="text-center px-4 py-2 bg-purple-50 border border-purple-100 rounded-lg">
                            <p className="text-xl font-extrabold text-purple-600">{proposals}</p>
                            <p className="text-[9px] font-bold text-purple-400 uppercase tracking-wider">Proposals</p>
                            </div>

                            <button className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-all">
                            Review <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className='max-w-[1200px] mx-auto '>
                 <div className="flex items-center justify-between mb-4 flex-wrap gap-3 mt-12">
                    <div>
                        <h2 className="text-lg font-extrabold text-gray-900">Incoming Proposals</h2>
                        <p className="text-sm text-gray-400 mt-0.5">{pendingCount} pending review</p>
                    </div>

                    <div className="flex items-center gap-1">
                    <div className="flex bg-gray-100 rounded-lg p-1 gap-2">
                        {["all", "pending"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => SetFilter(tab)}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold capitalize transition-all ${
                            filter === tab
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-400 hover:text-gray-600 border border-gray-200"
                            }`}
                        >
                            {tab}
                        </button>
                        ))}
                    </div>

                    <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 bg-white rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 transition-all">
                        <Filter className="w-3.5 h-3.5" /> Filter
                    </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {visibleProposals.map(({ id, name, avatar,  niche, forRequest, rate, delivery }) => (
                    <div
                        key={id}
                        className="bg-white rounded-xl border shadow-sm p-5 transition-all duration-300 border-gray-100 hover:shadow-md hover:border-blue-100"
                    >
                        <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                            <img
                            src={avatar}
                            alt={name}
                            className="w-12 h-12 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                            />
                            <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-extrabold text-gray-900">{name}</p>
                            </div>
                            <p className="text-xs text-gray-400 font-medium">{niche}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                                For: <span className="text-gray-600 font-medium">{forRequest}</span>
                            </p>
                            </div>
                        </div>

                        <div className="flex gap-4 flex-shrink-0 items-center">
                            <div className="text-center">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Rate</p>
                            <p className="text-lg font-extrabold text-gray-900">{rate}</p>
                            </div>
                            <div className="text-center">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Delivery</p>
                            <p className="text-lg font-extrabold text-gray-900">{delivery}</p>
                            </div>
                        </div>
                        </div>


                        <div className="mt-4 flex items-center gap-2 flex-wrap">
                        <button className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white font-bold text-xs rounded-xl hover:bg-gray-800 transition-all">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Accept & Start Deal
                        </button>
                        <Link
                            to="/messages"
                            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-50 transition-all"
                        >
                            <MessageSquare className="w-3.5 h-3.5" /> Message
                        </Link>
                        <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-400 font-bold text-xs rounded-xl hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all">
                            <X className="w-3.5 h-3.5" /> Decline
                        </button>
                        </div>
                    </div>
                    ))}
                </div>
            </section>

            <section className='max-w-[1200px] mx-auto '>
                <div className='flex items-center justify-between mb-5 mt-12'>
                    <div>
                        <h2 className='text-lg font-extrabold text-gray-900'>Creators Matched to ypur brand</h2>
                        <p className='text-sm text-gray-400  mt-1'>Based on your content brief and past deals</p>

                    </div>
                    <Link
                    to="#"
                    className='group text-sm font-bold text-blue-500 hover:text-blue-600 flex items-baseline gap-1 transition-colors'
                    >
                        Browse All
                         <ChevronRight size={14} className="self-center transition-transform group-hover:translate-x-1" /> 
                    </Link>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                    {matches.map(({id, name, avatar, niche, matchPercent,tags})=>(
                        <div
                        key={id}
                        className='group bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-blue-200 flex flex-col transition-all duration-200 p-6'
                        >
                            <div className='flex items-center gap-3'>
                                <img
                                src={avatar}
                                alt={name}
                                className="w-12 h-12 rounded-xl object-cover border border-gray-100 group-hover:scale-105 transition-transform"
                                />
                                <div>
                                <p className="font-extrabold text-gray-900 text-sm">{name}</p>
                                <p className="text-[11px] text-gray-400 font-medium">{niche}</p>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between my-4">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                    Match
                                </span>
                                <span className="text-xs font-extrabold text-blue-600 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    {matchPercent}%
                                </span>
                                </div>
                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all"
                                    style={{ width: `${matchPercent}%` }}
                                />
                                </div>
                            </div>
                    
                            <div className="flex flex-wrap gap-1 my-4">
                                {tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2 py-0.5 bg-gray-50 border border-gray-100 text-gray-400 text-[9px] font-bold uppercase tracking-wider rounded-md"
                                >
                                    {tag}
                                </span>
                                ))}
                            </div>
                    
                            <button className="mt-auto w-full py-2 bg-white border border-gray-200 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all">
                                Invite to Apply
                            </button>
                        </div>
                    ))}

                </div>
            </section>
        </section>
        
      </>
  )
}

export default DashboardBrand