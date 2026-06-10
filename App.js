import { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

function App() {
  const { t, i18n } = useTranslation();

  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [language, setLanguage] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  /* =========================
     SEND OTP
     ========================= */
  const handleLanguageChange = async (e) => {
    const lang = e.target.value;
    setLanguage(lang);

    try {
      await axios.post("http://localhost:5000/send-otp", {
        email,
        mobile
      });

      alert("OTP sent to email & mobile");
      setShowOtp(true);

    } catch (err) {
      console.log(err);
      alert("Backend error");
    }
  };

  /* =========================
     VERIFY OTP
     ========================= */
  const verifyOtp = async () => {
    try {
      const res = await axios.post("http://localhost:5000/verify-otp", {
        otp,
        email,
        mobile,
        language
      });

      if (res.data.success) {
        i18n.changeLanguage(language);
        alert("Language changed successfully");
        setShowOtp(false);
        setOtp("");
      } else {
        alert("Invalid OTP");
      }

    } catch (err) {
      console.log(err);
      alert("Verification failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>{t("welcome")}</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Mobile"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />

      <br /><br />

      <select onChange={handleLanguageChange}>
        <option value="">Select Language</option>
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="hi">Hindi</option>
        <option value="pt">Portuguese</option>
        <option value="zh">Chinese</option>
        <option value="fr">French</option>
      </select>

      {showOtp && (
        <div>
          <br />
          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button onClick={verifyOtp}>
            Verify OTP
          </button>
        </div>
      )}
    </div>
  );
}

export default App;