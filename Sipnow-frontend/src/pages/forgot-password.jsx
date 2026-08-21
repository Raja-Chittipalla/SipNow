import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../utils/emailValidation.js";

const MOBILE_PATTERN = /^4\d{8}$/;
const DEMO_OTP = "123456";

function readUser() {
  try {
    return JSON.parse(window.localStorage.getItem("sipnow-user"));
  } catch {
    return null;
  }
}

function normalizeMobile(value) {
  return String(value ?? "")
    .replace(/\D/g, "")
    .replace(/^61/, "")
    .replace(/^0/, "")
    .slice(0, 9);
}

function createDemoToken() {
  return window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [method, setMethod] = useState("email");
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [request, setRequest] = useState(null);

  const updateMethod = (nextMethod) => {
    setMethod(nextMethod);
    setIdentifier("");
    setError("");
    setRequest(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const user = readUser();
    const email = identifier.trim().toLowerCase();
    const mobile = normalizeMobile(identifier);

    const emailError = method === "email" ? validateEmail(email) : "";
    if (emailError || (method === "mobile" && !MOBILE_PATTERN.test(mobile))) {
      setError(
        method === "email"
          ? emailError
          : "Enter a valid Australian mobile number beginning with 4."
      );
      return;
    }

    const isKnownUser =
      user &&
      (method === "email"
        ? user.email === email
        : normalizeMobile(user.mobile) === mobile);
    if (!isKnownUser) {
      setError("We couldn't find an account for those details.");
      return;
    }

    const resetRequest = {
      channel: method,
      email: user.email,
      mobile: normalizeMobile(user.mobile),
      expiresAt: Date.now() + 15 * 60 * 1000,
    };
    if (method === "email") {
      const token = createDemoToken();
      resetRequest.token = token;
      resetRequest.link = `/reset-password?token=${encodeURIComponent(token)}`;
    } else {
      resetRequest.code = DEMO_OTP;
      resetRequest.link = "/reset-password?method=mobile";
    }

    window.localStorage.setItem(
      "sipnow-password-reset",
      JSON.stringify(resetRequest)
    );
    setError("");
    setRequest(resetRequest);
  };

  return (
    <div className="min-h-screen bg-[#09080a] px-5 py-10 text-white sm:py-16">
      <main className="mx-auto my-10 w-full max-w-xl rounded-[2rem] border border-primary/30 bg-[#100e11] p-8 shadow-3xl shadow-black/50 sm:p-14">
        <span className="material-symbols-outlined text-4xl text-primary">
          lock_reset
        </span>
        <h1 className="mt-5 font-headline-md text-4xl text-primary sm:text-5xl">
          Reset your password
        </h1>
        <p className="mt-5 leading-7 text-gray-400">
          Verify your account by email or mobile before choosing a new password.
        </p>

        <div className="mt-8 grid grid-cols-2 rounded-xl border border-primary/20 bg-[#1a171c] p-1 text-sm">
          <button
            className={`rounded-lg px-3 py-2.5 transition-colors ${method === "email" ? "bg-primary text-white" : "text-gray-400 hover:text-white"}`}
            onClick={() => updateMethod("email")}
            type="button"
          >
            Email link
          </button>
          <button
            className={`rounded-lg px-3 py-2.5 transition-colors ${method === "mobile" ? "bg-primary text-white" : "text-gray-400 hover:text-white"}`}
            onClick={() => updateMethod("mobile")}
            type="button"
          >
            Mobile code
          </button>
        </div>

        <form className="mt-8 space-y-5" noValidate onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-200">
              {method === "email" ? "Email address" : "Mobile number"}{" "}
              <span className="text-red-500">*</span>
            </span>
            <span
              className={`flex items-center overflow-hidden rounded-xl border bg-[#1a171c] ${error ? "border-red-500" : "border-primary/20"}`}
            >
              <span className="material-symbols-outlined px-4 text-[19px] text-primary">
                {method === "email" ? "mail" : "phone"}
              </span>
              {method === "mobile" && (
                <span className="border-r border-primary/20 px-3 py-3.5 text-sm font-medium text-on-surface-variant">
                  +61
                </span>
              )}
              <input
                autoComplete={method === "email" ? "email" : "tel"}
                className="min-w-0 flex-1 border-0 bg-transparent px-3 py-3.5 text-white placeholder:text-gray-500 focus:ring-0"
                inputMode={method === "mobile" ? "numeric" : undefined}
                maxLength={method === "mobile" ? 9 : undefined}
                name="identifier"
                onChange={(event) => {
                  setIdentifier(
                    method === "mobile"
                      ? normalizeMobile(event.target.value)
                      : event.target.value
                  );
                  if (error) setError("");
                }}
                placeholder={
                  method === "email"
                    ? "Enter your email address"
                    : "4XX XXX XXX"
                }
                type={method === "email" ? "email" : "tel"}
                value={identifier}
              />
            </span>
            {error && (
              <span className="mt-1 block text-xs text-red-400">{error}</span>
            )}
          </label>

          {request && (
            <div
              className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-4 text-sm text-green-300"
              role="status"
            >
              {request.channel === "email" ? (
                <>
                  <p>
                    Your password-reset email link is ready and expires in 15
                    minutes.
                  </p>
                  <button
                    className="mt-3 font-semibold text-primary underline underline-offset-4"
                    onClick={() => navigate(request.link)}
                    type="button"
                  >
                    Open demo reset link
                  </button>
                </>
              ) : (
                <>
                  <p>
                    A verification code was sent to +61 {request.mobile}. For
                    this demo, use {DEMO_OTP}.
                  </p>
                  <button
                    className="mt-3 font-semibold text-primary underline underline-offset-4"
                    onClick={() => navigate(request.link)}
                    type="button"
                  >
                    Enter verification code
                  </button>
                </>
              )}
            </div>
          )}

          <button
            className="w-full rounded-full py-4 font-bold text-white primary-gradient"
            type="submit"
          >
            {method === "email" ? "Send reset link" : "Send verification code"}
          </button>
        </form>

        <button
          className="mt-7 text-sm font-semibold text-primary hover:underline"
          onClick={() => navigate("/login")}
          type="button"
        >
          Back to login
        </button>
      </main>
    </div>
  );
}
