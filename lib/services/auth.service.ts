import api from "../api";

// Types
export type SignUpPayload = {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
};

export type LoginPayload = {
    email: string;
    password: string;
};

export const signUp = async (data: SignUpPayload) => 
    api.post("api/auth/signup", data);

export const login = async (data: LoginPayload) =>
    api.post("api/auth/login", data);

export const logout = async () => api.post("api/auth/logout");

export const getCurrentUser = async () => api.get("api/auth/me");