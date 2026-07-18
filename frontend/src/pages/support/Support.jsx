import { useState, useEffect } from "react";
import { useAuth } from "../../context/context";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import { LifeBuoy, Zap, BookOpen, DollarSign, Shield, MessageCircle, ChevronDown,Send,} from "lucide-react";
import { useLocation } from "react-router-dom";


const FAQ_SECTIONS = [
  {
    title: "Getting Started",
    icon: Zap,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    items: [
      { question: "How do I create a micro-offer?" },
      { question: "How does the matching system work?" },
      {
        question: "Can I edit my portfolio after publishing?",
        answer:
          'Yes. Navigate to Your Work on the dashboard, click any portfolio piece, and select "Edit." Changes are reflected immediately on your public profile.',
      },
    ],
  },
  {
    title: "Deals & Proposals",
    icon: BookOpen,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    items: [
      { question: "How do I send a proposal to a brand?" },
      { question: "Can I counter-offer a brand's budget?" },
      { question: "What happens after a proposal is accepted?" },
    ],
  },
  {
    title: "Payments",
    icon: DollarSign,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    items: [
      { question: "When do I receive payment for a completed deal?" },
      {
        question: "What payout methods are supported?",
        answer:
          "Currently we support ACH bank transfers (US), PayPal, and Wise for international creators. You can add or update your payout method in Settings → Payments.",
      },
    ],
  },
  {
    title: "Privacy & Safety",
    icon: Shield,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
    items: [
      { question: "Is my contact information shared with brands?" },
      { question: "How do I report a brand for suspicious behavior?" },
    ],
  },
];

const TOPICS = [
  "Getting Started",
  "Deals & Proposals",
  "Payments",
  "Privacy & Safety",
  "Bug Report",
  "Other",
];

function FaqRow({ item }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-50">
      <button onClick={() => setOpen((prev) => !prev)} className="w-full text-left py-4 flex items-center justify-between gap-4 group">
        <span className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
          {item.question}
        </span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform ${open ? "rotate-180 text-blue-400" : "text-gray-400"}`}
        />
      </button>
      {open && (
        <div className="pb-4 text-sm text-gray-500 leading-relaxed pr-8">
          {item.answer}
        </div>
      )}
    </div>
  );
}

const Support = () => {
  const { isOpen } = useAuth();

  const { hash }= useLocation()

   useEffect(()=>{
     if(hash === '#contact'){
      const el = document.getElementById('contact')
      if ( el) el.scrollIntoView({ behavior: "smooth"})
    }
   }, [hash])



  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Sidebar />

        <main
          className={`pt-16 transition-all duration-300 ${isOpen ? "ml-64" : "ml-20"} max-sm:ml-0`}>
          <div className="min-h-screen bg-gray-100/50">
            {/* Header */}
            <div className="bg-white border-b border-t-2 border-gray-100 px-6 py-8">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                  Help &amp; Support
                </h1>
                <p className="text-gray-500 mt-2 max-w-md mx-auto">
                  Everything you need to know about Creator-Lift. Can't find an answer? Reach out directly.
                </p>
              </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
              {/* FAQ sections */}
              {FAQ_SECTIONS.map((section) => (
                <div key={section.title}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${section.iconBg} ${section.iconColor}`}>
                      <section.icon className="w-4 h-4" />
                    </div>
                    <h2 className="font-bold text-gray-900">
                      {section.title}
                    </h2>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 divide-y divide-gray-50">
                    {section.items.map((item) => (
                      <FaqRow key={item.question} item={item} />
                    ))}
                  </div>
                </div>
              ))}

              {/* Contact form */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">
                      Still need help?
                    </h2>
                    <p className="text-xs text-gray-400">
                      We usually respond within a few hours.
                    </p>
                  </div>
                </div>
                <section id="contact">
                <form
                  className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                        Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Alex Riviera"
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue="alex@riviera.creates"
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                      Topic
                    </label>
                    <select className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-all appearance-none text-gray-700">
                      {TOPICS.map((topic) => (
                        <option key={topic}>{topic}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Describe your issue or question in detail..."
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-all resize-none"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all bg-gray-900 text-white hover:bg-gray-800"
                    >
                      <Send className="w-4 h-4" />
                      Send Message
                    </button>
                  </div>
                </form>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Support;