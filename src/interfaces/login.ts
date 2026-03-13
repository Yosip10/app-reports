export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  scope: string;
  issuedAt: string;
  expiresAt: string;
  refreshExpiresIn?: number;
  [key: string]: any;
}
