import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import Logo from "./Logo";

export default function LoginModal({ show, onLoggedIn, onGuest, guestMinutes = 15, guestExpired = false }) {
  const [isLogin, setIsLogin] = useState(true);
  // After a successful signup, open Login with the email filled in
  const [signedUpEmail, setSignedUpEmail] = useState("");

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-ink/50 backdrop-blur-[2px] flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white p-6 md:p-7 rounded-3xl w-full max-w-sm shadow-xl">
        <Logo />
        <h2 className="mt-5 font-display text-3xl text-ink">
          {isLogin ? "Welcome back" : "Create your account"}
        </h2>
        <p className="mt-1 mb-5 text-sm text-stone-warm">
          {isLogin ? "Log in to order and keep your history." : "It takes less than a minute."}
        </p>

        {guestExpired && (
          <p className="mb-4 rounded-xl bg-paprika-50 border border-paprika-200 p-3 text-sm text-paprika-800">
            Your {guestMinutes}-minute guest preview has ended. Log in or sign up to keep going.
          </p>
        )}

        {isLogin ? (
          <LoginForm
            key={signedUpEmail}
            onSuccess={onLoggedIn}
            initialEmail={signedUpEmail}
            notice={signedUpEmail ? "Account created! Please log in." : ""}
          />
        ) : (
          <SignupForm
            onSuccess={(email) => {
              setSignedUpEmail(email);
              setIsLogin(true);
            }}
            onSwitchToLogin={() => setIsLogin(true)}
          />
        )}

        <button
          className="mt-4 text-paprika-700 font-semibold text-sm"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Create an account" : "Already have an account?"}
        </button>

        {/* For visitors (e.g. recruiters) who just want to look around */}
        <div className="mt-5 border-t border-line pt-4">
          <button
            type="button"
            onClick={onGuest}
            className="w-full rounded-xl border border-line py-2.5 text-sm font-semibold text-ink hover:bg-cream"
          >
            Continue as guest ({guestMinutes} min)
          </button>
          <p className="mt-1.5 text-center text-xs text-stone-warm">
            Browse without an account. Login is needed for reviews.
          </p>
        </div>
      </div>
    </div>
  );
}
