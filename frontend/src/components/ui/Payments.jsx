import { Briefcase, ChevronRight } from "lucide-react";
import { getDate } from "../../utilities/getDate";


export default function Payments (){
    const date = getDate()

    const CO_PAYMENTS =[
        {
            id: 1,
            company: 'KFC Kenya co.',
            date: date,
            amount:'+4,000 ksh',
            status: 'paid'
        },
        { 
            id: 2,
            company: 'KRA public limited.',
            date: date,
            amount:'+9,000 ksh',
            status: 'Pending'   
        }
    ]
 
    return(
        <>
          <section className="flex-1 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="space-y-10 p-8">

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                    Payments & Payouts
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                      Manage how you receive earnings from completed deals.
                    </p>
                 </div>

                 <div className="bg-green-50 border border-green-100 w-full rounded-lg flex items-center justify-between p-4">
                  <div>
                    <p className="text-xs font-bold text-green-600 tracking-wide uppercase">
                    Available balance
                   </p>
                   <p className="text-gray-900 text-3xl font-bold max-sm:text-2xl">
                    KSH.120,000
                   </p>
                  </div>
                   <button className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800">
                      withdraw
                    </button>
                 </div>

                <div>
                    <h3 className="text-sm font-bold text-gray-700 mb-3">
                        Payment Method
                    </h3>
                    <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-blue-50 rounded-lg">
                            <Briefcase className="text-blue-400" />
                        </div>
                        <div>
                        <p className="text-sm font-bold text-gray-800">
                          Stripe payment
                         </p>
                         <p className="text-xs text-gray-400">
                          Equity... 8971
                         </p>
                      </div>
                      </div>
                         <ChevronRight className="text-gray-500"/>
                     </div>
                     <button className="mt-3 border-2 border-gray-200 border-dashed rounded-xl text-gray-400 py-2.5 w-full text-sm font-bold hover:border-blue-200 hover:text-blue-400 transition-all">
                        + Add Payment Method
                     </button>
                   </div>

                   <div>
                     <h3 className="text-sm font-bold text-gray-700 mb-3">
                        Recent Transactions
                     </h3>
                     {CO_PAYMENTS.map(({id , company, date, amount, status})=>(
                        <div key={id} className=" px-6 py-3 flex items-center justify-between border-b border-gray-100">
                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            {company}
                          </p>
                         <p className="text-xs text-gray-400">
                            {date}
                         </p>
                         
                        </div>
                         <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">
                              {amount}
                            </p>
                           {status === 'paid' ? (
                             <p className="text-[12px] font-bold text-green-600 bg-gray-50 rounded-xl text-center px-2 py-0.5">
                               {status}
                            </p>
                           ): (
                              <p className="text-[12px] font-bold text-orange-400 bg-gray-50 rounded-xl text-center px-2 py-0.5">
                                {status}
                            </p>
                           )}
                          </div>
                     </div>
                     ))}

                     
                   </div>
                  <div className="flex justify-end">
                    <button className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800">
                        Save Changes
                    </button>
                    </div>
                </div>
          </section>
        </>
    )
}