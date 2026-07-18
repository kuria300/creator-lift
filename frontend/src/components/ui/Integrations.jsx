import { useState } from "react"
import { Instagram, InstagramIcon, Music2, Youtube } from "lucide-react";


export default function Integrations (){
    const [socials, setSocials]= useState([
        {
            id:1,
            Icon: Instagram,
            platform: 'Instagram',
            account: '@eugenekuria456',
            connected: true

        },
        {
            id:2,
            Icon: Music2,
            platform: 'Tiktok',
            account: '@kingsLanding',
            connected: true

        },
        {
            id:3,
            Icon: Youtube,
            platform: 'Youtube',
            account: 'Mr.Beast',
            connected: false

        },
    ])

    const toggleFunc =(id)=>{
        setSocials((prev)=>(
            prev.map((social)=>(
                social.id === id ? {...social, connected:!social.connected} : social
            ))
        ))
    }

    return(
        <>
          <section className="flex-1 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="space-y-10 p-8">

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                     Integrations
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                      Connect your social platforms to enrich your creator profile.
                    </p>
                 </div>

                 <div className="space-y-3">
                  {socials.map(({id, Icon:Icon, platform, account, connected})=> (
                     <div key={id} className="flex items-center justify-between border border-gray-100 rounded-xl hover:bg-gray-50 transition-all p-2.5">
                    <div className="flex items-center gap-3">
                     <div className="w-10 h-10 flex items-center justify-center bg-blue-50 rounded-lg"><Icon size={20} className="text-gray-700" /></div>
                     <div>
                      <p className="text-sm font-bold text-gray-800">
                        {platform}
                      </p>
                       <p className="text-xs text-gray-400">
                        {connected ? account : "Not connected"}
                       </p>
                     </div>
                    </div>
                     <button 
                     onClick={()=>toggleFunc(id)}
                     className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all bg-blue-50 text-blue-600
                               ${connected ? 'hover:text-red-500 bg-gray-100 text-gray-500':'hover:bg-blue-100 '}`}>
                        {connected ? 'Disconnect':'connect'}
                      </button>
                   </div>
                  ))}
                 </div>

                
                </div>
          </section>
        </>
    )
}