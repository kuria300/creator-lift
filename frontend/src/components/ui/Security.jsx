import { ShieldCheck, KeyRound, Lock, Save } from "lucide-react";

export default function Security (){
    const passwordFields = [
    { label: "Current Password", placeholder: "Enter current password" },
    { label: "New Password", placeholder: "Enter new password" },
    { label: "Confirm New Password", placeholder: "Re-enter new password" },
    ];

    return(
        <>
         <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="space-y-8 p-8">
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
                        placeholder={field.placeholder}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                        />
                    </div>
                    </div>
                ))}
                </div>

                {/* 2FA Card */}
                <div className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-gray-200">
                    <KeyRound size={18} />
                    </div>

                    <div>
                    <h3 className="font-semibold text-gray-900">
                        Two-Factor Authentication
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                        Add an extra layer of security to your account using an
                        authentication app.
                    </p>
                    </div>
                </div>

                <button className="rounded-xl border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800">
                    Enable 2FA
                </button>
                </div>

                {/* Save Button */}
                <div className="flex justify-end border-t border-gray-100 pt-6">
                <button className="flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800">
                    <Save size={18} />
                    Save Changes
                </button>
                </div>
            </div>
            </div>
        </>
    )

}