export function getOrCreateUserId(): string {
  if (typeof window === "undefined") return "anonymous";
  let userId = localStorage.getItem("moda_user_id");
  if (!userId) {
    userId = crypto.randomUUID?.() ?? `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem("moda_user_id", userId);
  }
  return userId;
}
