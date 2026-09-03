import { Shield, TrendingUp, Wallet, Clock, Lock, ChevronRight, ArrowDownLeft, CheckCircle2, ArrowUpRight, FileText, CircleAlert} from "lucide-react";
import { Fragment, useState } from "react";

const paymentStats = [
  {
    id: 1,
    label: "Available Balance",
    value: "KES 72,500",
    icon: Wallet,
    color: "neutral",
  },
  {
    id: 2,
    label: "Held in Escrow",
    value: "KES 90,000",
    icon: Lock,
    color: "blue",
  },
  {
    id: 3,
    label: "Total Earned",
    value: "KES 385,000",
    icon: TrendingUp,
    color: "emerald",
  },
  {
    id: 4,
    label: "Pending Payout",
    value: "KES 0",
    icon: Clock,
    color: "gray",
  },
];


const deals = [
  {
    id: 1,
    brand: "Safaricom",
    title: "M-PESA Everyday Heroes Campaign",
    fundedDate: "Jul 2, 2026",
    dueDate: "Jul 10, 2026",
    amount: 90000,
    feePct: 8,
    status: { label: "Funds Held in Escrow", icon: Lock, color: "blue" },
  },
  {
    id: 2,
    brand: "KFC Kenya",
    title: "Nairobi Foodie Review Series",
    fundedDate: "Jun 28, 2026",
    dueDate: "Jul 5, 2026",
    amount: 75000,
    feePct: 8,
    status: { label: "Awaiting Your Approval", icon: CircleAlert, color: "amber" },
  },
  {
    id: 3,
    brand: "Airtel Kenya",
    title: "Data Pack Awareness Reels",
    fundedDate: null,
    dueDate: "Jul 9, 2026",
    amount: 60000,
    feePct: 8,
    status: { label: "Awaiting Brand Payment", icon: Clock, color: "gray" },
  },
];

const transactions = [
  {
    id: 1,
    type: "funded",
    label: "Safaricom funded deal",
    date: "Jul 2, 2026",
    ref: "PPS-2026-00341",
    amount: 90000,
    status: "Completed",
  },
  {
    id: 2,
    type: "withdrawal",
    label: "M-PESA withdrawal — 0712 345 678",
    date: "Jun 30, 2026",
    ref: "B2C-2026-00289",
    amount: 45000,
    status: "Completed",
  },
  {
    id: 3,
    type: "released",
    label: "Coca-Cola Kenya deal released",
    date: "Jun 28, 2026",
    ref: "ESC-2026-00210",
    amount: 142500,
    status: "Completed",
  },
  {
    id: 4,
    type: "fee",
    label: "Platform fee (8%) — Coca-Cola deal",
    date: "Jun 28, 2026",
    ref: "FEE-2026-00210",
    amount: 12000,
    status: "Completed",
  },
  {
    id: 5,
    type: "funded",
    label: "KFC Kenya funded deal",
    date: "Jun 28, 2026",
    ref: "PPS-2026-00301",
    amount: 75000,
    status: "Completed",
  },
  {
    id: 6,
    type: "withdrawal",
    label: "M-PESA withdrawal — 0712 345 678",
    date: "Jun 25, 2026",
    ref: "B2C-2026-00255",
    amount: 80000,
    status: "Completed",
  },
];

const escrowSteps = [
  { id: 1, text: "Brand funds deal via M-PESA STK Push" },
  { id: 2, text: "Funds held in escrow by Pesapal" },
  { id: 3, text: "Creator delivers · Brand approves" },
  { id: 4, text: "Creator withdraws via M-PESA B2C" },
];

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

const statusStyles = {
  blue: "bg-blue-50 text-blue-600 border-blue-100",
  amber: "bg-amber-50 text-amber-600 border-amber-100",
  gray: "bg-gray-50 text-gray-500 border-gray-200",
};


const colorStylez = {
  neutral: { bg: "bg-white border-gray-200", icon: "text-gray-900", value: "text-gray-900" },
  blue: { bg: "bg-blue-50 border-blue-100", icon: "text-blue-600", value: "text-blue-600" },
  emerald: { bg: "bg-emerald-50 border-emerald-100", icon: "text-emerald-600", value: "text-emerald-600" },
  gray: { bg: "bg-gray-50 border-gray-100", icon: "text-gray-400", value: "text-gray-400" },
};
export default function PaymentsCreators() {
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
                    <div className='flex gap-4 ml-auto'>
                        <button className="flex items-center gap-2 px-6 py-4 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition">
                            <Wallet className="w-6 h-6" />
                            Withdraw to M-PESA
                        </button>
                    </div>
            </div>

            <div className=" max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {paymentStats.map(({ id, label, value, icon: Icon, color }) => {
                const styles = colorStylez[color];
                return (
                <div key={id} className={`rounded-xl p-4 border ${styles.bg}`}>
                    <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 ${styles.icon}`} />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        {label}
                    </p>
                    </div>
                    <p className={`text-xl font-extrabold ${styles.value}`}>{value}</p>
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
                    {currentOffers.map(({ id, brand, title, fundedDate, dueDate, amount, feePct, status }) => {
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
                                {brand}
                                </span>
                                <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 ${statusStyles[statusColor]}`}
                                >
                                <StatusIcon
                                    className={`w-4 h-4 ${
                                    statusColor === "blue"
                                        ? "text-blue-500"
                                        : statusColor === "amber"
                                        ? "text-amber-500"
                                        : "text-gray-500"
                                    }`}
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
                <div className="divide-y divide-gray-50">
                    {allTransactions.map(({ id, type, label, date, ref, amount, status }) => {
                    const { icon: Icon, iconColor, inflow } = typeConfig[type];

                    return (
                        <div
                        key={id}
                        className="px-6 py-4 flex items-center gap-4 hover:bg-gray-200/50 transition-colors"
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
                )}

        </section>
    )

}