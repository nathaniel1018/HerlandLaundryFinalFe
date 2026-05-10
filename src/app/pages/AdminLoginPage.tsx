import { useState } from "react";
import { useNavigate } from "react-router";
import { Logo } from "../components/Logo";
import { BackgroundShape } from "../components/BackgroundShape";
import { MobileContainer } from "../components/MobileContainer";
import { Eye, EyeOff } from "lucide-react";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ username: "", password: "" });

  const handleLogin = () => {
    const newErrors = { username: "", password: "" };

    if (!username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    if (!newErrors.username && !newErrors.password) {
      // Navigate to two-step verification
      navigate("/two-step-verification");
    }
  };

  return (
    <MobileContainer>
      <div
        className="relative size-full flex flex-col items-center px-6 pb-8"
        data-name="Log in (Admin)"
        style={{
          backgroundImage:
            "linear-gradient(88.7631deg, rgb(143, 219, 255) 3.9489%, rgb(61, 173, 226) 99.513%)",
        }}
      >
        <BackgroundShape />

        {/* Logo - Centered at top */}
        <div className="relative z-10 mt-[60px] mb-[60px]">
          <Logo />
        </div>

        {/* Login Section - Rebuilt */}
        <div className="relative z-10 w-full flex flex-col items-center">
          {/* 1. Welcome Back Title - Centered */}
          <h1 className="font-['Poppins:SemiBold',sans-serif] text-[#184e8d] text-[32px] tracking-[1.6px] text-center mb-[40px]">
            Welcome Back!
          </h1>

          {/* Form Container - All elements same width and centered */}
          <div className="w-full max-w-[307px] px-4 flex flex-col">
            {/* 2. Username Input Field */}
            <div className="mb-[20px]">
              <label className="font-['Poppins:Medium',sans-serif] text-[#184e8d] text-[15px] mb-2 block">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full bg-white/90 border-2 border-[#3878c2]/30 rounded-lg px-4 py-3 outline-none font-['Poppins:Regular',sans-serif] text-[15px] text-[#184e8d] placeholder:text-[#3878c2]/50 focus:border-[#3878c2] focus:bg-white transition-colors"
                style={{ caretColor: "#3878c2" }}
              />
              {errors.username && (
                <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-red-500 mt-1">{errors.username}</p>
              )}
            </div>

            {/* 3. Password Input Field with Show/Hide Icon */}
            <div className="mb-[15px]">
              <label className="font-['Poppins:Medium',sans-serif] text-[#184e8d] text-[15px] mb-2 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-white/90 border-2 border-[#3878c2]/30 rounded-lg px-4 py-3 pr-12 outline-none font-['Poppins:Regular',sans-serif] text-[15px] text-[#184e8d] placeholder:text-[#3878c2]/50 focus:border-[#3878c2] focus:bg-white transition-colors"
                  style={{ caretColor: "#3878c2" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer bg-transparent border-none p-1 flex items-center justify-center"
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5 text-[#63BCE6]" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-[#63BCE6]" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* 4. Horizontal Row: Remember Me + Forgot Password */}
            <div className="flex items-center justify-between mb-[40px] w-full">
              {/* LEFT: Remember Me Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-[16px] h-[16px] cursor-pointer accent-[#3878c2]"
                />
                <span className="font-['Poppins:Medium',sans-serif] text-[#184e8d] text-[12px] select-none">
                  Remember Me
                </span>
              </label>

              {/* RIGHT: Forgot Password Link */}
              <button
                onClick={() => navigate("/forgot-password")}
                className="font-['Poppins:Medium',sans-serif] text-[#4bad40] text-[12px] underline bg-transparent border-none cursor-pointer hover:text-[#3d9932] transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          </div>
        </div>

        {/* 5. Primary Button: Log in as Administrator */}
        <div className="relative z-10 w-full max-w-[352px] px-4 mt-[20px]">
          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-[#20a9ea] to-[#006c9f] via-[#118cc6] via-[69.712%] h-[47px] rounded-[30px] flex items-center justify-center cursor-pointer border-none shadow-[0_4px_12px_rgba(17,140,198,0.25)] hover:shadow-[0_6px_16px_rgba(17,140,198,0.35)] active:scale-[0.98] transition-all"
          >
            <span className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-white tracking-[0.8px]">
              Log in as Administrator
            </span>
          </button>
        </div>
      </div>
    </MobileContainer>
  );
}
