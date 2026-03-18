"use client";

import { useState } from "react";
import type { SlotState } from "@prisma/client";
import { Icon } from "@/components/icon";

type SlotData = {
  id: string;
  eventName: string;
  theme: string;
  instructor: string;
  capacity: number;
  applicationBegin: string;
  applicationDeadline: string;
  startsAt: string;
  endsAt: string;
  state: SlotState;
  venue: { name: string; address: string };
};

type ApplyContentProps = {
  initialSelectedSlots: SlotData[];
  otherSlots: SlotData[];
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const weekday = weekdays[d.getDay()];
  return `${year}.${month}.${day} (${weekday})`;
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function formatApplicationPeriod(begin: string, deadline: string) {
  const b = new Date(begin);
  const d = new Date(deadline);
  return `${b.getMonth() + 1}月${b.getDate()}日〜${d.getMonth() + 1}月${d.getDate()}日`;
}

function ApplyCard({
  slot,
  selected,
  onToggle,
}: {
  slot: SlotData;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`flex flex-col gap-2 overflow-hidden rounded-2xl bg-white p-4 outline-brand-green transition-all duration-100 ease-in-out ${
        selected
          ? "border outline border-brand-green shadow-md"
          : "border border-warm-200"
      }`}
    >
      <div className="flex items-start">
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggle}
              className={`flex size-6 items-center justify-center rounded-full border ${
                selected
                  ? "border-white bg-brand-green"
                  : "border-warm-400 bg-white/70"
              }`}
            >
              {selected && (
                <Icon className="text-white" name="Check" size={16} />
              )}
            </button>
            <span className="inline-flex items-center rounded-full bg-[rgba(90,143,110,0.12)] px-2.5 py-0.5 text-[11px] font-semibold text-brand-green-text">
              募集中
            </span>
          </div>
          <h3 className="text-xl font-bold text-warm-900">{slot.eventName}</h3>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <div className="min-w-4">
            <Icon className="text-[#8a8a8a]" name="Calendar" size={16} />
          </div>
          <span className="text-[13px] text-[#313131]">
            {formatDate(slot.startsAt)} {formatTime(slot.startsAt)}〜
            {formatTime(slot.endsAt)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="min-w-4">
            <Icon className="text-[#8a8a8a]" name="MapPin" size={16} />
          </div>
          <span className="text-[13px] text-[#313131]">
            {slot.venue.name} — {slot.venue.address}
          </span>
        </div>
      </div>

      <div className="flex gap-4 text-[13px]">
        <div className="text-[#8a8a8a]">
          <p>応募期間</p>
          <p>担当者</p>
        </div>
        <div className="text-[#313131]">
          <p>
            {formatApplicationPeriod(
              slot.applicationBegin,
              slot.applicationDeadline,
            )}
          </p>
          <p>{slot.instructor}</p>
        </div>
      </div>
    </div>
  );
}

export function ApplyContent({
  initialSelectedSlots,
  otherSlots,
}: ApplyContentProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(initialSelectedSlots.map((s) => s.id)),
  );

  const allSlots = [...initialSelectedSlots, ...otherSlots];
  const selectedSlots = allSlots.filter((s) => selectedIds.has(s.id));
  const unselectedSlots = allSlots.filter((s) => !selectedIds.has(s.id));

  function toggleSelection(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < 3) {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <>
      <div className="px-4 pb-2 pt-6">
        <h1 className="text-[28px] font-bold text-warm-900">イベント応募</h1>
        <p className="mt-2 text-sm text-warm-500">
          応募したいイベントを確認して、まとめて応募できます
        </p>
      </div>

      {selectedSlots.length > 0 && (
        <div className="flex flex-col gap-4 px-4 py-4">
          <div className="flex items-center gap-2.5">
            <div className="size-2 rounded bg-brand-green" />
            <span className="text-base font-bold text-warm-900">
              このイベントに応募する
            </span>
          </div>
          <div className="flex flex-col gap-4">
            {selectedSlots.map((slot) => (
              <ApplyCard
                key={slot.id}
                slot={slot}
                selected={true}
                onToggle={() => toggleSelection(slot.id)}
              />
            ))}
          </div>
        </div>
      )}

      {unselectedSlots.length > 0 && (
        <div className="flex flex-col gap-4 px-4 py-6">
          <div className="flex items-center gap-2.5">
            <Icon className="text-warm-900" name="CirclePlus" size={20} />
            <span className="text-base font-bold text-warm-900">
              その他のイベントにも応募する
            </span>
          </div>
          <div className="flex flex-col gap-4">
            {unselectedSlots.map((slot) => (
              <ApplyCard
                key={slot.id}
                slot={slot}
                selected={false}
                onToggle={() => toggleSelection(slot.id)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="sticky bottom-0 bg-white py-4">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="flex items-center gap-2.5"
            >
              <div
                className={`flex size-[22px] items-center justify-center rounded-[5px] bg-brand-green ${
                  selectedIds.size > 0 ? "opacity-100" : "opacity-0"
                }`}
              >
                <Icon className="text-white" name="Check" size={16} />
              </div>
              <span className="text-sm font-medium text-[#313131]">
                {selectedIds.size}件のイベントを選択中
              </span>
              <div
                className={` ${
                  selectedIds.size > 0 ? "opacity-100" : "opacity-0"
                }`}
              >
                <Icon className="text-warm-400" name="X" size={14} />
              </div>
            </button>
          </div>
          <div className="flex items-center justify-center gap-4">
            <a
              href="/"
              className="flex h-11 w-[140px] items-center justify-center rounded-full border border-warm-200 bg-white text-sm font-bold text-warm-500"
            >
              戻る
            </a>
            <a
              href={
                selectedIds.size > 0
                  ? `/event/apply/form?slots=${Array.from(selectedIds).join(",")}`
                  : "#"
              }
              className={`flex h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold text-white ${
                selectedIds.size > 0
                  ? "bg-brand-green"
                  : "pointer-events-none bg-warm-400"
              }`}
            >
              まとめて応募
              <Icon className="text-white" name="ChevronRight" size={16} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
