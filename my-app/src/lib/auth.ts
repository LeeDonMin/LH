// 저장: 토큰을 쿠키에 안전하게 저장
export const saveToken = (token: string) => {
  if (typeof document !== "undefined") {
    document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax${
      location.protocol === "https:" ? "; Secure" : ""
    }`;
  }
};

// 읽기: 쿠키에서 토큰 읽기
export const getToken = (): string | null => {
  if (typeof document !== "undefined") {
    const matches = document.cookie.match(/(?:^|; )token=([^;]*)/);
    return matches ? decodeURIComponent(matches[1]) : null;
  }
  return null;
};
export const logout = () => {
  if (typeof document !== "undefined") {
    document.cookie =
      "token=; path=/; max-age=0; SameSite=Lax" +
      (location.protocol === "https:" ? "; Secure" : "");
  }
};
