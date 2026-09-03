import { ShieldCheck, KeyRound, Lock, Save } from "lucide-react";
import { useState } from "react";
import {useForm} from 'react-hook-form'
import { PasswordSchema } from "../../utilities/PassSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { ProfileUpdatePaasword } from "../../services/CreatorDashboard";



const passwordFields = [
 { name: 'currentPassword', label: "Current Password", placeholder: "Enter current password" },
 { name: 'newPassword', label: "New Password", placeholder: "Enter new password" },
 { name: 'confirmNewPassword', label: "Confirm New Password", placeholder: "Re-enter new password" },
];

export default function Security (){

    const { register, handleSubmit,reset, formState:{errors, touchedFields , isSubmitting} }=useForm({
        resolver: zodResolver(PasswordSchema),
        mode: 'onTouched'
    })


    const onSubmit = async(data)=>{
       console.log(data)
        try{
            const msg = await ProfileUpdatePaasword(data)
            toast.success(msg)
            reset()
        }catch(error){
            console.log(error.message)
            const message =error.response?.data?.error || error.response?.data?.detail || error.message ||"Something went wrong. Please try again"

            toast.error(message)
        }
    }

    return(
        <>
         <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <form onSubmit={handleSubmit(onSubmit, (errors)=> console.log(errors))} className="space-y-8 p-8">
                {/* Header */}
                <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                    <ShieldCheck className="h-6 w-6 text-gray-700" />
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                    Security
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                    Keep your account secure by updating your password and enabling
                    two-factor authentication.
                    </p>
                </div>
                </div>

                {/* Password Fields */}
                <div className="space-y-5">
                {passwordFields.map((field) => (
                    <div key={field.label}>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {field.label}
                    </label>

                    <div className="relative">
                        <Lock
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                        type="password"
                        required
                        placeholder={field.placeholder}
                        {...register(field.name)}
                         className={`w-full rounded-xl border bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:ring-2 ${
                            errors[field.name]
                            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                            : "border-gray-200 focus:border-black focus:ring-black/10"
                        }`}
                        />
                    </div>
                    {errors[field.name] && touchedFields[field.name] && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors[field.name].message}
                        </p>
                        )}
                    </div>
                ))}
                </div>
                {/* Save Button */}
                <div className="flex justify-end border-t border-gray-100 pt-6">
                <button 
                disabled={isSubmitting}
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800">
                    <Save size={18} />
                    {isSubmitting? "saving...":"Save Changes"}
                </button>
                </div>
            </form>
            </div>
        </>
    )

}