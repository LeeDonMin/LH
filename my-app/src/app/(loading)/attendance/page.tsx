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
function determineAttendanceStatus(date: Date): string {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const totalMinutes = hour * 60 + minute;

  if (totalMinutes < 9 * 60) return '출석';
  if (totalMinutes < 10 * 60) return '지각';
  return '결석';
}

type AttendanceRecord = {
  status: string;
  time: string;
};

export default function AttendanceCalendar() {
  const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceRecord>>({});
  const [selected, setSelected] = useState<Date|undefined>(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [corrections, setCorrections] = useState<any[]>([]);
  // 시간 실시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

const handleSaveTodayAttendance = () => {
  const todayStr = currentTime.toLocaleDateString('sv-SE');
  
  // 이미 출결 기록이 있다면 알림만 띄우고 종료
  if (attendanceData[todayStr]) {
    alert(`${todayStr}에 이미 출석하셨습니다.`);
    return;
  }

  const status = determineAttendanceStatus(currentTime);
  const timeStr = currentTime.toLocaleTimeString();

  setAttendanceData(prev => ({
    ...prev,
    [todayStr]: { status, time: timeStr }
  }));

  alert(`${todayStr}에 ${status}으로 저장되었습니다.`);
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
