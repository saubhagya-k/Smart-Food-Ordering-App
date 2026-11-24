import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

export default function LoginModal({ show, onLoggedIn, onGuest, guestMinutes = 15, guestExpired = false }) {
  const [isLogin, setIsLogin] = useState(true);
  // After a successful signup, open Login with the email filled in
  const [signedUpEmail, setSignedUpEmail] = useState("");

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center  z-[9999]">
      <div className="bg-white p-6 rounded-xl w-96">
        <h2 className="text-xl font-bold mb-4">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {guestExpired && (
          <p className="mb-4 rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
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
          className="mt-4 text-blue-600 text-sm"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Create an account" : "Already have an account?"}
        </button>

        {/* For visitors (e.g. recruiters) who just want to look around */}
        <div className="mt-5 border-t pt-4">
          <button
            type="button"
            onClick={onGuest}
            className="w-full rounded border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Continue as guest ({guestMinutes} min)
          </button>
          <p className="mt-1 text-center text-xs text-gray-500">
            Browse without an account. Login is needed for reviews.
          </p>
        </div>
      </div>
    </div>
  );
}
