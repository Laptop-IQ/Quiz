import { memo, useCallback, useState, useEffect } from "react";
import Modal from "react-modal";
import {
  Eye, EyeOff, User, X, Lock, Camera, Trash2, Sparkles, LogOut, Mail,
  ShieldCheck, AlertTriangle, CalendarDays, KeyRound, Pencil,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cropper from "react-easy-crop";
import DeleteAccount from "../components/DeleteAccount";
import imageCompression from "browser-image-compression";
import { useNotifications } from "../Context/NotificationProvider";

const API_BASE = import.meta.env.VITE_API_BASE;

Modal.setAppElement("#root");

// ---- Theme: matches /dashboard/attempted-tests (light canvas, dark hero, white cards) ----
const ui = {
  card: "rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_40px_rgba(15,23,42,0.05)] sm:p-6",
  cardTitle: "text-base font-extrabold text-slate-950 sm:text-lg",
  cardSub: "mt-0.5 text-xs text-slate-500",
  label: "mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400",
  input:
    "h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60",
  primary:
    "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60",
  secondary:
    "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60",
  ghost:
    "inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-60",
  errorText: "mt-1.5 text-xs font-semibold text-rose-600",
};

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";

const IconChip = ({ icon: Icon, className }) => (
  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${className}`}>
    <Icon size={18} />
  </div>
);

// Password Input (memoized)
const PasswordInput = memo(
  ({ name, label, value, error, showField, onToggle, onChange, disabled }) => (
    <div>
      <label className={ui.label}>{label}</label>
      <div className="relative">
        <input
          type={showField ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          className={`${ui.input} pr-11 ${error ? "!border-rose-300 !bg-rose-50/40 focus:!ring-rose-100" : ""}`}
          placeholder={`Enter ${label.toLowerCase()}`}
          disabled={disabled}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 transition hover:text-slate-700"
          disabled={disabled}
          aria-label={showField ? "Hide password" : "Show password"}
        >
          {showField ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
        </button>
      </div>
      {error && <p className={ui.errorText}>{error}</p>}
    </div>
  ),
);

PasswordInput.displayName = "PasswordInput";

const Profile = ({ onUpdateProfile, onLogout }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", joinDate: "" });
  const [tempUser, setTempUser] = useState({ ...user });
  const [editMode, setEditMode] = useState(false);
  const token = localStorage.getItem("token");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const getAuthToken = useCallback(() => localStorage.getItem("token"), []);

  // Generic API request
  const handleApiRequest = useCallback(
    async (method, endpoint, data = null) => {
      const token = getAuthToken();
      if (!token) {
        navigate("/login");
        return null;
      }
      try {
        setLoading(true);
        const config = {
          method,
          url: `${API_BASE}${endpoint}`,
          headers: { Authorization: `Bearer ${token}` },
        };
        if (data) config.data = data;
        const response = await axios(config);
        return response.data;
      } catch (error) {
        console.error(`${method} request error:`, error);
        if (error.response?.status === 401) navigate("/login");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [getAuthToken, navigate],
  );

  const { addNotification, removeNotification } = useNotifications();

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await handleApiRequest("get", "/user/me");
        if (data) {
          const userData = data.user || data;
          setUser(userData);
          setTempUser(userData);
        }
      } catch {
        addNotification("Failed to load user data");
      }
    };
    fetchUserData();
  }, [handleApiRequest]);

  // Input handlers
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setTempUser((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handlePasswordChange = useCallback((e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const togglePasswordVisibility = useCallback((field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  }, []);

  const handleProfileUpdate = async () => {
    try {
      const data = await handleApiRequest("put", "/user/profile", {
        name: tempUser.name,
        email: tempUser.email,
      });
      if (data) {
        const updatedUser = data.user || data;
        setUser(updatedUser);
        setTempUser(updatedUser);
        setEditMode(false);
        addNotification("Profile updated successfully");
      }
    } catch (err) {
      addNotification("Failed to update profile");
    }
  };

  const compressImage = async (file) => {
    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };
      return await imageCompression(file, options);
    } catch {
      return file;
    }
  };

  const handleImageChange = async (eOrFile) => {
    const file = eOrFile?.target?.files ? eOrFile.target.files[0] : eOrFile;

    if (!file) return;

    const compressed = await compressImage(file);

    setProfileImage(compressed);
    setPreviewImage(URL.createObjectURL(compressed));
    setEditMode(true);
  };

  // Cropper
  const onCropComplete = (croppedArea, croppedAreaPixels) =>
    setCroppedAreaPixels(croppedAreaPixels);

  const getCroppedImg = async (imageSrc, crop) => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = crop.width;
    canvas.height = crop.height;
    ctx.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height,
    );
    return new Promise((resolve) =>
      canvas.toBlob((blob) => resolve(blob), "image/jpeg"),
    );
  };

  useEffect(
    () => () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    },
    [previewImage],
  );

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!profileImage || !croppedAreaPixels) {
      addNotification("Please select and crop an image first");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Crop the image
      const croppedBlob = await getCroppedImg(previewImage, croppedAreaPixels);
      if (!croppedBlob) throw new Error("Failed to crop image");

      // 2️⃣ Prepare Cloudinary FormData
      const formData = new FormData();
      formData.append("file", croppedBlob, "profile.jpg");

      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      if (!uploadPreset || !cloudName)
        throw new Error("Cloudinary config missing");

      formData.append("upload_preset", uploadPreset);

      // 3️⃣ Upload to Cloudinary
      const cloudRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        formData,
      );

      const imageUrl = cloudRes.data.secure_url;
      if (!imageUrl) throw new Error("Cloudinary did not return image URL");

      // 4️⃣ Send URL + name + email to backend
      const token = localStorage.getItem("token");
      const backendRes = await axios.put(
        `${API_BASE}/user/profile`,
        {
          profilePic: imageUrl,
          name: tempUser.name || user.name,
          email: tempUser.email || user.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      // 5️⃣ Update UI immediately
      setUser((prev) => ({ ...prev, profilePic: imageUrl }));
      setTempUser((prev) => ({ ...prev, profilePic: imageUrl }));
      setProfileImage(null);
      setPreviewImage("");
      setEditMode(false);
      addNotification("Profile image updated successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      addNotification("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleImageChange(file);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleCancelImageEdit = () => {
    setPreviewImage("");
    setProfileImage(null);
  };

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) setUser(savedUser);
  }, []);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
      if (profileImage) URL.revokeObjectURL(profileImage);
    };
  }, [previewImage, profileImage]);

  const handleCancelEdit = useCallback(() => {
    setTempUser(user);
    setEditMode(false);
  }, [user]);

  // Password validation
  const validatePassword = useCallback(() => {
    const errors = {};
    if (!passwordData.current) errors.current = "Current password is required";
    if (!passwordData.new) errors.new = "New password is required";
    else if (passwordData.new.length < 8)
      errors.new = "Password must be at least 8 characters";
    if (passwordData.new !== passwordData.confirm)
      errors.confirm = "Passwords do not match";
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  }, [passwordData]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;
    try {
      await handleApiRequest("put", "/user/password", {
        currentPassword: passwordData.current,
        newPassword: passwordData.new,
      });
      addNotification("Password changed successfully!");
      setShowPasswordModal(false);
      setPasswordData({ current: "", new: "", confirm: "" });
      setPasswordErrors({});
      setShowPassword({ current: false, new: false, confirm: false });
    } catch (error) {
      addNotification("Failed to change password");
    }
  };

  const handleLogout = useCallback(() => {
    onLogout();
    navigate("/login");
  }, [onLogout, navigate]);

  const closePasswordModal = useCallback(() => {
    if (!loading) {
      setShowPasswordModal(false);
      setPasswordData({ current: "", new: "", confirm: "" });
      setPasswordErrors({});
      setShowPassword({ current: false, new: false, confirm: false });
    }
  }, [loading]);

const handleRemoveProfilePic = () => {
  const id = Date.now();

  addNotification(
    <div className="flex flex-row sm:flex-row items-center gap-3">
      <p className="flex-1 text-sm font-medium">
        Are you sure you want to remove your profile picture?
      </p>

      <div className="flex gap-2 mt-2 sm:mt-0">
        <button
          onClick={async () => {
            try {
              const token = localStorage.getItem("token");

              await axios.delete(`${API_BASE}/user/profile/photo`, {
                headers: { Authorization: `Bearer ${token}` },
              });

              setUser((prev) => ({ ...prev, profilePic: "" }));
              setTempUser((prev) => ({ ...prev, profilePic: "" }));

              addNotification("Profile image removed!", "success");
            } catch (err) {
              addNotification("Failed to remove image", "error");
            } finally {
              removeNotification(id); // ✅ now works
            }
          }}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Confirm
        </button>
      </div>
    </div>,
    "warning",
    { id, duration: 0 }, // ✅ IMPORTANT
  );
};

  const initial = (user.name || user.email || "U").charAt(0).toUpperCase();

  return (
    <div className="min-h-full bg-[#f7f9fc] -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* ---------- Hero ---------- */}
        <section className="relative overflow-hidden rounded-[28px] bg-slate-950 px-6 py-7 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] sm:px-8 sm:py-9">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-center gap-5 sm:gap-6">
              {/* Avatar (drag & drop supported) */}
              <div
                className="relative h-24 w-24 shrink-0 sm:h-28 sm:w-28"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="h-full w-full overflow-hidden rounded-3xl border-2 border-white/15 bg-white/10 shadow-xl ring-4 ring-emerald-400/10">
                  {user.profilePic ? (
                    <img src={user.profilePic} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-400 to-cyan-500 text-4xl font-black text-white">
                      {initial}
                    </div>
                  )}
                </div>

                <label
                  title="Change photo"
                  className="absolute -bottom-2 -right-2 cursor-pointer rounded-xl bg-white p-2 text-slate-800 shadow-lg transition hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <Camera size={16} />
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>

                {user.profilePic && (
                  <button
                    type="button"
                    onClick={handleRemoveProfilePic}
                    title="Remove photo"
                    className="absolute -bottom-2 -left-2 rounded-xl bg-rose-500 p-2 text-white shadow-lg transition hover:bg-rose-600"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="min-w-0">
                <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-300">
                  <Sparkles size={13} /> Account Center
                </div>
                <h1 className="truncate text-2xl font-black tracking-tight sm:text-4xl">
                  {user.name || "Loading..."}
                </h1>
                <p className="mt-1.5 flex items-center gap-2 truncate text-sm text-slate-300">
                  <Mail size={14} className="shrink-0 text-slate-400" />
                  <span className="truncate">{user.email || "Loading..."}</span>
                </p>
              </div>
            </div>

            {(user.createdAt || user.joinDate) && (
              <div className="inline-flex shrink-0 items-center gap-2 self-start rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold text-slate-300 md:self-center">
                <CalendarDays size={16} className="text-emerald-300" />
                Member since {formatDate(user.createdAt || user.joinDate)}
              </div>
            )}
          </div>
        </section>

        {/* ---------- Cards ---------- */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Personal information */}
          <section className={`${ui.card} lg:col-span-2`}>
            <div className="mb-6 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <IconChip icon={User} className="bg-blue-50 text-blue-600" />
                <div>
                  <h2 className={ui.cardTitle}>Personal Information</h2>
                  <p className={ui.cardSub}>Your name and email shown across the platform</p>
                </div>
              </div>
              {!editMode && (
                <button onClick={() => setEditMode(true)} className={ui.ghost} disabled={loading}>
                  <Pencil size={13} /> {loading ? "Loading..." : "Edit"}
                </button>
              )}
            </div>

            {editMode ? (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={ui.label}>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={tempUser.name}
                      onChange={handleInputChange}
                      className={ui.input}
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className={ui.label}>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={tempUser.email}
                      onChange={handleInputChange}
                      className={ui.input}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <button onClick={handleProfileUpdate} className={ui.primary} disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button onClick={handleCancelEdit} className={ui.secondary} disabled={loading}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Full Name</p>
                  <p className="mt-1.5 truncate text-sm font-bold text-slate-950">{user.name || "—"}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Email Address</p>
                  <p className="mt-1.5 truncate text-sm font-bold text-slate-950">{user.email || "—"}</p>
                </div>
              </div>
            )}
          </section>

          {/* Account security */}
          <section className={ui.card}>
            <div className="mb-6 flex items-center gap-3">
              <IconChip icon={ShieldCheck} className="bg-violet-50 text-violet-600" />
              <div>
                <h2 className={ui.cardTitle}>Account Security</h2>
                <p className={ui.cardSub}>Keep your account protected</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
                  <KeyRound size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-950">Password</p>
                  <p className="text-xs text-slate-500">At least 8 characters</p>
                </div>
              </div>
              <button onClick={() => setShowPasswordModal(true)} className={ui.ghost} disabled={loading}>
                Change
              </button>
            </div>

            <button onClick={handleLogout} className={`${ui.primary} mt-5 w-full`} disabled={loading}>
              <LogOut size={15} /> {loading ? "Processing..." : "Logout"}
            </button>
          </section>
        </div>

        {/* Danger zone */}
        <section className="rounded-3xl border border-rose-100 bg-white p-5 shadow-[0_10px_40px_rgba(15,23,42,0.05)] sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <IconChip icon={AlertTriangle} className="bg-rose-50 text-rose-600" />
              <div>
                <h2 className={ui.cardTitle}>Danger Zone</h2>
                <p className={ui.cardSub}>Deleting your account permanently removes your profile and test history. This can't be undone.</p>
              </div>
            </div>
            <div className="shrink-0">
              <DeleteAccount />
            </div>
          </div>
        </section>
      </div>

      {/* ---------- Crop photo modal ---------- */}
      {previewImage && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-[360px] rounded-3xl bg-white p-5 shadow-2xl">
            <h3 className="mb-3 text-base font-extrabold text-slate-950">Adjust your photo</h3>
            <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-slate-950">
              <Cropper
                image={previewImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="mt-4 w-full accent-emerald-600"
              aria-label="Zoom"
            />
            <div className="mt-4 flex gap-3">
              <button onClick={handleImageUpload} disabled={loading} className={`${ui.primary} flex-1`}>
                {loading ? "Uploading..." : "Save"}
              </button>
              <button onClick={handleCancelImageEdit} disabled={loading} className={`${ui.secondary} flex-1`}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- Change password modal ---------- */}
      <Modal
        isOpen={showPasswordModal}
        onRequestClose={closePasswordModal}
        contentLabel="Change Password"
        className="modal"
        overlayClassName="modal-overlay"
        shouldCloseOnOverlayClick={!loading}
        shouldCloseOnEsc={!loading}
      >
        <div className="w-full min-w-0 rounded-2xl bg-white p-6 sm:w-[420px]">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <IconChip icon={Lock} className="bg-violet-50 text-violet-600" />
              <div>
                <h3 className={ui.cardTitle}>Change Password</h3>
                <p className={ui.cardSub}>Choose a strong, unique password</p>
              </div>
            </div>
            <button
              onClick={closePasswordModal}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              disabled={loading}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <PasswordInput
              name="current"
              label="Current Password"
              value={passwordData.current}
              error={passwordErrors.current}
              showField={showPassword.current}
              onToggle={() => togglePasswordVisibility("current")}
              onChange={handlePasswordChange}
              disabled={loading}
            />
            <PasswordInput
              name="new"
              label="New Password"
              value={passwordData.new}
              error={passwordErrors.new}
              showField={showPassword.new}
              onToggle={() => togglePasswordVisibility("new")}
              onChange={handlePasswordChange}
              disabled={loading}
            />
            <PasswordInput
              name="confirm"
              label="Confirm New Password"
              value={passwordData.confirm}
              error={passwordErrors.confirm}
              showField={showPassword.confirm}
              onToggle={() => togglePasswordVisibility("confirm")}
              onChange={handlePasswordChange}
              disabled={loading}
            />

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button type="submit" className={`${ui.primary} flex-1`} disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </button>
              <button type="button" onClick={closePasswordModal} className={`${ui.secondary} flex-1`} disabled={loading}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
