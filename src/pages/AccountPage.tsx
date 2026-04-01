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
        <main className="flex min-h-[60vh] items-center justify-center px-4 py-8">
          <div className="w-full max-w-md rounded-xl border border-[#2a3f5d] bg-[#111b2c] p-6 text-center">
            <p className="text-[#ecf3ff]">Loading your profile...</p>
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
    const clearedData = {
      title: "",
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "",
      phone: "",
      email: "",
      dob: "",
      anniversary: ""
    };
    
    // 1. Clear local form
    setFormData(clearedData);

    // 2. Clear global user state in AuthContext
    if (user) {
      const updatedUser = {
        ...user,
        ...clearedData,
        username: user.email || "User" // Reset username to email or default
      };
      setUser(updatedUser);
      
      // 3. Clear from local storage persistence
      localStorage.setItem("summitCurrentUser", JSON.stringify(updatedUser));
      
      // Update the mock registration list if it exists
      const existingStr = localStorage.getItem("shivam_registered_users");
      if (existingStr) {
        try {
          const users = JSON.parse(existingStr);
          const i = users.findIndex((u: any) => u.email === user.email);
          if (i !== -1) {
            users[i] = { ...users[i], ...updatedUser };
            localStorage.setItem("shivam_registered_users", JSON.stringify(users));
          }
        } catch {}
      }
    }
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
      <main className="relative min-h-[80vh] overflow-hidden px-5 py-12" role="main">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,_#0a0e1a_0%,_#0f1629_25%,_#131c33_50%,_#0d1220_100%)]" aria-hidden="true">
          <div
            className="absolute inset-0 motion-safe:animate-[auth-grid-pulse_4s_ease-in-out_infinite]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(88, 166, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(88, 166, 255, 0.03) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="mx-auto w-full max-w-4xl rounded-xl border border-[#2a3f5d] bg-[#111b2c] p-8">
          <h1 className="mb-8 text-left text-3xl font-semibold text-[#ecf3ff]">My Profile Page</h1>

          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              <div>
                <label className="mb-1 block text-sm text-[#d5deec]">Title</label>
                <div className="relative">
                  <select
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-lg border border-[#2a3f5d] bg-[#0d1424] px-3 py-2 text-sm text-[#ecf3ff] outline-none transition focus:border-[#5ec7ff]"
                  >
                    <option value="" style={{ backgroundColor: "#0d1424", color: "#ecf3ff" }}>
                      Select Title
                    </option>
                    <option value="Mr" style={{ backgroundColor: "#0d1424", color: "#ecf3ff" }}>
                      Mr.
                    </option>
                    <option value="Ms" style={{ backgroundColor: "#0d1424", color: "#ecf3ff" }}>
                      Ms.
                    </option>
                    <option value="Mrs" style={{ backgroundColor: "#0d1424", color: "#ecf3ff" }}>
                      Mrs.
                    </option>
                    <option value="Dr" style={{ backgroundColor: "#0d1424", color: "#ecf3ff" }}>
                      Dr.
                    </option>
                  </select>
                  <svg
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7aa6d9]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm text-[#d5deec]">First Name</label>
                <input
                  className="w-full rounded-lg border border-[#2a3f5d] bg-transparent px-3 py-2 text-sm text-[#ecf3ff] outline-none transition focus:border-[#5ec7ff]"
                  type="text"
                  name="firstName"
                  placeholder="Enter First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-[#d5deec]">Middle Name</label>
                <input
                  className="w-full rounded-lg border border-[#2a3f5d] bg-transparent px-3 py-2 text-sm text-[#ecf3ff] outline-none transition focus:border-[#5ec7ff]"
                  type="text"
                  name="middleName"
                  placeholder="Enter Middle Name"
                  value={formData.middleName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-[#d5deec]">Last Name</label>
                <input
                  className="w-full rounded-lg border border-[#2a3f5d] bg-transparent px-3 py-2 text-sm text-[#ecf3ff] outline-none transition focus:border-[#5ec7ff]"
                  type="text"
                  name="lastName"
                  placeholder="Enter Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>

              <div className="md:col-span-2">
                <div className="flex flex-wrap gap-3">
                  <label className="inline-flex items-center gap-2 rounded-full border border-[#2a3f5d] px-3 py-1.5 text-sm text-[#d5deec]">
                    <input type="radio" name="gender" value="Female" checked={formData.gender === "Female"} onChange={handleChange} />
                    Female
                  </label>
                  <label className="inline-flex items-center gap-2 rounded-full border border-[#2a3f5d] px-3 py-1.5 text-sm text-[#d5deec]">
                    <input type="radio" name="gender" value="Male" checked={formData.gender === "Male"} onChange={handleChange} />
                    Male
                  </label>
                  <label className="inline-flex items-center gap-2 rounded-full border border-[#2a3f5d] px-3 py-1.5 text-sm text-[#d5deec]">
                    <input type="radio" name="gender" value="Transgender" checked={formData.gender === "Transgender"} onChange={handleChange} />
                    Transgender
                  </label>
                  <label className="inline-flex items-center gap-2 rounded-full border border-[#2a3f5d] px-3 py-1.5 text-sm text-[#d5deec]">
                    <input type="radio" name="gender" value="Other" checked={formData.gender === "Other"} onChange={handleChange} />
                    I'd rather not say
                  </label>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm text-[#d5deec]">Mobile Number *</label>
                <input
                  className="w-full rounded-lg border border-[#2a3f5d] bg-transparent px-3 py-2 text-sm text-[#ecf3ff] outline-none transition focus:border-[#5ec7ff]"
                  type="tel"
                  name="phone"
                  placeholder="Enter Mobile Number"
                  value={formData.phone || ""}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-[#d5deec]">Email Id *</label>
                <input
                  className="w-full rounded-lg border border-[#2a3f5d] bg-transparent px-3 py-2 text-sm text-[#ecf3ff] outline-none transition focus:border-[#5ec7ff]"
                  type="email"
                  name="email"
                  placeholder="Enter Email ID"
                  value={formData.email || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-[#d5deec]">Date of Birth</label>
                <input
                  className="w-full rounded-lg border border-[#2a3f5d] bg-transparent px-3 py-2 text-sm text-[#ecf3ff] placeholder:text-[#7f8ead] outline-none transition focus:border-[#5ec7ff]"
                  type={formData.dob ? "date" : "text"}
                  inputMode="numeric"
                  placeholder="dd - mm - yyyy"
                  name="dob"
                  value={formData.dob}
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => {
                    if (!e.target.value) e.target.type = "text";
                  }}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-[#d5deec]">Date of Anniversary</label>
                <input
                  className="w-full rounded-lg border border-[#2a3f5d] bg-transparent px-3 py-2 text-sm text-[#ecf3ff] placeholder:text-[#7f8ead] outline-none transition focus:border-[#5ec7ff]"
                  type={formData.anniversary ? "date" : "text"}
                  inputMode="numeric"
                  placeholder="dd - mm - yyyy"
                  name="anniversary"
                  value={formData.anniversary}
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => {
                    if (!e.target.value) e.target.type = "text";
                  }}
                  onChange={handleChange}
                />
              </div>

            </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-full border border-[#3a506f] bg-white/10 px-5 py-2.5 text-sm font-semibold text-[#d5deec] backdrop-blur transition hover:border-[#5ec7ff] hover:bg-white/15 hover:text-[#5ec7ff]"
                  onClick={handleDiscard}
              >
                DISCARD CHANGES
              </button>
              <button
                type="submit"
                className="rounded-full border border-[#14b8a6] bg-[#14b8a6] px-5 py-2.5 text-sm font-semibold text-[#06211e] transition hover:bg-[#2dd4bf]"
              >
                SAVE CHANGES
              </button>
            </div>
          </form>

        </div>
      </main>
      <Footer />
    </>
  );
}
