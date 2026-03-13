import type { ApiResponse } from "@/interfaces";
import axiosConfig from "./config";
import type { LoginResponse } from "@/interfaces/login";
import type { UserInfo } from "@/interfaces/user";
const apiUrl = import.meta.env.VITE_HOST_API_AUTH;
const apiUrlInfo = import.meta.env.VITE_HOST_API_INFO;

export const loginService = async (
  data: any,
  accountId: string,
): Promise<ApiResponse<LoginResponse>> => {
  try {
    const headers = {
      "x-accountId": accountId,
      "content-type": "application/x-www-form-urlencoded",
    };
    const response = await axiosConfig.post<LoginResponse>(
      `${apiUrl}/auth/token/${accountId}`,
      { ...data, grant_type: "password", client_id: "sign-in-scope" },
      {
        headers,
      },
    );
    return { data: response.data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
};

export const logoutService = async (
  accountId: string,
  refresh_token: string,
): Promise<ApiResponse<any>> => {
  try {
    const headers = { "x-accountId": accountId };
    const response = await axiosConfig.post(
      `${apiUrl}/auth/logout`,
      {
        refresh_token,
      },
      {
        headers,
      },
    );
    return { data: response.data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
};

export const getUserInformation = async (
  tenant: string,
  token?: string,
): Promise<ApiResponse<UserInfo>> => {
  try {
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    const response = await axiosConfig.get<UserInfo>(
      `${apiUrlInfo}/${tenant}/v1/getDetailUser`,
      config,
    );
    return { data: response.data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
};
