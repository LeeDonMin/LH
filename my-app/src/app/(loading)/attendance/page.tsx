'use client';

import { Calendar } from "@/components/ui/calendar";
import { isSameDay, set } from "date-fns";
import { useEffect, useState } from "react";
import { ko, se } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { attend, getAttendance } from "@/lib/axios";
import { getToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
// 출결 상태별 색상 클래스
function getStatusColor(status: string) {
  switch (status) {
    case '출석':
      return 'bg-green-300 text-green-800';
    case '지각':
      return 'bg-yellow-300 text-black';
    case '결석':
      return 'bg-red-400 text-white';
    default:
      return '';
  }
}

// 출결 판단 함수

type ApiAttendanceItem = {
  attendanceId: number;
  date: string; // "2025-05-30"
  memberId: number;
  status: string; // API 상태값, 예: "ABSENT"
  studentName: string;
  time: string; // "17:29:43.434"
};

type AttendanceRecord = {
  status: string;
  time: string;
};
function transformAttendanceData(apiData: ApiAttendanceItem[]): Record<string, AttendanceRecord> {
  const map: Record<string, AttendanceRecord> = {};
  apiData.forEach(item => {
    // status를 한글 등 원하는 형태로 변환할 수도 있음
    let status = '';
    switch (item.status) {
      case 'ATTENDANCE':
        status = '출석';
        break;
      case 'LATE':
        status = '지각';
        break;
      case 'ABSENT':
        status = '결석';
        break;
      default:
        status = item.status; // 그대로 둠
    }

    map[item.date] = {
      status,
      time: item.time.split('.')[0], // 마이크로초 제거하고 시:분:초만 저장
    };
  });

  return map;
}

export default function AttendanceCalendar() {
  const router = useRouter();
  const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceRecord>>({});
  const [selected, setSelected] = useState<Date|undefined>(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [corrections, setCorrections] = useState<any[]>([]);
  // 시간 실시간 업데이트
 
useEffect(() => {
  const fetchData = async () => {
    const token = getToken();
    if (!token) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    try {
      const apiResponse = await getAttendance(2025, 5); // 응답은 배열이라고 가정
      const transformed = transformAttendanceData(apiResponse);
      setAttendanceData(transformed);
    } catch (error) {
      console.error('출결 데이터 가져오기 실패:', error);
      alert('출결 데이터를 가져오는 데 실패했습니다.');
    }
  };
  fetchData();

  const timer = setInterval(() => setCurrentTime(new Date()), 1000);
  return () => clearInterval(timer);
}, [router]);
const handleSaveTodayAttendance = async () => {
  const todayStr = currentTime.toLocaleDateString('sv-SE');
  const token = getToken();

  if (!token) {
    alert('로그인이 필요합니다.');
    const router = useRouter();
    router.push('/login');
    return;
  }

  try {
    if (attendanceData[todayStr]) {
      alert(`${todayStr}에 이미 출석하셨습니다.`);
      return;
    }

    // 서버에 출석 기록 요청
    await attend();  // 서버가 현재 시간 기준으로 판단해서 저장

    // 저장 후 최신 출석 정보 다시 가져오기
    const updatedData = await getAttendance(currentTime.getFullYear(), currentTime.getMonth() + 1);
    setAttendanceData(transformAttendanceData(updatedData));

    alert(`${todayStr} 출석이 저장되었습니다.`);
  } catch (error) {
    console.error('출석 기록 저장 실패:', error);
    alert('출석 기록 저장에 실패했습니다.');
  }
};

  const handleDayClick = (date?: Date) => {
    setSelected(date);
    setDrawerOpen(true);
  };

  const selectedStr = selected?.toLocaleDateString('sv-SE') ?? '';
  const record = attendanceData[selectedStr];
  const handleReason = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReason(e.target.value);
  };
  return (
    <div className="p-4">
      <Calendar
        locale={ko}
        mode="single"
        selected={selected}
        onSelect={setSelected}
        className="flex flex-col items-center justify-center"
        components={{
          Day: ({ date }) => {
            const dateStr = date.toLocaleDateString('sv-SE');
            const status = attendanceData[dateStr]?.status;
            const isSelected = selected && isSameDay(date, selected);
            const statusClass = status ? getStatusColor(status) : '';
            const borderClass = isSelected ? 'ring-2 ring-black' : ''; // ✅ 선택 표시

            return (
              <div
                onClick={() => handleDayClick(date)} // ✅ 날짜 클릭 이벤트 수동 지정
                className={`w-16 h-16 flex flex-col items-center justify-center text-sm rounded cursor-pointer ${statusClass} ${borderClass}`}
              >
                <span className="text-base">{date.getDate()}</span>
                {status && (
                  <span className="text-xs mt-1">{status}</span>
                )}
              </div>
            );
          }
        }}

      />

      {/* 오늘 출결 기록 저장용 Drawer */}
      <div className="mt-6">
        
        <Drawer>
          <DrawerTrigger asChild>
            <Button>오늘 출결 기록</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>출결 기록</DrawerTitle>
              <DrawerDescription>
                현재 시간 기준으로 출결을 기록합니다.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 space-y-2 text-center">
              <div>🕒 현재 시간: <strong>{currentTime.toLocaleTimeString()}</strong></div>
              <div>📅 오늘 날짜: <strong>{currentTime.toLocaleDateString()}</strong></div>
            </div>
            <DrawerFooter>
              <Button onClick={handleSaveTodayAttendance}>출결 저장</Button>
              <DrawerClose asChild>
                <Button variant="outline">닫기</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>

      {/* 선택된 날짜 출결 보기 Drawer */}

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>

        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>선택한 날짜 출결 정보</DrawerTitle>
            <DrawerDescription>
              {selected?.toLocaleDateString() ?? '날짜 선택 안됨'}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-2 text-center">
            {record ? (
              <>
                <div>📅 날짜: <strong>{selected?.toLocaleDateString()}</strong></div>
                <div>🟢 출결 상태: <strong>{record.status}</strong></div>
                <div>🕒 출결 시간: <strong>{record.time}</strong></div>
                <input 
                  id = "reason"
                  type = "text"
                  placeholder="정정 사유를 입력하세요"
                  className="border p-2 rounded"
                  value={reason}
                  onChange = {handleReason}

                />
              </>
            ) : (
              <div className="text-gray-500">출결 기록이 없습니다.</div>
            )}
          </div>
          <DrawerFooter>
            <Button
              onClick={() => {
                if (!record || !selected) {
                  alert("출결 기록이 없거나 날짜가 선택되지 않았습니다.");
                  return;
                }

                const correctionData = {
                  date: selected.toISOString().split('T')[0], // ISO 포맷 "YYYY-MM-DD"
                  status: record.status,
                  time: record.time,
                  reason: reason,
                };

                // state에 저장
                setCorrections(prev => [...prev, correctionData]);

                console.log('정정 신청 저장됨:', correctionData);
                alert('정정 신청이 저장되었습니다 (임시 JSON).');
                setReason('');
                setDrawerOpen(false);
              }}
            >
              정정 신청
            </Button>

            <DrawerClose asChild>
              <Button variant="outline">닫기</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

    </div>
  );
}
