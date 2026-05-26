export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface IAuthService {
  register(email: string, password: string, displayName: string): Promise<AuthUser>;
  login(email: string, password: string): Promise<AuthUser>;
  getCurrentUser(): Promise<AuthUser | null>;
  logout(): Promise<void>;
}
