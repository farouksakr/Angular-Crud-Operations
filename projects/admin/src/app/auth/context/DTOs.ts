export interface login {
  email: string;
  password: string;
  role: string;
}

export interface loginResponse {
  token: string;
  userId: string;
}
