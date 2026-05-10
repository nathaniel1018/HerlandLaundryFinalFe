import svgPaths from "./svg-b3mfhhii1i";
import imgImage1 from "figma:asset/f457349b17fd05e4cc1022e536101af94fd58fcc.png";

function Bg() {
  return (
    <div className="absolute h-[1037px] left-[-251px] top-[154px] w-[902.069px]" data-name="BG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 902.069 1037">
        <g id="BG">
          <path d={svgPaths.p278eb900} fill="url(#paint0_linear_2_635)" id="Rectangle 2" />
          <path d={svgPaths.p24a81b80} fill="var(--fill-0, white)" id="Rectangle 1" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_2_635" x1="364" x2="567.5" y1="-2.12792e-05" y2="19">
            <stop stopColor="#3878C2" />
            <stop offset="1" stopColor="#4BAD40" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Logo() {
  return (
    <div className="absolute contents left-[126px] top-[41px]" data-name="Logo">
      <div className="absolute h-[133px] left-[126px] top-[41px] w-[188px]" data-name="image 1">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[248.86%] left-[-36.29%] max-w-none top-[-36.36%] w-[176.61%]" src={imgImage1} />
        </div>
      </div>
      <div className="absolute h-[35px] left-[168px] top-[174px] w-[105px]" data-name="image 2">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[393.09%] left-[-14.82%] max-w-none top-[-211.98%] w-[131.12%]" src={imgImage1} />
        </div>
      </div>
    </div>
  );
}

function EyeOffButton() {
  return (
    <div className="absolute h-[21px] left-[348px] top-[545px] w-[23px]" data-name="eyeOffButton">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 21">
        <g clipPath="url(#clip0_2_849)" id="eyeOffButton">
          <path d={svgPaths.p2f9b3140} id="Vector" stroke="var(--stroke-0, #63BCE6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M0.821429 0L23 20.3" id="Vector_2" stroke="var(--stroke-0, #63BCE6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_2_849">
            <rect fill="white" height="21" width="23" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function RememberMeCheckButton() {
  return (
    <div className="absolute left-[73px] size-[17px] top-[605px]" data-name="rememberMeCheckButton">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
        <g id="rememberMeCheckButton">
          <rect fill="var(--fill-0, #4BAD40)" height="17" id="Rectangle 69" width="17" />
          <path d="M4 9.2L6.85714 12L13 5" id="Vector 1" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function CredentialField() {
  return (
    <div className="absolute contents left-[73px] top-[478px]" data-name="Credential Field">
      <div className="absolute h-0 left-[73px] top-[577px] w-[307px]" data-name="passwordFieldLine">
        <div className="absolute inset-[-1.5px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 307 1.5">
            <line id="passwordFieldLine" stroke="var(--stroke-0, #EEEEEE)" strokeWidth="1.5" x2="307" y1="0.75" y2="0.75" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[normal] left-[73px] not-italic text-[#3878c2] text-[15px] top-[543px] whitespace-nowrap">Password</p>
      <div className="absolute h-0 left-[73px] top-[512px] w-[307px]" data-name="emailFieldLine">
        <div className="absolute inset-[-1.5px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 307 1.5">
            <line id="emailFieldLine" stroke="var(--stroke-0, #F2F2F2)" strokeWidth="1.5" x2="307" y1="0.75" y2="0.75" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[normal] left-[73px] not-italic text-[#3878c2] text-[15px] top-[478px] whitespace-nowrap">Username</p>
      <p className="-translate-x-full absolute decoration-solid font-['Poppins:Medium',sans-serif] leading-[normal] left-[380px] not-italic text-[#4bad40] text-[12px] text-right top-[605px] underline whitespace-nowrap">Forgot Password?</p>
      <EyeOffButton />
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[normal] left-[98px] not-italic text-[#3878c2] text-[12px] top-[605px] whitespace-nowrap">Remember Me</p>
      <RememberMeCheckButton />
    </div>
  );
}

function Guest() {
  return (
    <div className="absolute contents left-[45px] top-[664px]" data-name="Guest">
      <div className="absolute bg-gradient-to-r from-[#20a9ea] h-[47px] left-[45px] rounded-[30px] to-[#006c9f] top-[664px] via-[#118cc6] via-[69.712%] w-[352px]" />
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Poppins:SemiBold',sans-serif] h-[43px] justify-center leading-[0] left-[220.5px] not-italic text-[16px] text-center text-white top-[689.5px] tracking-[0.8px] w-[293px]">
        <p className="leading-[50px]">Log in as Administrator</p>
      </div>
    </div>
  );
}

export default function LogInAdmin() {
  return (
    <div className="relative size-full" data-name="Log in (Admin)" style={{ backgroundImage: "linear-gradient(88.7631deg, rgb(143, 219, 255) 3.9489%, rgb(61, 173, 226) 99.513%)" }}>
      <Bg />
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Poppins:SemiBold',sans-serif] h-[43px] justify-center leading-[0] left-[220.5px] not-italic text-[#184e8d] text-[32px] text-center top-[415.5px] tracking-[1.6px] w-[293px]">
        <p className="leading-[50px]">Welcome Back!</p>
      </div>
      <Logo />
      <CredentialField />
      <Guest />
    </div>
  );
}