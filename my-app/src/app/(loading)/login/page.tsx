'use client';
import {CardWithForm} from "@/components/card-form";
import { useState } from "react";
import {login} from "@/lib/axios";
import { saveToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
const handleSubmit = async () => {
    if (!email || !password ) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    try {
      const { token } = await login({ email, password});
      saveToken(token);
      router.push('/attendance'); // ✅ 로그인 페이지로 이동
    } catch (error) {
      console.error(error);
      setError('로그인 오류가 발생했습니다.');
    }
  };
  return (
    <div className="flex h-screen items-center justify-center">
      <CardWithForm items ={{title: '로그인', description: '계정에 로그인하여 서비스를 이용하세요.', leftLabel: '비밀번호 찾기', rightLabel: '로그인', handelSubmit: handleSubmit}}>
        <div className="grid gap-4">
          <h2 className="text-2xl font-bold">로그인</h2>
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium">이메일</label>
            <input
              id="email"
              type="email"
              placeholder="이메일을 입력하세요"
              className="border p-2 rounded"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="password" className="text-sm font-medium">비밀번호</label>
            <input
              id="password"
              
              type="password"
              placeholder="비밀번호를 입력하세요"
              className="border p-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
      </CardWithForm>
    </div>
  );
}