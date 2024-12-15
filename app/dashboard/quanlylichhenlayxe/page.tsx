"use client";

import React, { FC, useState, useEffect } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  Event,
  NavigateAction,
} from "react-big-calendar";
import withDragAndDrop, {
  withDragAndDropProps,
} from "react-big-calendar/lib/addons/dragAndDrop";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { addHours } from "date-fns/addHours";
import { startOfHour } from "date-fns/startOfHour";
import { vi } from "date-fns/locale/vi";
import { add, sub } from "date-fns";
import { View } from "react-big-calendar";

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import toast, { Toaster } from "react-hot-toast";
import { PickupScheduleForm } from "../components/LichHen";


// Interfaces (kept from your original code)
interface PickupSchedule {
  idLichHen: number;
  TenKhachHang: string;
  Sdt: string;
  Email: string;
  idXe: number;
  idLoaiXe: number;
  NgayHen: string | Date;
  GioHen: string;
  DiaDiem: string;
  NoiDung: string;
  xe: {
    TenXe: string;
  };
}

interface LoaiXe {
  idLoaiXe: number;
  TenLoai: string;
}

interface Xe {
  idXe: number;
  TenXe: string;
}

// Locales configuration
const locales = {
  "vi-VN": {
    ...vi,
    option: {
      weekStartsOn: 1 // 0 is Sunday, 1 is Monday
    }
  }

};

// Localizer setup
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: any) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
});

// Helper functions for date manipulation
const endOfHour = (date: Date): Date => addHours(startOfHour(date), 1);
const now = new Date();
const start = endOfHour(now);
const end = addHours(start, 2);

// Drag and Drop Calendar
const DnDCalendar = withDragAndDrop(Calendar);

const PickupScheduleCalendar: FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<View>("week");
  const [loaiXeList, setLoaiXeList] = useState<LoaiXe[]>([]);
  const [xeList, setXeList] = useState<Xe[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<PickupSchedule | null>(null);

  // Navigation handlers
  const onNavigate = (newDate: Date, view: string, action: NavigateAction) => {
    switch (action) {
      case "PREV":
        setDate((prevDate) => {
          const newDate = new Date(prevDate);
          if (view === "month") newDate.setMonth(newDate.getMonth() - 1);
          else if (view === "week") newDate.setDate(newDate.getDate() - 7);
          else if (view === "day") newDate.setDate(newDate.getDate() - 1);
          return newDate;
        });
        break;
      case "NEXT":
        setDate((prevDate) => {
          const newDate = new Date(prevDate);
          if (view === "month") newDate.setMonth(newDate.getMonth() + 1);
          else if (view === "week") newDate.setDate(newDate.getDate() + 7);
          else if (view === "day") newDate.setDate(newDate.getDate() + 1);
          return newDate;
        });
        break;
      case "TODAY":
        setDate(new Date());
        break;
      default:
        setDate(newDate);
    }
  };

  const onView = (newView: View) => {
    setView(newView);
  };

  // Fetch data effects
  useEffect(() => {
    Promise.all([
      fetch("api/loaixe").then(res => res.json()),
      fetch("api/xes").then(res => res.json()),
      fetch("api/lichhenchaythu").then(res => res.json())
    ]).then(([loaiXeData, xeData, schedulesData]) => {
      setLoaiXeList(loaiXeData);
      setXeList(xeData);

      // Transform schedules into calendar events
      const calendarEvents: Event[] = schedulesData.map((schedule: PickupSchedule) => ({
        title: `${schedule.NoiDung} - ${schedule.TenKhachHang}`,
        start: new Date(schedule.NgayHen),
        end: addHours(new Date(schedule.NgayHen), 1),
        resource: schedule,

      }));

      setEvents(calendarEvents);
      setIsLoading(false);
    }).catch(err => {
      console.error("Error fetching data:", err);
      toast.error("Không thể tải dữ liệu");
      setError("Có lỗi xảy ra khi tải dữ liệu");
      setIsLoading(false);
    });
  }, []);

  // Event handlers
  const handleAddNewClick = () => {
    setSelectedSchedule(null);
    setIsModalOpen(true);
  };

  const handleSelectEvent = (event: Event) => {
    setSelectedSchedule(event.resource as PickupSchedule);
    setIsModalOpen(true);
  };

  const handleSubmitSuccess = (newSchedule: PickupSchedule) => {
    // Update events state
    setEvents((prevEvents) => {
      // Remove existing event if editing
      const filteredEvents = prevEvents.filter(
        event => (event.resource as PickupSchedule).idLichHen !== newSchedule.idLichHen
      );

      // Add new event
      return [
        ...filteredEvents,
        {
          title: `${newSchedule.NoiDung} - ${newSchedule.TenKhachHang}`,
          start: new Date(newSchedule.NgayHen),
          end: addHours(new Date(newSchedule.NgayHen), 1),
          resource: newSchedule,
        }
      ];
    });

    // Close modal
    setIsModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span className="font-medium">Bạn có chắc muốn xóa lịch hẹn này?</span>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  // Gửi request xóa lịch hẹn từ server
                  const response = await fetch(`api/lichhenchaythu/${id}`, {
                    method: "DELETE",
                  });
  
                  if (!response.ok) {
                    throw new Error("Xóa lịch hẹn thất bại");
                  }
  
                  // Gọi lại API để lấy danh sách lịch hẹn mới
                  const updatedSchedules = await fetch("api/lichhenchaythu")
                    .then((res) => res.json())
                    .then((data) => data);
  
                  // Cập nhật lại sự kiện
                  const updatedEvents: Event[] = updatedSchedules.map((schedule: PickupSchedule) => ({
                    title: `${schedule.NoiDung} - ${schedule.TenKhachHang}`,
                    start: new Date(schedule.NgayHen),
                    end: addHours(new Date(schedule.NgayHen), 1),
                    resource: schedule,

                  }));
  
                  // Cập nhật lại danh sách sự kiện
                  setEvents(updatedEvents);
                  toast.success("Xóa lịch hẹn thành công");
  
                  // Đóng modal sau khi xóa
                  setIsModalOpen(false);
                } catch (err) {
                  toast.error(
                    err instanceof Error ? err.message : "Có lỗi xảy ra khi xóa lịch hẹn"
                  );
                }
              }}
              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
            >
              Xóa
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
        style: {
          background: "#fff",
          color: "#000",
          padding: "16px",
          borderRadius: "8px",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        },
      }
    );
  };
  

  // Event drag and drop handlers
  const onEventResize: withDragAndDropProps["onEventResize"] = (data) => {
    const { start, end } = data;

    setEvents((currentEvents) => {
      return currentEvents.map((event) => {
        if (event.start === data.event.start) {
          return { ...event, start: new Date(start), end: new Date(end) };
        }
        return event;
      });
    });
  };

  const onEventDrop: withDragAndDropProps["onEventDrop"] = (data) => {
    const { start, end, event } = data;

    setEvents((currentEvents) => {
      return currentEvents.map((evt) => {
        if (evt.start === event.start) {
          return { ...evt, start: new Date(start), end: new Date(end) };
        }
        return evt;
      });
    });
  };

  // Rendering
  if (isLoading) {
    return (
      <Card className="w-full max-w-6xl mx-auto mt-4">
        <CardContent className="p-4 text-center">
          Đang tải lịch hẹn...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-6xl mx-auto mt-4">
        <CardContent className="p-4 text-red-500">Lỗi: {error}</CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-6xl mx-auto mt-4">
      <Toaster position="top-center" />
      <CardHeader>
        <div className="flex items-center">
          <CardTitle>Lịch Hẹn Lấy Xe</CardTitle>
          <button 
            className="btn btn-accent ml-auto" 
            onClick={handleAddNewClick}
          >
            Thêm Lịch
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <DnDCalendar
          date={date}
          onNavigate={onNavigate}
          onView={onView}
          view={view}
          defaultView="week"
          events={events}
          localizer={localizer}
          onEventDrop={onEventDrop}
          onEventResize={onEventResize}
          onSelectEvent={handleSelectEvent}
          resizable
          style={{ height: "100vh", }}
          views={["month", "week", "day", "agenda"]}
          messages={{
            month: "Tháng",
            week: "Tuần",
            day: "Ngày",
            agenda: "Danh Sách",
          }}
        />
      </CardContent>

      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-5xl">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <h3 className="font-bold text-lg mb-4">
              {selectedSchedule ? "Cập Nhật Lịch Hẹn" : "Thêm Mới Lịch Hẹn"}
            </h3>
            {selectedSchedule && (
  <div className="flex justify-end items-center mt-4">
    <button
      className="btn btn-error"
      onClick={() => handleDelete(selectedSchedule.idLichHen)}
    >
      Xóa Lịch Hẹn
    </button>
  </div>
)}



            <PickupScheduleForm
              initialData={selectedSchedule ? {
                idLichHen: selectedSchedule.idLichHen,
                TenKhachHang: selectedSchedule.TenKhachHang,
                Sdt: selectedSchedule.Sdt,
                Email: selectedSchedule.Email,
                idXe: selectedSchedule.idXe.toString(),
                idLoaiXe: selectedSchedule.idLoaiXe.toString(),
                NgayHen: new Date(selectedSchedule.NgayHen),
                GioHen: selectedSchedule.GioHen,
                DiaDiem: selectedSchedule.DiaDiem,
                NoiDung: selectedSchedule.NoiDung,
              } : undefined}
              onSubmitSuccess={handleSubmitSuccess}
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export default PickupScheduleCalendar;