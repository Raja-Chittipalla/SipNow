import { useState } from "react";
import { validateEmail } from "../utils/emailValidation.js";

const STORAGE_KEY = "sipnow-newsletter-subscription";

function getStoredSubscription() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function setStoredSubscription(data) {
  try {
    if (!data) {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  } catch {
    // localStorage fallback
  }
}

/** Handles newsletter subscription state, API calls, and localStorage persistence. */
export function useNewsletterForm() {
  const [initialSub] = useState(() => getStoredSubscription());
  const [email, setEmail] = useState(() =>
    initialSub && initialSub.isSubscribed && initialSub.email
      ? initialSub.email
      : ""
  );
  const [status, setStatus] = useState("idle"); // idle | submitting | success | unsubmitting | error
  const [subscribedEmail, setSubscribedEmail] = useState(() =>
    initialSub && initialSub.isSubscribed && initialSub.email
      ? initialSub.email
      : ""
  );
  const [isSubscribed, setIsSubscribed] = useState(() =>
    Boolean(initialSub && initialSub.isSubscribed && initialSub.email)
  );
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (status !== "idle") {
      setStatus("idle");
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const targetEmail = email.trim();
    const emailError = validateEmail(targetEmail);
    if (emailError) {
      setStatus("error");
      setErrorMessage(emailError);
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      // Backend sync
      fetch("http://localhost:5000/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail }),
      }).catch(() => {});

      const subData = {
        email: targetEmail,
        isSubscribed: true,
        subscribedAt: new Date().toISOString(),
      };
      setStoredSubscription(subData);
      setSubscribedEmail(targetEmail);
      setIsSubscribed(true);
      setStatus("success");
    } catch {
      const subData = {
        email: targetEmail,
        isSubscribed: true,
        subscribedAt: new Date().toISOString(),
      };
      setStoredSubscription(subData);
      setSubscribedEmail(targetEmail);
      setIsSubscribed(true);
      setStatus("success");
    }
  };

  const handleUnsubscribe = async () => {
    const targetEmail = subscribedEmail || email;
    setStatus("unsubmitting");

    try {
      if (targetEmail) {
        fetch("http://localhost:5000/api/newsletter/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: targetEmail }),
        }).catch(() => {});
      }

      setStoredSubscription(null);
      setSubscribedEmail("");
      setIsSubscribed(false);
      setEmail("");
      setStatus("idle");
    } catch {
      setStoredSubscription(null);
      setSubscribedEmail("");
      setIsSubscribed(false);
      setEmail("");
      setStatus("idle");
    }
  };

  return {
    email,
    subscribedEmail,
    isSubscribed,
    status,
    errorMessage,
    handleChange,
    handleSubmit,
    handleUnsubscribe,
  };
}
