import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { loginService } from "@/axios/request";
import { useAuthStore } from "@/store/useAuthStore";

const Login = () => {
  const navigate = useNavigate();
  const { setLogin, isAuthenticated } = useAuthStore((state) => state);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/reports");
    }
  }, [isAuthenticated, navigate]);

  const [values, setValues] = useState({
    accountId: "",
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { data, error: apiError } = await loginService(
      {
        username: values.username,
        password: values.password,
      },
      values.accountId,
    );

    if (apiError || !data) {
      setError("Credenciales inválidas o error de conexión.");
      setIsLoading(false);
      return;
    }

    setLogin(data, values.accountId);
    setIsLoading(false);
    navigate("/reports");
  };
  return (
    <div className="w-full min-h-screen relative bg-[#F7F5F3] overflow-hidden flex items-center justify-center">
      {/* Orange/amber radial gradient effect behind - like original dashboard */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] z-0 pointer-events-none" />

      {/* Secondary warm glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0, 32, 96, 0.25) 0%, rgba(0, 32, 96, 0.15) 40%, transparent 70%)",
        }}
      />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-[420px] mx-4 my-3">
        {/* Card with animated border effect */}
        <div className="relative group">
          {/* Animated border lines - similar to button effect */}

          {/* Main card */}
          <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0px_4px_24px_rgba(55,50,47,0.08)] border border-[rgba(55,50,47,0.12)] p-8 sm:p-10">
            {/* Inner glow lines */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-linear-to-r from-transparent via-white to-transparent" />
            </div>

            {/* Logo */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-medium text-[#2F3037]">
                ADO Technologies
              </h1>
              <p className="text-[#605A57] text-sm mt-2">
                Bienvenido. Inicia sesión para continuar.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-[#37322F]"
                >
                  Id Cuenta
                </label>
                <Input
                  id="accountId"
                  type="text"
                  placeholder="Ingrese su id de cuenta"
                  value={values.accountId}
                  onChange={(e) =>
                    setValues({ ...values, accountId: e.target.value })
                  }
                  className="h-11 bg-[#F7F5F3] border-[rgba(55,50,47,0.12)] rounded-lg focus:border-[#37322F] focus:ring-[#37322F]/20 transition-all duration-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-[#37322F]"
                >
                  Número de Cédula
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Ingrese su número de cédula"
                  value={values.username}
                  onChange={(e) =>
                    setValues({ ...values, username: e.target.value })
                  }
                  className="h-11 bg-[#F7F5F3] border-[rgba(55,50,47,0.12)] rounded-lg focus:border-[#37322F] focus:ring-[#37322F]/20 transition-all duration-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-[#37322F]"
                  >
                    Password
                  </label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Ingrese su contraseña"
                  value={values.password}
                  onChange={(e) =>
                    setValues({ ...values, password: e.target.value })
                  }
                  className="h-11 bg-[#F7F5F3] border-[rgba(55,50,47,0.12)] rounded-lg focus:border-[#37322F] focus:ring-[#37322F]/20 transition-all duration-200"
                  required
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center font-medium">
                  {error}
                </p>
              )}

              {/* Submit Button with line effect */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 relative font-medium text-sm shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] overflow-hidden transition-all duration-300"
                >
                  {/* Button gradient overlay */}
                  <div className="absolute left-0 top-0 w-44 h-full bg-linear-to-r from-[rgba(255,255,255,0)] to-[rgba(0,0,0,0.10)] mix-blend-multiply" />
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Iniciando sesión...</span>
                    </div>
                  ) : (
                    "Iniciar sesión"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
