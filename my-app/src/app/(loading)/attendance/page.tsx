'use client';

import { Calendar } from "@/components/ui/calendar";
import { isSameDay } from "date-fns";
import { useEffect, useState } from "react";
import { ko } from "date-fns/locale";
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
  const [selected, setSelected] = useState<Date>();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 시간 실시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSaveTodayAttendance = () => {
    const todayStr = currentTime.toLocaleDateString('sv-SE');
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

  return (
    <div className="p-4">
      <Calendar
        locale={ko}
        mode="single"
        selected={selected}
        onSelect={handleDayClick}
        className="flex flex-col items-center justify-center"
        components={{
          Day: ({ date }) => {
            const dateStr = date.toLocaleDateString('sv-SE');
            const status = attendanceData[dateStr]?.status;
            const isToday = isSameDay(date, currentTime);
            const statusClass = status ? getStatusColor(status) : '';
            const baseClass = isToday ? 'border-2 border-black' : '';

            return (
              <div
                className={`w-16 h-16 flex flex-col items-center justify-center text-sm rounded ${statusClass} ${baseClass}`}
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
              </>
            ) : (
              <div className="text-gray-500">출결 기록이 없습니다.</div>
            )}
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">닫기</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
