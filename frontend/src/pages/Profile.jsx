import React, { memo, useCallback, useState, useEffect } from "react";
import { profileStyles } from "../assets/dummyStyles2";
import Modal from "react-modal";
import { Eye, EyeOff, User, X, Lock, Camera, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cropper from "react-easy-crop";
import DeleteAccount from "../components/DeleteAccount";
import imageCompression from "browser-image-compression";
import { useNotifications } from "../Context/NotificationProvider";

const API_BASE = import.meta.env.VITE_API_BASE;

Modal.setAppElement("#root");

// Password Input (memoized)
const PasswordInput = memo(
  ({ name, label, value, error, showField, onToggle, onChange, disabled }) => (
    <div>
      <label className={profileStyles.passwordLabel}>{label}</label>
      <div className={profileStyles.passwordContainer}>
        <input
          type={showField ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          className={`${profileStyles.inputWithError} ${
            error ? "border-red-300" : "border-gray-200"
          }`}
          placeholder={`Enter ${label.toLowerCase()}`}
          disabled={disabled}
        />
        <button
          type="button"
          onClick={onToggle}
          className={profileStyles.passwordToggle}
          disabled={disabled}
        >
          {showField ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>
      {error && <p className={profileStyles.errorText}>{error}</p>}
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

  return (
    <div className={profileStyles.container}>
      <div className={profileStyles.mainContainer}>
        <div className={profileStyles.header}>
          <div
            className="relative group w-24 h-24"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {/* Profile Image */}
            <div className={profileStyles.avatar}>
              {user.profilePic ? (
                <img
                  src={previewImage || user.profilePic || ""}
                  alt="Profile"
                  className="w-40 h-40 mx-1 mb-20 object-cover rounded-lg border-3 blur-box border-amber-50"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 -mt-16 flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>

            {previewImage && (
              <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
                <div className="bg-white rounded-xl p-4 w-[320px] shadow-xl">
                  {/* Crop Area */}
                  <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden">
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

                  {/* Zoom */}
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full mt-3"
                  />

                  {/* Buttons */}
                  <div className="mt-4 flex justify-between gap-2">
                    <button
                      onClick={handleImageUpload}
                      disabled={loading}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
                    >
                      {loading ? "Uploading..." : "Save"}
                    </button>

                    <button
                      onClick={handleCancelImageEdit}
                      disabled={loading}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* 🔥 Hover Overlay */}
            {!previewImage && (
              <div className="absolute inset-14 mt-8 px-7 bg-black bg-opacity-50 rounded-lg flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Upload Button */}
                <label className="cursor-pointer bg-white p-2 rounded-full hover:bg-gray-200 transition">
                  <Camera className="w-5 h-5 text-black" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {/* Remove Button */}
                {user.profilePic && (
                  <button
                    onClick={handleRemoveProfilePic}
                    className="bg-red-500 p-2 rounded-full hover:bg-red-600 transition"
                  >
                    <Trash2 className="w-5 h-5 text-white" />
                  </button>
                )}

                {loading && previewImage && (
                  <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center">
                    <div className="bg-white px-6 py-4 rounded-lg shadow-lg">
                      <p className="text-gray-700 font-medium animate-pulse">
                        Uploading image...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="text-center -mt-32 mb-10">
          <h1 className={profileStyles.userName}>
            {user.name || "Loading..."}
          </h1>
          <p className={profileStyles.userEmail}>
            {user.email || "Loading..."}
          </p>
        </div>
        <div className={profileStyles.content}>
          <div className={profileStyles.grid}>
            {/* Personal Info Card */}
            <div className={profileStyles.card}>
              <div className="flex justify-between items-center mb-6">
                <h2 className={profileStyles.cardTitle}>
                  <User className={profileStyles.icon} /> Personal Information
                </h2>
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className={profileStyles.editButton}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Edit"}
                  </button>
                )}
              </div>

              {editMode ? (
                <div className="space-y-4">
                  <div>
                    <label className={profileStyles.label}>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={tempUser.name}
                      onChange={handleInputChange}
                      className={profileStyles.input}
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className={profileStyles.label}>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={tempUser.email}
                      onChange={handleInputChange}
                      className={profileStyles.input}
                      disabled={loading}
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleProfileUpdate}
                      className={profileStyles.buttonPrimary}
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className={profileStyles.buttonSecondary}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className={profileStyles.label}>Full Name</p>
                    <p className="font-medium text-gray-800">{user.name}</p>
                  </div>
                  <div>
                    <p className={profileStyles.label}>Email Address</p>
                    <p className="font-medium text-gray-800">{user.email}</p>
                  </div>
                </div>
              )}
              <div className="border-t border-teal-500 p-4 mt-10"></div>
              <div className="center-container mt-1 flex items-center justify-center">
                <DeleteAccount />
              </div>
            </div>

            {/* Account Security Card */}
            <div className={profileStyles.card}>
              <h2 className={profileStyles.cardTitle}>
                <Lock className={profileStyles.icon} /> Account Security
              </h2>
              <div className="space-y-4">
                <div className={profileStyles.securityItem}>
                  <p className={profileStyles.securityText}>Password</p>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className={profileStyles.changeButton}
                    disabled={loading}
                  >
                    Change
                  </button>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className={`${profileStyles.buttonPrimary} mt-6 w-full hover:opacity-90 transition-opacity`}
                disabled={loading}
              >
                {loading ? "Processing..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onRequestClose={closePasswordModal}
        contentLabel="Change Password"
        className="modal"
        overlayClassName="modal-overlay"
        shouldCloseOnOverlayClick={!loading}
        shouldCloseOnEsc={!loading}
      >
        <div className={profileStyles.modalContent}>
          <div className={profileStyles.modalHeader}>
            <h3 className={profileStyles.modalTitle}>Change Password</h3>
            <button
              onClick={closePasswordModal}
              className="text-gray-500 hover:text-gray-800 disabled:opacity-50"
              disabled={loading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 lg:-mx-20">
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

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className={profileStyles.buttonPrimary}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
              <button
                type="button"
                onClick={closePasswordModal}
                className={profileStyles.buttonSecondary}
                disabled={loading}
              >
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
