import { useState } from "react";
import { useNavigate } from "react-router";
import { Logo } from "../components/Logo";
import { BackgroundShape } from "../components/BackgroundShape";
import { MobileContainer } from "../components/MobileContainer";
import { Eye, EyeOff } from "lucide-react";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", general: "" });
  const [isLoading, setIsLoading] = useState(false);


   const handleLogin = async () => {

    const newErrors = { email: "", password: "", general: "" };

   

    if (!email.trim()) {

      newErrors.email = "Email is required";

    }

    if (!password.trim()) {

      newErrors.password = "Password is required";

    }



    setErrors(newErrors);



    if (!newErrors.email && !newErrors.password) {

      setIsLoading(true);

     

      try {

        const response = await fetch("http://localhost:3000/auth/login", {

          method: "POST",

          headers: {

            "Content-Type": "application/json",

          },

          body: JSON.stringify({ email, password }),

        });



        const data = await response.json();



        if (!response.ok) {

          throw new Error(data.message || "Invalid credentials");

        }



        // 1. Kung kailangan ng 2FA (OTP)

        if (data.message === '2FA_REQUIRED') {

          // Ipasa natin ang email at password sa 2FA page

          navigate("/two-step-verification", { state: { email, password } });

        }

        // 2. Kung rekta pasok na

        else if (data.access_token) {

          localStorage.setItem("access_token", data.access_token);

          navigate("/dashboard");

        }



      } catch (error: any) {

        setErrors(prev => ({ ...prev, general: error.message }));

      } finally {

        setIsLoading(false);

      }

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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-white/90 border-2 border-[#3878c2]/30 rounded-lg px-4 py-3 outline-none font-['Poppins:Regular',sans-serif] text-[15px] text-[#184e8d] placeholder:text-[#3878c2]/50 focus:border-[#3878c2] focus:bg-white transition-colors"
                style={{ caretColor: "#3878c2" }}
              />
              {errors.email && (
                <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-red-500 mt-1">{errors.email}</p>
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
