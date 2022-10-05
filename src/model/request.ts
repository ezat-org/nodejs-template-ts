export enum AuthType {
  TOKEN = "TOKEN",
  API_KEY = "API_KEY"
}

export interface AuthUser {
  userId: string;
  role: string;
}

export interface AuthContext {
  type: AuthType;
  accountId: string;
  user?: AuthUser;
}
