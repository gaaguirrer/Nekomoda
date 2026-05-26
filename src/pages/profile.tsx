import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import CatLogo from "@/components/CatLogo";

export default function ProfilePage() {
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("moda_user");
    if (!stored) {
      router.replace("/login");
    }
  }, [router]);

  const userStr = typeof window !== "undefined" ? localStorage.getItem("moda_user") : null;
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user) {
    return (
      <div className="min-h-screen bg-sand-bg flex flex-col items-center justify-center px-5 text-center">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">person</span>
        <h1 className="text-headline-md mb-4">Inicia sesión para ver tu perfil</h1>
        <Link href="/login" className="px-8 py-4 bg-ink-black text-white text-label-caps uppercase tracking-widest">
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  return <ProfileContent user={user} />;
}

function ProfileContent({ user }: { user: { uid: string; email?: string; displayName?: string; photoURL?: string } }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("moda_user_id");
    localStorage.removeItem("moda_user");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-sand-bg">
      <header className="fixed top-0 w-full z-50 bg-sand-bg h-20">
        <div className="flex justify-between items-center w-full px-5 md:px-6 max-w-[1280px] mx-auto h-full">
          <button onClick={() => router.push("/dashboard")} className="flex items-center gap-2">
            <CatLogo size={28} />
            <span className="text-[36px] font-semibold tracking-tight text-ink-black">NEKOMODA</span>
          </button>
          <button onClick={handleLogout} className="text-label-caps text-on-surface-variant uppercase tracking-widest hover:text-ink-black">Salir</button>
        </div>
      </header>

      <main className="pt-24 pb-12 max-w-[680px] mx-auto px-5">
        <div className="flex items-center gap-6 mb-10">
          <div className="w-20 h-20 rounded-full bg-surface-container overflow-hidden">
            {user.photoURL ? (
              <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl">👤</div>
            )}
          </div>
          <div>
            <h1 className="text-headline-md mb-1">{user.displayName ?? "Usuario"}</h1>
            <p className="text-body-md text-on-surface-variant">{user.email}</p>
          </div>
          <div className="ml-auto flex gap-2">
            <button onClick={() => router.push("/feed")} className="px-4 py-2 border border-outline-variant text-label-caps uppercase tracking-widest hover:border-ink-black transition-colors">
              Feed
            </button>
            <button onClick={() => router.push("/outfit/new")} className="px-4 py-2 bg-ink-black text-white text-label-caps uppercase tracking-widest">
              + Outfit
            </button>
          </div>
        </div>

        <div className="border-b border-outline-variant mb-8">
          <span className="inline-block pb-4 text-label-caps uppercase tracking-widest border-b-2 border-ink-black">Mis Outfits</span>
        </div>

        <ProfileOutfits userId={user.uid} />
      </main>
    </div>
  );
}

function ProfileOutfits(_props: { userId: string }) {
  const router = useRouter();

  return (
    <div className="text-center py-16">
      <p className="text-body-md text-on-surface-variant mb-4">Crea y comparte tus outfits</p>
      <button onClick={() => router.push("/outfit/new")} className="px-6 py-3 bg-ink-black text-white text-label-caps uppercase tracking-widest">
        Crear Primer Outfit
      </button>
    </div>
  );
}
