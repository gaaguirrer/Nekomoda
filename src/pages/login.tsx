import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      localStorage.setItem("moda_user_id", data.user.uid);
      localStorage.setItem("moda_user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-bg flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <Link href="/" className="text-[48px] font-semibold tracking-tight text-ink-black">MODA</Link>
          <p className="text-body-lg text-on-surface-variant mt-4">Inicia sesión en tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-error-container border border-error rounded-lg text-error text-body-md">{error}</div>
          )}

          <div>
            <label className="text-label-caps uppercase tracking-widest text-on-surface-variant block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-4 bg-surface-container-lowest border border-outline-variant text-ink-black focus:border-ink-black focus:outline-none transition-colors text-body-md"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label className="text-label-caps uppercase tracking-widest text-on-surface-variant block mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-4 bg-surface-container-lowest border border-outline-variant text-ink-black focus:border-ink-black focus:outline-none transition-colors text-body-md"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-ink-black text-surface-bright text-label-caps uppercase tracking-widest disabled:opacity-30 hover:bg-on-primary-fixed-variant transition-colors"
          >
            {loading ? "Entrando..." : "Iniciar Sesión"}
          </button>
        </form>

        <p className="text-center text-body-md text-on-surface-variant mt-8">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-ink-black underline hover:text-secondary">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
