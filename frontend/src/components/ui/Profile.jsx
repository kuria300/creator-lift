import { User, Camera } from "lucide-react";
import { fetchCreatorProfile, fetchSP, handleSaveProfile } from "../../services/CreatorDashboard";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/context";
import { toast } from "react-toastify";
import axios from "axios";
import { AvaterUpload } from "../../services/AvataerUser";

export default function Profile() {
  const {updateAvatar, avatarUrl, setAvater} = useAuth()
  const [data, setData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState({}); 

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [specialties, setSpecialties] = useState([]);
  const [allSpecialties, setAllSpecialties] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [socials, setSocials] = useState({ Instagram: "", TikTok: "", YouTube: "" });
  const [saving, setSaving] = useState(false);
  const { loading } = useAuth();

//   const [avatarUrl, setAvatarUrl] = useState("");
  const fileInputRef = useRef(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleAvatarClick = () => {
    fileInputRef.current.click(); // opens the OS file picker
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // basic frontend checks (backend should also validate)
    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPG or PNG allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB");
      return;
    }

    setUploadingAvatar(true);
    try {
      const fileExt = file.name.split(".").pop();

      // ask Django for a presigned URL
      const { presigned_url, public_url } = await AvaterUpload(fileExt);

      // upload the file DIRECTLY to MinIO (not through Django!)
      await axios.put(presigned_url, file, {
        headers: { "Content-Type": file.type },
      });

      const updated = await handleSaveProfile({ avatar_url: public_url });

      updateAvatar(updated.avatar_url ?? public_url);
      toast.success("Photo updated!");
    } catch (err) {
      toast.error(err.message || "Failed to upload photo");
    } finally {
      setUploadingAvatar(false);
    }
  };

  useEffect(() => {
    const getProfileInfo = async () => {
      try {
        const [res, options] = await Promise.all([fetchCreatorProfile(), fetchSP()]);
        setData(res);
        setAllSpecialties(options);

        setUsername(res.username_profile ?? "");
        setEmail(res.email_profile ?? "");
        setBio(res.bio ?? "");
        setSpecialties(res.speciality_data ?? []);
        setAvater(res.avatar_url ?? "");
        setSocials({
          Instagram: res.instagram_url ?? "",
          TikTok: res.tiktok_url ?? "",
          YouTube: res.youtube_url ?? "",
        });
      } catch (err) {
        // fixed: was setError(string) — errors is an object now, use a toast for load failures instead
        toast.error(err?.message || "Fetch profile failed!");
      } finally {
        setLoadingData(false);
      }
    };

    getProfileInfo();
  }, []);

  const toggleSpecialty = (item) => {
    setSpecialties((prev) => {
      if (prev.includes(item)) {
        return prev.filter((s) => s !== item);
      }
      if (prev.length >= 5) {
        // fixed: was setError("string") now sets the correct object shape
        setErrors((prevErrors) => ({
          ...prevErrors,
          specialties: "You can only select up to 5 specialities.",
        }));
        return prev;
      }
      // fixed: was setError('') now clears just the specialties key
      setErrors((prevErrors) => {
        const { specialties: _removed, ...rest } = prevErrors;
        return rest;
      });
      return [...prev, item];
    });
  };

  const handleSave = async () => {
    setSaving(true);
    const newErrors = {};

    const usernameRegEx = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;
    const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const urlRegEx = /^https?:\/\/.+\..+/;

    if (!username.trim() || !email.trim()) {
      newErrors.username = "Username and email are required";
    } else if (username.trim().length < 3) {
      newErrors.username = "Username must be more than 3 characters";
    } else if (!usernameRegEx.test(username)) {
      newErrors.username =
        "Username can only contain letters, numbers, and underscores, and must start with a letter";
    }

    if (!emailRegEx.test(email)) {
      newErrors.email = "Invalid Email";
    }

    if (bio.trim().length > 500) {
      newErrors.bio = "Bio must be under 500 characters";
    }

    if (specialties.length === 0) {
      newErrors.specialties = "Pick at least one speciality";
    } else if (specialties.length > 5) {
      newErrors.specialties = "You can only select up to 5 specialties";
    }

    for (const [platform, url] of Object.entries(socials)) {
      if (url.trim().length > 0 && !urlRegEx.test(url)) {
        newErrors[platform] = `Invalid ${platform} URL; must start with http:// or https://`;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSaving(false);
      return;
    }

    setErrors({});

    try {
      const updated = await handleSaveProfile({
        username,
        email,
        bio,
        speciality_data: specialties,
        tiktok_url: socials.TikTok,
        instagram_url: socials.Instagram,
        youtube_url: socials.YouTube,
      });

      setUsername(updated.username_profile ?? "");
      setEmail(updated.email_profile ?? "");
      setBio(updated.bio ?? "");
      setSpecialties(updated.speciality_data ?? []);
      setAvater(updated.avatar_url ?? "");
      setSocials({
        Instagram: updated.instagram_url ?? "",
        TikTok: updated.tiktok_url ?? "",
        YouTube: updated.youtube_url ?? "",
      });

      toast.success("Profile Saved Successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading || loadingData)
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-sm text-gray-400">Loading profile...</div>
      </div>
    );

  return (
    <section className="flex-1 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="space-y-10 p-8">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Public Profile</h2>
          <p className="mt-2 text-sm text-gray-500">
            Complete your profile to appear in search results and receive campaign invitations.
          </p>
        </div>

        {/* Avatar */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-gray-200 bg-gray-100 overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <User className="h-10 w-10 text-gray-500" />
              )}
            </div>
            {/* <p className="text-xs text-red-500 break-all">DEBUG: {avatarUrl}</p> */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png"
              onChange={handleAvatarChange}
              className="hidden"
            />

            <button
              onClick={handleAvatarClick}
              disabled={uploadingAvatar}
              className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition hover:bg-gray-800 disabled:opacity-50"
            >
              <Camera size={15} />
            </button>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{username || "Creator"}</h3>
            <p className="text-sm text-gray-500">JPG or PNG • Maximum 5MB</p>
            <button
              onClick={handleAvatarClick}
              disabled={uploadingAvatar}
              className="mt-3 text-sm font-medium hover:underline text-blue-500 hover:text-blue-600 disabled:opacity-50"
            >
              {uploadingAvatar ? "Uploading..." : "Upload Photo"}
            </button>
          </div>
        </div>

        {/* Basic Information */}
        <div>
          <h3 className="mb-5 text-lg font-semibold text-gray-900">Basic Information</h3>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                Username
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 ${
                  errors.username
                    ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-200 bg-gray-50 focus:border-black focus:ring-black/10"
                }`}
              />
              {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username}</p>}
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 ${
                  errors.email
                    ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-200 bg-gray-50 focus:border-black focus:ring-black/10"
                }`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">Bio</label>
          <textarea
            rows={5}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className={`w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 ${
              errors.bio
                ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100"
                : "border-gray-200 bg-gray-50 focus:border-black focus:ring-black/10"
            }`}
          />
          {errors.bio && <p className="mt-1 text-xs text-red-500">{errors.bio}</p>}
        </div>

        {/* Specialties */}
        <div>
          <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-gray-500">
            Specialties <span className="text-gray-400 normal-case">({specialties.length}/5 selected)</span>
          </label>
          {errors.specialties && <p className="mb-2 text-xs text-red-500">{errors.specialties}</p>}

          <div className="flex flex-wrap gap-3 items-center">
            {specialties.map((item) => (
              <span
                key={item}
                className="rounded-full border border-blue-200 bg-blue-100 px-4 py-2 text-xs font-medium text-blue-700"
              >
                {item}
              </span>
            ))}

            {!showPicker && (
              <button
                onClick={() => setShowPicker(true)}
                className="rounded-full border border-dashed border-gray-300 px-4 py-2 text-xs font-medium text-gray-500 transition hover:border-black hover:text-black"
              >
                + Add
              </button>
            )}
          </div>

          {showPicker && (
            <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex flex-wrap gap-3">
                {allSpecialties.map((item) => {
                  const selected = specialties.includes(item);
                  const disabled = !selected && specialties.length >= 5;
                  return (
                    <button
                      key={item}
                      onClick={() => toggleSpecialty(item)}
                      disabled={disabled}
                      className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                        selected
                          ? "border-blue-200 bg-blue-100 text-blue-700"
                          : disabled
                          ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                          : "border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setShowPicker(false)}
                  className="rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-800"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Social Accounts */}
        <div>
          <h3 className="mb-5 text-lg font-semibold text-gray-900">Social Accounts</h3>

          <div className="grid gap-5 sm:grid-cols-2">
            {["Instagram", "TikTok", "YouTube"].map((platform) => (
              <div key={platform}>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {platform}
                </label>
                <input
                  placeholder={`Enter ${platform} URL`}
                  value={socials[platform]}
                  onChange={(e) => setSocials((prev) => ({ ...prev, [platform]: e.target.value }))}
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 ${
                    errors[platform]
                      ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-200 bg-gray-50 focus:border-black focus:ring-black/10"
                  }`}
                />
                {errors[platform] && <p className="mt-1 text-xs text-red-500">{errors[platform]}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-gray-100 pt-8">
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}