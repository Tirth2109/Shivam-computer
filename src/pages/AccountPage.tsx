import { useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import HeaderWithDeals from "../components/HeaderWithDeals";
import Footer from "../components/Footer";

export default function AccountPage() {
  const { user, loading, setUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    phone: "",
    email: "",
    dob: "",
    anniversary: ""
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    } else if (user) {
      setFormData({
        title: user.title || "",
        firstName: user.firstName || user.username?.split(" ")[0] || "",
        middleName: user.middleName || "",
        lastName: user.lastName || user.username?.split(" ").slice(1).join(" ") || "",
        gender: user.gender || "",
        phone: user.phone || "",
        email: user.email || "",
        dob: user.dob || "",
        anniversary: user.anniversary || ""
      });
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <>
        <HeaderWithDeals />
        <main className="auth-page">
          <div className="auth-card">
            <p>Loading your profile...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDiscard = () => {
    // Reset to user data
    setFormData({
      title: user.title || "",
      firstName: user.firstName || user.username?.split(" ")[0] || "",
      middleName: user.middleName || "",
      lastName: user.lastName || user.username?.split(" ").slice(1).join(" ") || "",
      gender: user.gender || "",
      phone: user.phone || "",
      email: user.email || "",
      dob: user.dob || "",
      anniversary: user.anniversary || ""
    });
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const newUser = {
      ...user,
      ...formData,
      username: [formData.firstName, formData.lastName].filter(Boolean).join(" ") || user.username
    };
    
    // In a real app, API call here to update Supabase metadata.
    // For now we just update context & local storage mock.
    setUser(newUser);
    const existingStr = localStorage.getItem("shivam_registered_users");
    if (existingStr) {
       try {
         const users = JSON.parse(existingStr);
         const i = users.findIndex((u: any) => u.username === user.username || u.email === user.email || u.phone === user.phone);
         if (i !== -1) {
            users[i] = { ...users[i], ...newUser };
            localStorage.setItem("shivam_registered_users", JSON.stringify(users));
         }
       } catch {}
    }
    localStorage.setItem("summitCurrentUser", JSON.stringify(newUser));
    alert("Profile changes saved securely.");
  };

  return (
    <>
      <HeaderWithDeals />
      <main className="auth-page auth-page-standalone auth-page-game-bg" role="main" style={{ padding: "4rem 1.25rem", minHeight: "80vh", justifyContent: "flex-start", alignItems: "center" }}>
        <div className="auth-bg-game" aria-hidden="true">
          <div className="auth-bg-grid" />
        </div>
        
        <div className="auth-card account-card" style={{ maxWidth: "800px", width: "100%", padding: "2.5rem" }}>
          <h1 style={{ textAlign: "left", fontSize: "1.75rem", marginBottom: "2rem" }}>My Profile Page</h1>
          
          <form onSubmit={handleSave}>
            <div className="account-profile-grid">
              
              <div className="account-field">
                <label>Title</label>
                <select name="title" value={formData.title} onChange={handleChange}>
                  <option value="">Select Title</option>
                  <option value="Mr">Mr.</option>
                  <option value="Ms">Ms.</option>
                  <option value="Mrs">Mrs.</option>
                  <option value="Dr">Dr.</option>
                </select>
              </div>

              <div className="account-field">
                <label>First Name</label>
                <input type="text" name="firstName" placeholder="Enter First Name" value={formData.firstName} onChange={handleChange} />
              </div>

              <div className="account-field">
                <label>Middle Name</label>
                <input type="text" name="middleName" placeholder="Enter Middle Name" value={formData.middleName} onChange={handleChange} />
              </div>

              <div className="account-field">
                <label>Last Name</label>
                <input type="text" name="lastName" placeholder="Enter Last Name" value={formData.lastName} onChange={handleChange} />
              </div>

              <div className="account-field" style={{ gridColumn: "1 / -1" }}>
                <div className="gender-options">
                  <label className="gender-option">
                    <input type="radio" name="gender" value="Female" checked={formData.gender === "Female"} onChange={handleChange} />
                    Female
                  </label>
                  <label className="gender-option">
                    <input type="radio" name="gender" value="Male" checked={formData.gender === "Male"} onChange={handleChange} />
                    Male
                  </label>
                  <label className="gender-option">
                    <input type="radio" name="gender" value="Transgender" checked={formData.gender === "Transgender"} onChange={handleChange} />
                    Transgender
                  </label>
                  <label className="gender-option">
                    <input type="radio" name="gender" value="Other" checked={formData.gender === "Other"} onChange={handleChange} />
                    I'd rather not say
                  </label>
                </div>
              </div>

              <div className="account-field">
                <label>Mobile Number *</label>
                <input type="tel" name="phone" placeholder="Enter Mobile Number" value={formData.phone || ""} onChange={handleChange} />
              </div>

              <div className="account-field">
                <label>Email Id *</label>
                <input type="email" name="email" placeholder="Enter Email ID" value={formData.email || ""} onChange={handleChange} required />
              </div>

              <div className="account-field">
                <label>Date of Birth</label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
              </div>

              <div className="account-field">
                <label>Date of Anniversary</label>
                <input type="date" name="anniversary" value={formData.anniversary} onChange={handleChange} />
              </div>

            </div>

            <div className="account-actions">
              <button type="button" className="btn outline" style={{ color: "var(--text)", borderColor: "var(--border)" }} onClick={handleDiscard}>DISCARD CHANGES</button>
              <button type="submit" className="btn btn-teal">SAVE CHANGES</button>
            </div>
          </form>

        </div>
      </main>
      <Footer />
    </>
  );
}
