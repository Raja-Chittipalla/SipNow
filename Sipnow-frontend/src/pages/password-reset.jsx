import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

function readStored(key) {
  try {
    return JSON.parse(window.localStorage.getItem(key));
  } catch {
    return null;
  }
}

export default function PasswordReset() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const method = searchParams.get("method");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [errors, setErrors] = useState({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [validationTime] = useState(() => Date.now());

  const request = readStored("sipnow-password-reset");
  const user = readStored("sipnow-user");
  const isEmailRequest =
    request?.channel === "email" && request.token === token;
  const isMobileRequest = request?.channel === "mobile" && method === "mobile";
  const isValidRequest = Boolean(
    (isEmailRequest || isMobileRequest) &&
    request?.expiresAt > validationTime &&
    user?.email === request?.email
  );

  const handleMobileVerification = (event) => {
    event.preventDefault();
    if (otp.length !== 6) {
      setOtpError("Enter the 6-digit verification code.");
      return;
    }
    if (otp !== request?.code) {
      setOtpError("That verification code is invalid. Please try again.");
      return;
    }
    setOtpError("");
    setMobileVerified(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!PASSWORD_PATTERN.test(password)) {
      nextErrors.password =
        "Use 8+ characters with uppercase, lowercase, a number and a special character.";
    }
    if (!confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your new password.";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    if (!isValidRequest || (isMobileRequest && !mobileVerified)) return;

    window.localStorage.setItem(
      "sipnow-user",
      JSON.stringify({ ...user, password })
    );
    window.localStorage.removeItem("sipnow-password-reset");
    window.localStorage.removeItem("sipnow-session");
    window.localStorage.setItem(
      "sipnow-auth-notice",
      "Your password has been reset. You can now sign in."
    );
    navigate("/login");
  };

  if (!isValidRequest) {
    return (
      <div className="min-h-screen bg-[#09080a] px-5 py-10 text-white sm:py-16">
        <main className="mx-auto my-10 w-full max-w-xl rounded-[2rem] border border-primary/30 bg-[#100e11] p-8 text-center shadow-3xl shadow-black/50 sm:p-14">
          <span className="material-symbols-outlined text-5xl text-red-400">
            link_off
          </span>
          <h1 className="mt-5 font-headline-md text-3xl text-primary">
            This reset request is invalid
          </h1>
          <p className="mt-4 text-gray-400">
            Request a new password-reset link or verification code and try
            again.
          </p>
          <button
            className="mt-8 rounded-full px-7 py-3 font-bold text-white primary-gradient"
            onClick={() => navigate("/forgot-password")}
            type="button"
          >
            Request a new reset
          </button>
        </main>
      </div>
    );
  }

  if (isMobileRequest && !mobileVerified) {
    return (
      <div className="min-h-screen bg-[#09080a] px-5 py-10 text-white sm:py-16">
        <main className="mx-auto my-10 w-full max-w-xl rounded-[2rem] border border-primary/30 bg-[#100e11] p-8 shadow-3xl shadow-black/50 sm:p-14">
          <span className="material-symbols-outlined text-4xl text-primary">
            phonelink_lock
          </span>
          <h1 className="mt-5 font-headline-md text-4xl text-primary sm:text-5xl">
            Verify your mobile
          </h1>
          <p className="mt-5 leading-7 text-gray-400">
            Enter the six-digit code sent to +61 {request.mobile} before
            resetting your password.
          </p>
          <form
            className="mt-10 space-y-5"
            noValidate
            onSubmit={handleMobileVerification}
          >
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-200">
                Verification code <span className="text-red-500">*</span>
              </span>
              <input
                autoComplete="one-time-code"
                className={`w-full rounded-xl border bg-[#1a171c] px-4 py-3.5 text-white placeholder:text-gray-500 focus:ring-0 ${otpError ? "border-red-500" : "border-primary/20"}`}
                inputMode="numeric"
                maxLength={6}
                onChange={(event) => {
                  setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));
                  if (otpError) setOtpError("");
                }}
                placeholder="Enter 6-digit code"
                value={otp}
              />
              {otpError && (
                <span className="mt-1 block text-xs text-red-400">
                  {otpError}
                </span>
              )}
            </label>
            <button
              className="w-full rounded-full py-4 font-bold text-white primary-gradient"
              type="submit"
            >
              Verify code
            </button>
          </form>
        </main>
      </div>
    );
  }

  const fields = [
    {
      label: "New password",
      name: "password",
      value: password,
      setValue: setPassword,
    },
    {
      label: "Confirm new password",
      name: "confirmPassword",
      value: confirmPassword,
      setValue: setConfirmPassword,
    },
  ];

  return (
    <div className="min-h-screen bg-[#09080a] px-5 py-10 text-white sm:py-16">
      <main className="mx-auto my-10 w-full max-w-xl rounded-[2rem] border border-primary/30 bg-[#100e11] p-8 shadow-3xl shadow-black/50 sm:p-14">
        <span className="material-symbols-outlined text-4xl text-primary">
          password
        </span>
        <h1 className="mt-5 font-headline-md text-4xl text-primary sm:text-5xl">
          Choose a new password
        </h1>
        <p className="mt-5 leading-7 text-gray-400">
          Make it at least 8 characters long and include uppercase, lowercase, a
          number, and a special character.
        </p>
        <form className="mt-10 space-y-5" noValidate onSubmit={handleSubmit}>
          {fields.map((field) => (
            <label className="block" key={field.name}>
              <span className="mb-2 block text-sm font-medium text-gray-200">
                {field.label} <span className="text-red-500">*</span>
              </span>
              <span
                className={`flex items-center overflow-hidden rounded-xl border bg-[#1a171c] ${errors[field.name] ? "border-red-500" : "border-primary/20"}`}
              >
                <span className="material-symbols-outlined px-4 text-[19px] text-primary">
                  lock
                </span>
                <input
                  autoComplete="new-password"
                  className="min-w-0 flex-1 border-0 bg-transparent px-3 py-3.5 text-white placeholder:text-gray-500 focus:ring-0"
                  name={field.name}
                  onChange={(event) => {
                    field.setValue(event.target.value);
                    if (errors[field.name])
                      setErrors((current) => ({
                        ...current,
                        [field.name]: "",
                      }));
                  }}
                  placeholder={field.label}
                  type={isPasswordVisible ? "text" : "password"}
                  value={field.value}
                />
                <button
                  aria-label={`${isPasswordVisible ? "Hide" : "Show"} password`}
                  className="material-symbols-outlined px-4 text-[20px] text-primary"
                  onClick={() => setIsPasswordVisible((visible) => !visible)}
                  type="button"
                >
                  {isPasswordVisible ? "visibility_off" : "visibility"}
                </button>
              </span>
              {errors[field.name] && (
                <span className="mt-1 block text-xs text-red-400">
                  {errors[field.name]}
                </span>
              )}
            </label>
          ))}
          <button
            className="w-full rounded-full py-4 font-bold text-white primary-gradient"
            type="submit"
          >
            Reset password
          </button>
        </form>
      </main>
    </div>
  );
}
