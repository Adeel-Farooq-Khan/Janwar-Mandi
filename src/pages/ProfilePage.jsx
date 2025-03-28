import { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebase";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSave, FaCamera } from "react-icons/fa";
import "../styles/profile.css";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [profileData, setProfileData] = useState({
    displayName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    photoURL: ""
  });
  
  // Fetch user data on component mount
  useEffect(() => {
    const currentUser = auth.currentUser;
    
    if (currentUser) {
      setUser(currentUser);
      
      // Set initial profile data from auth user
      setProfileData({
        displayName: currentUser.displayName || "",
        email: currentUser.email || "",
        phone: "",
        location: "",
        bio: "",
        photoURL: currentUser.photoURL || ""
      });
      
      // Try to fetch additional user data from Firestore
      fetchUserProfile(currentUser.uid);
    } else {
      setLoading(false);
    }
  }, []);
  
  const fetchUserProfile = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      
      if (userDoc.exists()) {
        // Merge Firestore data with auth data
        const userData = userDoc.data();
        
        setProfileData(prevData => ({
          ...prevData,
          phone: userData.phone || prevData.phone,
          location: userData.location || prevData.location,
          bio: userData.bio || prevData.bio,
          photoURL: userData.photoURL || prevData.photoURL
        }));
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };
  
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({
          ...profileData,
          photoURL: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) return;
    
    setError("");
    setSuccess("");
    setSaving(true);
    
    try {
      // Update auth profile (only displayName and photoURL can be updated)
      await updateProfile(user, {
        displayName: profileData.displayName,
        photoURL: profileData.photoURL
      });
      
      // Update or create user document in Firestore
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        // Update existing document
        await updateDoc(userRef, {
          displayName: profileData.displayName,
          phone: profileData.phone,
          location: profileData.location,
          bio: profileData.bio,
          photoURL: profileData.photoURL,
          updatedAt: new Date()
        });
      } else {
        // Create new document
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: profileData.displayName,
          phone: profileData.phone,
          location: profileData.location,
          bio: profileData.bio,
          photoURL: profileData.photoURL,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      setSuccess("Profile updated successfully!");
      
      // Update local user state to reflect changes
      setUser({
        ...user,
        displayName: profileData.displayName,
        photoURL: profileData.photoURL
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }
  
  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your personal information and settings</p>
      </div>
      
      {error && <div className="profile-error">{error}</div>}
      {success && <div className="profile-success">{success}</div>}
      
      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="profile-photo-container">
            {profileData.photoURL ? (
              <img 
                src={profileData.photoURL || "/placeholder.svg"} 
                alt="Profile" 
                className="profile-photo" 
                onError={(e) => {
                  e.target.src = "/placeholder.svg";
                }}
              />
            ) : (
              <div className="profile-photo-placeholder">
                <FaUser />
              </div>
            )}
            
            <label className="profile-photo-upload">
              <FaCamera />
              <input 
                type="file" 
                accept="image/*" 
                onChange={handlePhotoChange} 
                className="hidden-input" 
              />
            </label>
          </div>
          
          <div className="profile-user-info">
            <h3>{profileData.displayName || "User"}</h3>
            <p>{profileData.email}</p>
          </div>
        </div>
        
        <div className="profile-form-container">
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label>
                <FaUser className="form-icon" />
                Full Name
              </label>
              <input
                type="text"
                name="displayName"
                value={profileData.displayName}
                onChange={handleInputChange}
                placeholder="Your full name"
              />
            </div>
            
            <div className="form-group">
              <label>
                <FaEnvelope className="form-icon" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                disabled
                className="disabled-input"
              />
              <small>Email cannot be changed</small>
            </div>
            
            <div className="form-group">
              <label>
                <FaPhone className="form-icon" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                placeholder="Your phone number"
              />
            </div>
            
            <div className="form-group">
              <label>
                <FaMapMarkerAlt className="form-icon" />
                Location
              </label>
              <input
                type="text"
                name="location"
                value={profileData.location}
                onChange={handleInputChange}
                placeholder="City, Province"
              />
            </div>
            
            <div className="form-group">
              <label>Bio</label>
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself"
                rows="4"
              ></textarea>
            </div>
            
            <button type="submit" className="profile-save-button" disabled={saving}>
              {saving ? "Saving..." : (
                <>
                  <FaSave /> Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}