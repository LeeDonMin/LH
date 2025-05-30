import axios from "axios";

const instance = axios.create({
  baseURL: "http://192.168.0.227:8080/api",
  withCredentials: true, // ✅ 쿠키 기반 인증일 경우 필수
});

instance.interceptors.request.use((config) => {
  const matches = document.cookie.match(/(^| )token=([^;]+)/);
  const token = matches ? matches[2] : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const res = await instance.post("/auth/login", { email, password });
  return res.data;
};

export const signup = async ({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) => {
  const response = await instance.post("http://192.168.0.227:8080/api/auth/signup", {
    email,
    password,
    name,
  });
  return response.data;
};
export const attend = async () => {
  const response = await instance.post("/attendance");
  return response.data;
};
export const getAttendance = async (year: number, month: number) => {
  const response = await instance.get("/attendance/monthly",{params: { year, month }});
    return response.data;
}
export const attendCheck = async () => {
    const response = await instance.get(`/admin/all`);
    return response.data;
    }

export default instance;
