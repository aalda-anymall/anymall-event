"use client";

import { useEffect, useState } from "react";
import { getSlotStateLabel } from "@/lib/labels";
import { formatAdminSlotDateTimeRange, getCapacityLabel, getThemeBulletLines } from "@/lib/slot-display";

export type SlotTableRow = {
  id: string;
  eventName: string;
  venueName: string;
  theme: string;
  instructor: string;
  capacity: number;
  applicationBegin: string;
  applicationDeadline: string;
  startsAt: string;
  endsAt: string;
  state: "APPLICATIONS_CLOSED" | "ACCEPTING_APPLICATIONS";
};

type SlotsTableProps = {
  slots: SlotTableRow[];
};

const detailFieldClassName =
  "rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800";

export function SlotsTable({ slots }: SlotsTableProps) {
  const [selectedSlot, setSelectedSlot] = useState<SlotTableRow | null>(null);

  useEffect(() => {
    if (!selectedSlot) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedSlot(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedSlot]);

  function openSlot(slot: SlotTableRow) {
    setSelectedSlot(slot);
  }

  return (
    <>
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-600">
              <th className="px-2 py-2">イベント名</th>
              <th className="px-2 py-2">会場</th>
              <th className="px-2 py-2">開催日時</th>
              <th className="px-2 py-2">状態</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr
                aria-label={`${slot.eventName} の詳細を表示`}
                className="cursor-pointer border-b border-slate-100 align-top outline-none transition hover:bg-slate-50 focus:bg-slate-50"
                key={slot.id}
                onClick={() => openSlot(slot)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openSlot(slot);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <td className="px-2 py-3">{slot.eventName}</td>
                <td className="px-2 py-3">{slot.venueName}</td>
                <td className="px-2 py-3">{formatAdminSlotDateTimeRange(slot.startsAt, slot.endsAt)}</td>
                <td className="px-2 py-3">{getSlotStateLabel(slot.state)}</td>
              </tr>
            ))}
            {slots.length === 0 ? (
              <tr>
                <td className="px-2 py-4 text-slate-500" colSpan={4}>
                  スロットはありません
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {selectedSlot ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
          onClick={() => setSelectedSlot(null)}
          role="dialog"
        >
          <div
            className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">スロット詳細</h2>
                <p className="mt-1 text-sm text-slate-500">{selectedSlot.eventName}</p>
              </div>
              <button
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => setSelectedSlot(null)}
                type="button"
              >
                閉じる
              </button>
            </div>

            <div className="grid gap-4 px-6 py-5 md:grid-cols-2">
              <div>
                <p className="mb-1 text-xs font-medium text-slate-600">イベント名</p>
                <div className={detailFieldClassName}>{selectedSlot.eventName}</div>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium text-slate-600">会場</p>
                <div className={detailFieldClassName}>{selectedSlot.venueName}</div>
              </div>
              <div className="md:col-span-2">
                <p className="mb-1 text-xs font-medium text-slate-600">テーマ</p>
                <div className={detailFieldClassName}>
                  <ul className="space-y-1">
                    {getThemeBulletLines(selectedSlot.theme).map((line) => (
                      <li key={line}>• {line}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium text-slate-600">インストラクター</p>
                <div className={detailFieldClassName}>{selectedSlot.instructor}</div>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium text-slate-600">定員</p>
                <div className={`${detailFieldClassName} w-16`} w-64>{selectedSlot.capacity > 0 ? selectedSlot.capacity : "定員未設定"}</div>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium text-slate-600">応募開始日時</p>
                <div className={detailFieldClassName}>{new Date(selectedSlot.applicationBegin).toLocaleString()}</div>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium text-slate-600">応募締切日時</p>
                <div className={detailFieldClassName}>{new Date(selectedSlot.applicationDeadline).toLocaleString()}</div>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium text-slate-600">開催日時</p>
                <div className={detailFieldClassName}>
                  {formatAdminSlotDateTimeRange(selectedSlot.startsAt, selectedSlot.endsAt)}
                </div>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium text-slate-600">状態</p>
                <div className={detailFieldClassName}>{getSlotStateLabel(selectedSlot.state)}</div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
