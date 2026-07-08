import { User, Bell, CreditCard, Shield, Link2, Camera} from "lucide-react";

export default function Profile (){

    const specialties = [
    "Video",
    "Photography",
    "UGC",
    "Travel",
    "Lifestyle",
    "Food",
    ];
    return(
        <>
            <section className="flex-1 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="space-y-10 p-8">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                    Public Profile
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                    Complete your profile to appear in search results and receive
                    campaign invitations.
                    </p>
                </div>

                {/* Avatar */}
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="relative">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border border-gray-200 bg-gray-100">
                        <User className="h-10 w-10 text-gray-500" />
                    </div>

                    <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition hover:bg-gray-800">
                        <Camera size={15} />
                    </button>
                    </div>

                    <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Alex Riviera
                    </h3>

                    <p className="text-sm text-gray-500">
                        JPG or PNG • Maximum 5MB
                    </p>

                    <button className="mt-3 text-sm font-medium text-black hover:underline">
                        Upload Photo
                    </button>
                    </div>
                </div>

                {/* Basic Information */}
                <div>
                    <h3 className="mb-5 text-lg font-semibold text-gray-900">
                    Basic Information
                    </h3>

                    <div className="grid gap-5 sm:grid-cols-2">
                    {[
                        {
                        label: "Username",
                        value: "alexriviera.creates",
                        },
                        {
                        label: "Email",
                        value: "alex@example.com",
                        },
                    ].map((field) => (
                        <div key={field.label}>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                            {field.label}
                        </label>

                        <input
                            defaultValue={field.value}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                        />
                        </div>
                    ))}
                    </div>
                </div>

                {/* Bio */}
                <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Bio
                    </label>

                    <textarea
                    rows={5}
                    defaultValue="Content creator specializing in cinematic travel, lifestyle photography and UGC video production. Based in LA and available worldwide."
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                    />
                </div>

                {/* Specialties */}
                <div>
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Specialties
                    </label>

                    <div className="flex flex-wrap gap-3">
                    {specialties.map((item) => (
                        <button
                        key={item}
                        className="rounded-full border border-gray-200 bg-gray-100 px-4 py-2 text-xs font-medium transition hover:bg-black hover:text-white"
                        >
                        {item}
                        </button>
                    ))}

                    <button className="rounded-full border border-dashed border-gray-300 px-4 py-2 text-xs font-medium text-gray-500 transition hover:border-black hover:text-black">
                        + Add
                    </button>
                    </div>
                </div>

                {/* Social Accounts */}
                <div>
                    <h3 className="mb-5 text-lg font-semibold text-gray-900">
                    Social Accounts
                    </h3>

                    <div className="grid gap-5 sm:grid-cols-2">
                    {[
                        "Instagram",
                        "TikTok",
                        "YouTube",
                        "Website",
                    ].map((platform) => (
                        <div key={platform}>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                            {platform}
                        </label>

                        <input
                            placeholder={`Enter ${platform} URL`}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                        />
                        </div>
                    ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t-2 border-gray-100 pt-8">
                    <div className="flex justify-end">
                    <button className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800">
                        Save Profile
                    </button>
                    </div>
                </div>
                </div>
            </section>
        </>
    )
}