'use client';

import {CardWithForm} from "@/components/card-form";
import { useState } from "react";
import instance from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter(); // ✅ router 사용 선언
  const handleSubmit = async () => {
    if (!email || !password || !confirmPassword || !name) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setError('');

    try {
      await instance.post('/auth/signup', { email, password, name });
      alert('회원가입 성공!');
      router.push('/login'); // ✅ 로그인 페이지로 이동
    } catch (error) {
      console.error(error);
      setError('회원가입 중 오류가 발생했습니다.');
    }
  };
  return (
    <div className="flex h-screen items-center justify-center">
      <CardWithForm items ={{title: '회원가입', description: '회원가입을 위해 정보를 입력해주세요.', leftLabel: '로그인', rightLabel: '회원가입', handelSubmit: handleSubmit}}>
        {/** Function to handle form submission */}
        <div className="grid gap-4">
          <h2 className="text-2xl font-bold">회원가입</h2>
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">이름</label>
            <input
              id="name"
              type="name"
              placeholder="이름을 입력하세요"
              className="border p-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium">이메일</label>
            <input
              id="email"
              type="email"
              placeholder="이메일을 입력하세요"
              className="border p-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <div className="grid gap-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">비밀번호 확인</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              className="border p-2 rounded"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
      </CardWithForm>
    </div>
  );
}