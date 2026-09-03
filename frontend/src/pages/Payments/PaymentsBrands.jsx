import { CheckCircle, ChevronRight, CircleAlert, Clock, Lock, Shield, Wallet, ArrowDownLeft, ArrowUpRight, CheckCircle2, FileText, Smartphone } from "lucide-react";
import { Fragment, useState } from "react";


const paymentStats = [
  {
    id: 1,
    label: "Total Funded",
    value: "KES 440,000",
    icon: Wallet,
    color: "neutral",
  },
  {
    id: 2,
    label: "Held in Escrow",
    value: "KES 385,000",
    icon: Lock,
    color: "blue",
  },
  {
    id: 3,
    label: "Released to Creators",
    value: "KES 255,000",
    icon: CheckCircle,
    color: "green",
  },
];

const deals = [
  {
    id: 1,
    creator: "Wanjiku Kamau",
    title: "M-PESA Everyday Heroes Campaign - 3 Videos",
    fundedDate: "Jul 2, 2026",
    dueDate: "Jul 10, 2026",
    amount: 90000,
    feePct: 8,
    status: { label: "Funds Held in Escrow", icon: Lock, color: "blue" },
    action: { label: "Funds Secured", icon: Lock, color: "blue" },
  },
  {
    id: 2,
    creator: "Brian Otieno",
    title: "Nairobi Foodie Review Series - 5 Reels",
    fundedDate: "Jun 28, 2026",
    dueDate: "Jul 5, 2026",
    amount: 75000,
    feePct: 8,
    status: { label: "Awaiting Your Approval", icon: CheckCircle2, color: "amber" },
    action: null,
  },
  {
    id: 3,
    creator: "David Ochieng",
    title: "Data Pack Awareness Reels",
    fundedDate: null,
    dueDate: "Jul 9, 2026",
    amount: 60000,
    feePct: 8,
    status: { label: "Awaiting Brand Payment", icon: Clock, color: "gray" },
    action: null, // shows the "Fund via M-PESA" button instead of a status label
  },
];

const transactions = [
  {
    id: 1,
    label: "Funded: Safaricom - Wanjiku Kamau deal",
    date: "Jul 2, 2026",
    ref: "PPS-2026-00341",
    amount: 90000,
    inflow: false,
    status: "Completed",
  },
  {
    id: 2,
    label: "Funded: KFC Kenya - Brian Otieno deal",
    date: "Jun 28, 2026",
    ref: "PPS-2026-00301",
    amount: 75000,
    inflow: false,
    status: "Completed",
  },
  {
    id: 3,
    label: "Released: Coca-Cola deal - Wanjiku approved",
    date: "Jun 20, 2026",
    ref: "ESC-2026-00180",
    amount: 150000,
    inflow: true,
    status: "Completed",
  },
  {
    id: 4,
    label: "Partial refund - cancelled micro-offer",
    date: "Jun 15, 2026",
    ref: "REF-2026-00155",
    amount: 5000,
    inflow: true,
    status: "Completed",
  },
];

const escrowSteps = [
  { id: 1, text: "Brand funds deal via M-PESA STK Push" },
  { id: 2, text: "Funds held in escrow by Pesapal" },
  { id: 3, text: "Creator delivers · Brand approves" },
  { id: 4, text: "Creator withdraws via M-PESA B2C" },
];

const badgeStyles = {
  blue: "bg-blue-50 text-blue-600 border-blue-100",
  green: "bg-green-50 text-green-600 border-green-100",
  gray: "bg-gray-50 text-gray-500 border-gray-200",
  amber: "bg-amber-50 text-amber-600 border-amber-100",
};

const actionStyles = {
  blue: "bg-blue-50 border-blue-100 text-blue-600",
  green: "bg-green-600 border-green-100 text-white hover:bg-green-700",
}
function formatKES(amount) {
  return `KES ${amount.toLocaleString()}`;
}

const typeConfig = {
  funded: { icon: ArrowDownLeft, iconColor: "text-blue-500", inflow: true },
  released: { icon: CheckCircle2, iconColor: "text-green-500", inflow: true },
  withdrawal: { icon: ArrowUpRight, iconColor: "text-red-400", inflow: false },
  fee: { icon: FileText, iconColor: "text-gray-400", inflow: false },
};
const colorStyles ={
     neutral: { bg: "bg-white border-gray-200", icon: "text-gray-900", value: "text-gray-900" },
    blue: {bg: "bg-blue-50 border-blue-100", icon: "text-blue-600", value: "text-blue-600"},
    green: { bg: "bg-emerald-50 border-emerald-100", icon: "text-emerald-600", value: "text-emerald-600" },
}
export default function PaymentsBrands() {
      const tabs = ["Active Escrow", "Transaction History"];
    const [activeTab, setActiveTab] = useState('Active Escrow');
    const [allEscrow, setAllEscrow] = useState(deals);
    const [allTransactions, setAllTransactions] = useState(transactions);

    const currentOffers = activeTab === 'Active Escrow' ? allEscrow : allTransactions
    return (
        <section className='py-12 px-6'>
            <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 ">
                <div className='flex items-center gap-4'>
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                            Payments
                        </h1>
                        <p className="text-gray-500 mt-2 flex items-center gap-2">
                            <Shield size={14} className="text-blue-400"/> Escrow-protected · Powered by Pesapal & M-PESA
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto grid md:grid-cols-3 gap-4 mt-12">
            {paymentStats.map(({ id, label, value, icon: Icon, color }) => {
                const styles = colorStyles[color]
                return (
                <div key={id} className={`rounded-xl p-4 border ${styles.bg} shadow-sm transition-colors duration-300 gap-4`}>
                    <div className="flex items-center gap-2 mb-4">
                    <Icon className={`w-6 h-6 ${styles.icon}`} />
                    <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">
                        {label}
                    </p>
                    </div>
                    <p className={`text-[20px] font-extrabold ${styles.value}`}>{value}</p>
                </div>
                );
            })}
            </div>

            <div className="bg-blue-50 border-b border-blue-100 py-3 mt-10 -mx-6 mb-8">
             <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-6 text-xs text-blue-700 font-medium">
                {escrowSteps.map(({ id, text }, index) => (
                <Fragment key={id}>
                    <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-200 text-blue-700 font-extrabold flex items-center justify-center text-[10px]">
                        {id}
                    </span>
                    {text}
                    </div>
    
                    {index < escrowSteps.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-blue-300 hidden sm:block" />
                    )}
                </Fragment>
                ))}
            </div>
            </div>
        <div className='flex gap-1 rounded-xl p-1 w-fit bg-gray-200 my-6'>
            {tabs.map((tab, i)=>{
                const isActive = activeTab === tab;

                return(
                <button 
                 key={i}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-6 w-48 rounded-lg text-sm font-bold transition-all ${
                 isActive ? "bg-gray-900 text-white" : "bg-transparent text-gray-900 border border-gray-200 hover:bg-gray-100"
                }`}
                >
                 {tab}
                </button>
             )})}
            </div>

            

           {currentOffers.length === 0 ? (
                <div className="text-center py-16">
                    {activeTab === 'Active Escrow' ? (
                    <div className="flex flex-col items-center gap-3">
                        <p className="text-gray-400 text-sm">You have no active escrow deals.</p>
                    </div>
                    ) : (
                    <p className="text-gray-400 text-sm">No transactions found.</p>
                    )}
                </div>
                ) : activeTab === 'Active Escrow' ? (
                <div className="space-y-4">
                    {currentOffers.map(({ id, creator, title, fundedDate, dueDate, amount, feePct, status, action }) => {
                    const StatusIcon = status.icon;
                    const statusColor = status.color;
                    const fee = (amount * feePct) / 100;
                    const totalAmountPayable = amount - fee;

                    return (
                        <div
                        key={id}
                        className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all"
                        >
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">
                                {creator}
                                </span>
                                <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 ${badgeStyles[statusColor]}`}
                                >
                                <StatusIcon
                                    className={`w-4 h-4 ${
                                    statusColor === "blue" ? "text-blue-500": statusColor === "amber"  ? "text-amber-500" : "text-gray-500" }`}
                                />
                                {status.label}
                                </span>
                            </div>
                            <h3 className="font-bold text-gray-900">{title}</h3>
                            <p className="text-xs text-gray-400 mt-1">
                                {fundedDate ? `Funded ${fundedDate} · Due ${dueDate}` : `Due ${dueDate}`}
                            </p>
                            </div>

                             <div className="flex items-center gap-6 flex-shrink-0">
                                <div className="text-right">
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                                    Deal Amount
                                </p>
                                <p className="text-lg font-extrabold text-gray-900">{formatKES(amount)}</p>
                                <p className="text-xs text-emerald-600 font-bold">
                                    Creator gets {formatKES(totalAmountPayable)}
                                </p>
                                </div>

                                {action ? (
                                <div
                                    className={`px-4 py-2.5 border font-bold text-xs rounded-xl flex items-center gap-2 ${actionStyles[action.color]}`}
                                >
                                    <action.icon className="w-3.5 h-3.5" />
                                    {action.label}
                                </div>
                                ) : status.color === 'amber' ? (
                                <button className="flex items-center gap-2 px-3 py-3 bg-green-600 border-gray-100 text-white font-bold text-[12px] rounded-xl hover:bg-green-700 transition-all">
                                    <CheckCircle2 className="w-6 h-6" />
                                    Approve & Release
                                </button>
                                ):(
                                <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white font-bold text-sm rounded-xl hover:bg-gray-800 transition-all">
                                    <Smartphone className="w-4 h-4" />
                                    Fund via M-PESA
                                </button>
                                )}
                            </div>

                         
                        </div>

                        <div className="mt-4 flex gap-4 pt-4 border-t border-gray-50 flex-wrap">
                            <span className="text-xs text-gray-400">
                            Deal: <strong className="text-gray-600">{formatKES(amount)}</strong>
                            </span>
                            <span className="text-xs text-gray-400">
                            Platform fee ({feePct}%): <strong className="text-gray-600">{formatKES(fee)}</strong>
                            </span>
                            <span className="text-xs text-gray-400">
                            Creator payout: <strong className="text-green-600">{formatKES(totalAmountPayable)}</strong>
                            </span>
                        </div>
                        </div>
                    );
                    })}
                </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="font-extrabold text-gray-900">Transaction History</h3>
                    <span className="text-xs text-gray-400">{transactions.length} transactions</span>
                </div>

                <div className="divide-y divide-gray-50">
                    {transactions.map(({ id, label, date, ref, amount, inflow, status }) => {
                    const Icon = inflow ? ArrowDownLeft : ArrowUpRight;
                    const iconColor = inflow ? "text-green-500" : inflow === false ? "text-blue-500" : "text-red-400";

                    return (
                        <div
                        key={id}
                        className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors"
                        >
                        <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                            <Icon className={`w-4 h-4 ${iconColor}`} />
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900">{label}</p>
                            <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-xs text-gray-400">{date}</span>
                            <span className="text-[10px] font-bold text-gray-300 font-mono">{ref}</span>
                            </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                            <p
                            className={`font-extrabold text-sm ${
                                inflow ? "text-emerald-600" : "text-gray-900"
                            }`}
                            >
                            {inflow ? "+" : ""}
                            {formatKES(amount)}
                            </p>
                            <span className="text-[10px] font-bold text-green-500 uppercase">{status}</span>
                        </div>
                        </div>
                    );
                    })}
                </div>
                </div>
                )}

        </section>
    )

}