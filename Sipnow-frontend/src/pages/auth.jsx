import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AUSTRALIAN_MOBILE_PATTERN,
  NAME_PART_PATTERN,
  PASSWORD_PATTERN,
} from "../utils/validation.js";
import { validateEmail } from "../utils/emailValidation.js";
import PageHero from "../components/PageHero.jsx";

const DEMO_OTP = "123456";
const EMAIL_VERIFICATION_TTL = 10 * 60 * 1000;
const MOBILE_VERIFICATION_TTL = 10 * 60 * 1000;

function readStored(key, fallback = null) {
  try {
    return JSON.parse(window.localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function takeAuthNotice() {
  const notice = window.localStorage.getItem("sipnow-auth-notice");
  const error = window.localStorage.getItem("sipnow-auth-error");
  window.localStorage.removeItem("sipnow-auth-notice");
  window.localStorage.removeItem("sipnow-auth-error");
  if (error) return { tone: "error", text: error };
  return notice ? { tone: "success", text: notice } : null;
}

function createDemoToken() {
  return window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

function Field({
  error,
  icon,
  label,
  prefix,
  required = false,
  type = "text",
  ...inputProps
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordField = type === "password";

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-200">
        {label}
        {required && (
          <span className="ml-1 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </span>
      <span
        className={`flex items-center overflow-hidden rounded-xl border bg-[#1a171c] ${
          error ? "border-red-500" : "border-primary/20"
        }`}
      >
        <span className="material-symbols-outlined px-4 text-[19px] text-primary">
          {icon}
        </span>
        {prefix && (
          <span className="border-r border-primary/20 px-3 py-3.5 text-sm font-medium text-on-surface-variant">
            {prefix}
          </span>
        )}
        <input
          className="min-w-0 flex-1 border-0 bg-transparent px-3 py-3.5 text-white placeholder:text-gray-500 focus:ring-0"
          aria-invalid={Boolean(error)}
          aria-required={required}
          {...inputProps}
          type={isPasswordField && isPasswordVisible ? "text" : type}
        />
        {isPasswordField && (
          <button
            aria-label={`${isPasswordVisible ? "Hide" : "Show"} ${label}`}
            className="material-symbols-outlined px-4 text-[20px] text-primary transition-colors hover:text-primary-fixed-dim focus-visible:outline-none"
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            type="button"
          >
            {isPasswordVisible ? "visibility_off" : "visibility"}
          </button>
        )}
      </span>
      {error && (
        <span className="mt-1 block text-xs text-red-400">{error}</span>
      )}
    </label>
  );
}

function PasswordRequirements({ password }) {
  const requirements = [
    ["At least 8 characters", password.length >= 8],
    ["One uppercase letter", /[A-Z]/.test(password)],
    ["One lowercase letter", /[a-z]/.test(password)],
    ["One number", /\d/.test(password)],
    ["One special character", /[^A-Za-z\d]/.test(password)],
  ];

  return (
    <ul
      aria-label="Password requirements"
      className="-mt-1 space-y-1.5 text-xs"
    >
      {requirements.map(([label, met]) => (
        <li
          className={`flex items-center gap-2 ${
            met ? "text-green-400" : "text-gray-400"
          }`}
          key={label}
        >
          <span className="material-symbols-outlined text-[16px]">
            {met ? "check_circle" : "radio_button_unchecked"}
          </span>
          {label}
        </li>
      ))}
    </ul>
  );
}

function VerificationCountdown({ expiresAt, label = "Verification" }) {
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const remainingSeconds = Math.max(
    0,
    Math.ceil((expiresAt - currentTime) / 1000)
  );
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = String(remainingSeconds % 60).padStart(2, "0");

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <p
      className={`text-xs ${
        remainingSeconds ? "text-on-surface-variant" : "text-red-400"
      }`}
      role="status"
    >
      {remainingSeconds
        ? `${label} expires in ${minutes}:${seconds}.`
        : `${label} has expired. Request a new one to continue.`}
    </p>
  );
}

export default function Auth({ mode, onAuthenticated, onSwitch }) {
  const isSignup = mode === "signup";
  const navigate = useNavigate();
  const location = useLocation();
  const signupToken = new URLSearchParams(location.search).get("signupToken");
  const [isRestartingSignup, setIsRestartingSignup] = useState(false);
  const [demoSignupLink, setDemoSignupLink] = useState(() => {
    const request = readStored("sipnow-signup-email-link");
    return request?.token && request?.expiresAt > Date.now()
      ? `/signup?signupToken=${encodeURIComponent(request.token)}`
      : "";
  });
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
    termsAccepted: false,
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(() => {
    return takeAuthNotice();
  });
  const routeError = location.state?.authError;
  const routeNotice = location.state?.authNotice;
  const pendingSignup =
    isSignup && !isRestartingSignup
      ? readStored("sipnow-pending-signup")
      : null;
  const signupStage = pendingSignup?.emailVerified
    ? "mobile"
    : pendingSignup
      ? "email"
      : "form";
  const visibleMessage =
    message ??
    (routeNotice ? { tone: "success", text: routeNotice } : null) ??
    (routeError ? { tone: "error", text: routeError } : null);
  const signupEmailRequest = isSignup
    ? readStored("sipnow-signup-email-link")
    : null;
  const signupMobileRequest = isSignup
    ? readStored("sipnow-signup-mobile-otp")
    : null;

  const updateValue = (event) => {
    const { name, value, type, checked } = event.target;
    let nextValue = value;

    if (name === "firstName" || name === "lastName") {
      nextValue = value.replace(/[^A-Za-z '-]/g, "");
    }
    if (name === "mobile") nextValue = value.replace(/\D/g, "").slice(0, 9);
    if (name === "otp") nextValue = value.replace(/\D/g, "").slice(0, 6);

    setValues((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : nextValue,
    }));

    if (errors[name]) {
      setErrors((current) => {
        const nextErrors = { ...current };
        delete nextErrors[name];
        return nextErrors;
      });
    }
    if (message) setMessage(null);
  };

  // This is a local demo of an email-verification callback. The pending
  // customer record is deliberately separate from `sipnow-user`, so no user
  // is created until both the email link and mobile code have been verified.
  useEffect(() => {
    if (!isSignup || !signupToken) return;

    const request = readStored("sipnow-signup-email-link");
    const pendingSignup = readStored("sipnow-pending-signup");
    const isValid =
      request?.token === signupToken &&
      request?.expiresAt > Date.now() &&
      pendingSignup?.email === request.email &&
      !validateEmail(pendingSignup?.email);

    if (!isValid) {
      navigate("/signup", {
        replace: true,
        state: {
          authError:
            "This email-verification link is invalid or has expired. Please request a new one.",
        },
      });
      return;
    }

    const verifiedSignup = { ...pendingSignup, emailVerified: true };
    window.localStorage.setItem(
      "sipnow-pending-signup",
      JSON.stringify(verifiedSignup)
    );
    window.localStorage.removeItem("sipnow-signup-email-link");
    window.localStorage.setItem(
      "sipnow-signup-mobile-otp",
      JSON.stringify({
        mobile: verifiedSignup.mobile,
        code: DEMO_OTP,
        expiresAt: Date.now() + MOBILE_VERIFICATION_TTL,
      })
    );
    // Carry the notice through the redirect instead of setting React state
    // synchronously from this route-synchronization effect. `signupStage`
    // and `demoSignupLink`'s "email" banner both derive from the localStorage
    // writes above, so they update on the next render without local setState.
    navigate("/signup", {
      replace: true,
      state: {
        authNotice: `Email verified. A verification code was sent to +61 ${verifiedSignup.mobile}. For this demo, use ${DEMO_OTP}.`,
      },
    });
  }, [isSignup, navigate, signupToken]);

  const focusFirstError = (nextErrors, order) => {
    setErrors(nextErrors);
    const firstInvalidField = order.find((field) => nextErrors[field]);
    if (!firstInvalidField) return false;

    requestAnimationFrame(() => {
      const input = document.querySelector(`[name="${firstInvalidField}"]`);
      input?.scrollIntoView({ behavior: "smooth", block: "center" });
      input?.focus({ preventScroll: true });
    });
    return true;
  };

  const authenticateUser = (user) => {
    window.localStorage.setItem("sipnow-session", JSON.stringify(user));
    onAuthenticated(user);
  };

  const sendSignupEmailVerification = (pendingSignup) => {
    const emailError = validateEmail(pendingSignup?.email);
    if (emailError) {
      setErrors((current) => ({ ...current, email: emailError }));
      return;
    }
    const token = createDemoToken();
    const verificationUrl = `/signup?signupToken=${encodeURIComponent(token)}`;
    window.localStorage.setItem(
      "sipnow-signup-email-link",
      JSON.stringify({
        email: pendingSignup.email,
        token,
        expiresAt: Date.now() + EMAIL_VERIFICATION_TTL,
      })
    );
    setDemoSignupLink(verificationUrl);
    setMessage({
      tone: "success",
      text: "We sent an email verification link. Verify your email before we create your SipNow account.",
    });
  };

  const resendSignupMobileVerification = () => {
    const pendingSignup = readStored("sipnow-pending-signup");
    if (!pendingSignup?.emailVerified) return;

    window.localStorage.setItem(
      "sipnow-signup-mobile-otp",
      JSON.stringify({
        mobile: pendingSignup.mobile,
        code: DEMO_OTP,
        expiresAt: Date.now() + MOBILE_VERIFICATION_TTL,
      })
    );
    setValues((current) => ({ ...current, otp: "" }));
    setMessage({
      tone: "success",
      text: `A new verification code was sent to +61 ${pendingSignup.mobile}. For this demo, use ${DEMO_OTP}.`,
    });
  };

  const changeSignupMobileNumber = () => {
    window.localStorage.removeItem("sipnow-pending-signup");
    window.localStorage.removeItem("sipnow-signup-email-link");
    window.localStorage.removeItem("sipnow-signup-mobile-otp");
    setIsRestartingSignup(true);
    setDemoSignupLink("");
    setValues((current) => ({ ...current, otp: "" }));
    setErrors({});
    setMessage({
      tone: "success",
      text: "Update your mobile number, then send a new verification email to restart signup.",
    });
  };

  const handleSignup = () => {
    setIsRestartingSignup(false);
    const nextErrors = {};
    if (!NAME_PART_PATTERN.test(values.firstName.trim())) {
      nextErrors.firstName = "Enter a valid first name.";
    }
    if (!NAME_PART_PATTERN.test(values.lastName.trim())) {
      nextErrors.lastName = "Enter a valid last name.";
    }
    if (!AUSTRALIAN_MOBILE_PATTERN.test(values.mobile)) {
      nextErrors.mobile =
        "Enter a valid Australian mobile number beginning with 4.";
    }
    const emailError = validateEmail(values.email);
    if (emailError) {
      nextErrors.email = emailError;
    }
    if (!PASSWORD_PATTERN.test(values.password)) {
      nextErrors.password =
        "Use 8+ characters with uppercase, lowercase, a number and a special character.";
    }
    if (!values.confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (values.password !== values.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }
    if (!values.termsAccepted) {
      nextErrors.termsAccepted =
        "Please accept the Terms & Conditions and Privacy Policy.";
    }
    if (
      focusFirstError(nextErrors, [
        "firstName",
        "lastName",
        "mobile",
        "email",
        "password",
        "confirmPassword",
        "termsAccepted",
      ])
    ) {
      return;
    }

    const existingUser = readStored("sipnow-user");
    const email = values.email.trim().toLowerCase();
    if (
      existingUser?.email === email ||
      existingUser?.mobile === values.mobile
    ) {
      setMessage({
        tone: "error",
        text: "An account already exists with this email address or mobile number.",
      });
      return;
    }

    const pendingSignup = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      name: `${values.firstName.trim()} ${values.lastName.trim()}`,
      mobile: values.mobile,
      email,
      password: values.password,
      emailVerified: false,
      mobileVerified: false,
    };
    window.localStorage.setItem(
      "sipnow-pending-signup",
      JSON.stringify(pendingSignup)
    );
    sendSignupEmailVerification(pendingSignup);
  };

  const handleSignupMobileVerification = () => {
    const request = readStored("sipnow-signup-mobile-otp");
    const pendingSignup = readStored("sipnow-pending-signup");
    const nextErrors = {};
    if (values.otp.length !== 6) {
      nextErrors.otp = "Enter the 6-digit verification code.";
    }
    if (focusFirstError(nextErrors, ["otp"])) return;

    const isValid =
      pendingSignup?.emailVerified &&
      request?.code === values.otp &&
      request?.expiresAt > Date.now() &&
      request?.mobile === pendingSignup.mobile;
    if (!isValid) {
      setMessage({
        tone: "error",
        text: "That verification code is invalid or expired. Request a new code and try again.",
      });
      return;
    }

    const user = {
      ...pendingSignup,
      emailVerified: true,
      mobileVerified: true,
      addresses: [],
    };
    window.localStorage.setItem("sipnow-user", JSON.stringify(user));
    window.localStorage.removeItem("sipnow-pending-signup");
    window.localStorage.removeItem("sipnow-signup-mobile-otp");
    window.localStorage.removeItem("sipnow-signup-email-link");
    authenticateUser(user);
  };

  const handlePasswordLogin = () => {
    const nextErrors = {};
    const emailError = validateEmail(values.email);
    if (emailError) {
      nextErrors.email = emailError;
    }
    if (!values.password) nextErrors.password = "Password is required.";
    if (focusFirstError(nextErrors, ["email", "password"])) return;

    const user = readStored("sipnow-user");
    if (
      !user ||
      user.email !== values.email.trim().toLowerCase() ||
      user.password !== values.password
    ) {
      setMessage({
        tone: "error",
        text: "Your email or password is incorrect. Create an account if you are new to SipNow.",
      });
      return;
    }
    authenticateUser(user);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage(null);

    if (isSignup) {
      if (signupStage === "mobile") {
        handleSignupMobileVerification();
      } else if (signupStage === "email") {
        const pendingSignup = readStored("sipnow-pending-signup");
        if (pendingSignup) sendSignupEmailVerification(pendingSignup);
      } else {
        handleSignup();
      }
    } else {
      handlePasswordLogin();
    }
  };

  return (
    <div className="min-h-screen bg-[#09080a] px-5 pt-32 pb-10 text-white sm:pt-36 sm:pb-16">
      <PageHero onBack={() => navigate("/")} />
      <main className="mx-auto w-full max-w-xl rounded-[2rem] border border-primary/30 bg-[#100e11] p-8 text-white shadow-3xl shadow-black/50 sm:p-14">
        <h1
          className={`font-headline-md text-4xl sm:text-5xl ${isSignup ? "mt-7" : "text-primary"}`}
        >
          {isSignup ? "Create your account" : "Sign in to SipNow"}
        </h1>
        <p className="mt-5 text-gray-400">
          {isSignup
            ? "Create an account for faster checkout and saved favourites."
            : "Sign in securely using your email address and password."}
        </p>

        <form className="mt-8 space-y-5" noValidate onSubmit={handleSubmit}>
          {isSignup && signupStage === "form" && (
            <>
              {/* Separate name fields keep checkout and profile data easy to reuse. */}
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  autoComplete="given-name"
                  error={errors.firstName}
                  icon="person"
                  label="First name"
                  name="firstName"
                  onChange={updateValue}
                  placeholder="Enter first name"
                  required
                  value={values.firstName}
                />
                <Field
                  autoComplete="family-name"
                  error={errors.lastName}
                  icon="person"
                  label="Last name"
                  name="lastName"
                  onChange={updateValue}
                  placeholder="Enter last name"
                  required
                  value={values.lastName}
                />
              </div>
              <Field
                autoComplete="tel"
                error={errors.mobile}
                icon="phone"
                inputMode="numeric"
                label="Mobile number"
                maxLength={9}
                name="mobile"
                onChange={updateValue}
                placeholder="4XX XXX XXX"
                prefix="+61"
                required
                type="tel"
                value={values.mobile}
              />
              <Field
                autoComplete="email"
                error={errors.email}
                icon="mail"
                label="Email address"
                name="email"
                onChange={updateValue}
                placeholder="Enter your email address"
                required
                type="email"
                value={values.email}
              />
              <Field
                autoComplete="new-password"
                error={errors.password}
                icon="lock"
                label="Password"
                name="password"
                onChange={updateValue}
                placeholder="Create a password"
                required
                type="password"
                value={values.password}
              />
              <PasswordRequirements password={values.password} />
              <Field
                autoComplete="new-password"
                error={errors.confirmPassword}
                icon="lock"
                label="Confirm password"
                name="confirmPassword"
                onChange={updateValue}
                placeholder="Confirm password"
                required
                type="password"
                value={values.confirmPassword}
              />
              <div className="space-y-1">
                <div className="flex items-start gap-2.5 text-xs leading-5 text-gray-400">
                  <input
                    checked={values.termsAccepted}
                    className="mt-1 rounded border-primary/40 bg-[#1a171c] text-primary focus:ring-primary"
                    name="termsAccepted"
                    onChange={updateValue}
                    type="checkbox"
                  />
                  <span>
                    I agree to the{" "}
                    <Link
                      className="text-primary hover:underline"
                      to="/terms-conditions"
                    >
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      className="text-primary hover:underline"
                      to="/privacy-policy"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </div>
                {errors.termsAccepted && (
                  <p className="text-xs text-red-400">{errors.termsAccepted}</p>
                )}
              </div>
            </>
          )}

          {isSignup && signupStage === "email" && (
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-5 text-sm text-gray-200">
              <p className="font-semibold text-primary">Verify your email</p>
              <p className="mt-2 leading-6">
                We have sent a verification link to the email address you
                entered. Your account will be created only after you verify both
                your email and mobile number.
              </p>
              {signupEmailRequest?.expiresAt && (
                <div className="mt-3">
                  <VerificationCountdown
                    expiresAt={signupEmailRequest.expiresAt}
                    key={signupEmailRequest.expiresAt}
                    label="Email verification link"
                  />
                </div>
              )}
              <button
                className="mt-4 text-primary hover:underline"
                onClick={() => {
                  window.localStorage.removeItem("sipnow-pending-signup");
                  window.localStorage.removeItem("sipnow-signup-email-link");
                  setIsRestartingSignup(true);
                  setDemoSignupLink("");
                  setMessage(null);
                }}
                type="button"
              >
                Use a different email address
              </button>
            </div>
          )}

          {isSignup && signupStage === "mobile" && (
            <>
              <div className="rounded-xl border border-primary/30 bg-primary/10 p-5 text-sm text-gray-200">
                <p className="font-semibold text-primary">
                  Verify your mobile number
                </p>
                <p className="mt-2 leading-6">
                  Your email is verified. Enter the 6-digit code sent to your
                  mobile number to finish creating your account.
                </p>
                <p className="mt-2 text-primary">
                  For this demo, use {DEMO_OTP}.
                </p>
                {signupMobileRequest?.expiresAt && (
                  <div className="mt-3">
                    <VerificationCountdown
                      expiresAt={signupMobileRequest.expiresAt}
                      key={signupMobileRequest.expiresAt}
                      label="Mobile verification code"
                    />
                  </div>
                )}
              </div>
              <Field
                autoComplete="one-time-code"
                error={errors.otp}
                icon="password"
                inputMode="numeric"
                label="Verification code"
                maxLength={6}
                name="otp"
                onChange={updateValue}
                placeholder="Enter 6-digit code"
                required
                value={values.otp}
              />
              <button
                className="text-sm text-primary hover:underline"
                onClick={resendSignupMobileVerification}
                type="button"
              >
                Resend mobile verification code
              </button>
              <button
                className="ml-4 text-sm text-primary hover:underline"
                onClick={changeSignupMobileNumber}
                type="button"
              >
                Change mobile number
              </button>
            </>
          )}

          {!isSignup && (
            <>
              <Field
                autoComplete="email"
                error={errors.email}
                icon="mail"
                label="Email address"
                name="email"
                onChange={updateValue}
                placeholder="Enter your email address"
                required
                type="email"
                value={values.email}
              />
              <Field
                autoComplete="current-password"
                error={errors.password}
                icon="lock"
                label="Password"
                name="password"
                onChange={updateValue}
                placeholder="Enter your password"
                required
                type="password"
                value={values.password}
              />
              <div className="-mt-2 flex justify-end">
                <button
                  className="text-sm text-primary transition-colors hover:underline"
                  onClick={() => navigate("/forgot-password")}
                  type="button"
                >
                  Forgot password?
                </button>
              </div>
            </>
          )}

          {visibleMessage && (
            <div
              className={`rounded-xl border px-4 py-3 text-sm ${
                visibleMessage.tone === "success"
                  ? "border-green-500/30 bg-green-500/10 text-green-300"
                  : "border-red-500/30 bg-red-500/10 text-red-300"
              }`}
              role="status"
            >
              {visibleMessage.text}
            </div>
          )}

          {demoSignupLink && isSignup && signupStage === "email" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                className="rounded-full py-3 font-semibold text-white primary-gradient"
                onClick={() => navigate(demoSignupLink)}
                type="button"
              >
                Open demo verification link
              </button>
              <button
                className="rounded-full border border-primary/50 py-3 font-semibold text-primary transition-colors hover:bg-primary/10"
                onClick={() => {
                  const signup = readStored("sipnow-pending-signup");
                  if (signup) sendSignupEmailVerification(signup);
                }}
                type="button"
              >
                Resend email link
              </button>
            </div>
          )}

          {!(isSignup && signupStage === "email") && (
            <button
              className="w-full rounded-full py-4 font-bold text-white primary-gradient"
              type="submit"
            >
              {isSignup
                ? signupStage === "mobile"
                  ? "Verify mobile and create account"
                  : "Send verification email"
                : "Login"}
            </button>
          )}
        </form>

        <p className="mt-7 text-center text-sm text-gray-400">
          {isSignup ? "Already have an account?" : "New to SipNow?"}{" "}
          <button
            className="font-semibold text-primary hover:underline"
            onClick={() => onSwitch(isSignup ? "login" : "signup")}
            type="button"
          >
            {isSignup ? "Login" : "Create an account"}
          </button>
        </p>
      </main>
    </div>
  );
}
