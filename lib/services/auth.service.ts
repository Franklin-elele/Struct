import api from "../api";

// Types
export type SignUpPayload = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  timezone?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
  timezone?: string;
};

export const signUp = async (data: SignUpPayload) =>
  api.post("api/auth/signup", data);

export const login = async (data: LoginPayload) =>
  api.post("api/auth/login", data);

export const logout = async () => api.post("api/auth/logout");

export const getCurrentUser = async () => api.get("api/user/me");

export const updateProfile = async (data: FormData) =>
    api.patch("api/user/me", data);


