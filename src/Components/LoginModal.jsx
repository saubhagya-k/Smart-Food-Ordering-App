import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

export default function LoginModal({ show, onClose }) {
  const [isLogin, setIsLogin] = useState(true);

  if (!show) return null;
  console.log("LOGIN MODAL RENDERED", show);




  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center  z-[9999]">
      <div className="bg-white p-6 rounded-xl w-96">
        <h2 className="text-xl font-bold mb-4">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {isLogin ? (
          <LoginForm onSuccess={onClose} />
        ) : (
          <SignupForm onSuccess={onClose} />
        )}

       

        <button
          className="mt-4 text-blue-600 text-sm"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Create an account" : "Already have an account?"}
        </button>
      </div>
     

    </div>
    
  );
}
