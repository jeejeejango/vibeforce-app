import React from 'react';

interface LoginProps {
  onLogin: () => void;
  isLoading: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, isLoading }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-md p-8 bg-slate-900/90 border border-slate-700 rounded-2xl shadow-2xl text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-2">
            VibeForce
          </h1>
          <p className="text-slate-400">Unify your tasks and resources. Power your workflow.</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={onLogin}
            disabled={isLoading}
            className="w-full group relative flex items-center justify-center gap-3 px-6 py-4 bg-slate-100 hover:bg-white text-slate-900 font-semibold rounded-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02]"
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-slate-900"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <>
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-6 h-6"
                />
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <div className="text-xs text-slate-500 mt-6">
            <p>By continuing, you agree to enter the VibeForce ecosystem.</p>
            <p className="mt-1">Powered by Checkmate & Stash Integrations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
