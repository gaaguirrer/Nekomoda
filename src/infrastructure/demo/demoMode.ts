export const DEMO_USER = {
  uid: "demo_user",
  email: "demo@nekomoda.app",
  displayName: "Demo Nekoda",
  photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
};

export const DEMO_USER_ID = "demo_user";

export function isDemoMode(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("nekomoda_demo") === "true";
}

export function enterDemoMode(): void {
  localStorage.setItem("nekomoda_demo", "true");
  localStorage.setItem("moda_user_id", DEMO_USER_ID);
  localStorage.setItem("moda_user", JSON.stringify(DEMO_USER));
}

export function exitDemoMode(): void {
  localStorage.removeItem("nekomoda_demo");
  localStorage.removeItem("moda_user_id");
  localStorage.removeItem("moda_user");
}

export function getUserId(): string {
  if (typeof window === "undefined") return "anonymous";
  const demo = localStorage.getItem("nekomoda_demo");
  if (demo === "true") return DEMO_USER_ID;
  return localStorage.getItem("moda_user_id") || "anonymous";
}
