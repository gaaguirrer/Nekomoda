import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import CatLogo from "@/components/CatLogo";
import { getFirebaseAuth } from "@/infrastructure/firebase/firebaseClient";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      const auth = getFirebaseAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const { uid, email, displayName, photoURL } = result.user;

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, email, displayName, photoURL }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      localStorage.setItem("moda_user_id", data.user.uid);
      localStorage.setItem("moda_user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al iniciar con Google";
      if (msg.includes("popup-closed")) return;
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-sand-bg flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-label-caps text-on-surface-variant hover:text-ink-black transition-colors mb-8">
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Volver
        </Link>

        <div className="text-center mb-8">
          <Link href="/" className="flex items-center justify-center gap-2">
            <CatLogo size={40} />
            <span className="text-[48px] font-semibold tracking-tight text-ink-black">NEKOMODA</span>
          </Link>
          <p className="text-body-lg text-on-surface-variant mt-4">Inicia sesión en tu cuenta</p>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full py-4 border border-outline-variant text-ink-black text-label-caps uppercase tracking-widest hover:bg-surface-container-low transition-colors flex items-center justify-center gap-3 mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.54 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 0 0 0 24c0 3.77.87 7.35 2.56 10.56l7.98-5.97z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 5.97C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continuar con Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-outline-variant" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-sand-bg px-4 text-label-caps text-on-surface-variant">O CONTINÚA CON EMAIL</span>
          </div>
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
