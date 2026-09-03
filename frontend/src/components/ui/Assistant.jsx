import { Sparkles, X } from "lucide-react";
import { useAuth } from "../../context/context";
import Chatbot from "./Chatbot";


export default function Assistant(){

    const { openAi, toggleAiState }= useAuth()

    return(
        <>
         <div className="fixed z-50 bottom-6 right-6 flex items-end gap-3 flex-row">
            {!openAi && ( <p className='bg-gray-400/30 p-2 px-4 text-black/60 rounded-xl rounded-br-none transition'>Chat with your AI assistant!</p>)}
          <button 
            onClick={toggleAiState}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gray-900 text-sm shadow-lg transition-all duration-200 text-white hover:translate-y-1 hover:bg-gray-800">
            {openAi ? (
                <div className="flex flex-row gap-2 items-center">
                  <X size={24} />
                  <p>Close</p>
                </div>
            ) : (
            <div className="flex flex-row gap-2 items-center">
                <Sparkles className="w-4 h-4 text-sky-500" />
                <p>AI assistant</p>
            </div>
            )}
                
          </button>
         </div>

           {openAi && (
            <div className="fixed bottom-24 right-6 z-50 animate-slide-up">
             <Chatbot />
            </div>
      )}
        </>
    )
}