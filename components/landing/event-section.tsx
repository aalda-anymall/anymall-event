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

type EventSectionProps = {
  acceptingSlots: SlotData[];
  comingSlots: SlotData[];
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

function EventCard({
  slot,
  variant,
  selected,
  onToggle,
}: {
  slot: SlotData;
  variant: "accepting" | "coming";
  selected?: boolean;
  onToggle?: () => void;
}) {
  const isAccepting = variant === "accepting";

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
          {isAccepting && (
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
          )}
          {!isAccepting && (
            <span className="inline-flex w-fit items-center rounded-full bg-[rgba(245,166,35,0.09)] px-2.5 py-0.5 text-[11px] font-semibold text-[#d48806]">
              準備中
            </span>
          )}
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

      <div className="flex flex-col gap-3">
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

        {isAccepting && (
          <a
            href={`/event/apply/?slots=${slot.id}`}
            className="flex h-11 items-center justify-center rounded-full bg-brand-green text-sm font-bold text-white"
          >
            応募する
          </a>
        )}
        {!isAccepting && (
          <div className="flex h-11 items-center justify-center rounded-full bg-warm-300 text-[13px] text-warm-500">
            Coming Soon
          </div>
        )}
      </div>
    </div>
  );
}

export function EventSection({
  acceptingSlots,
  comingSlots,
}: EventSectionProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showAllAccepting, setShowAllAccepting] = useState(false);
  const [showAllComing, setShowAllComing] = useState(false);

  const INITIAL_SHOW_COUNT = 6;

  const visibleAccepting = showAllAccepting
    ? acceptingSlots
    : acceptingSlots.slice(0, INITIAL_SHOW_COUNT);
  const visibleComing = showAllComing
    ? comingSlots
    : comingSlots.slice(0, INITIAL_SHOW_COUNT);

  const remainingAccepting = acceptingSlots.length - INITIAL_SHOW_COUNT;
  const remainingComing = comingSlots.length - INITIAL_SHOW_COUNT;

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
      <section id="events" className="bg-warm-100 px-4 py-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-center gap-2">
            <p className="font-serif text-xs font-semibold uppercase tracking-[4px] text-brand-olive">
              Schedule
            </p>
            <div className="flex flex-col items-center gap-3">
              <h2 className="text-center font-serif text-[28px] font-semibold leading-normal text-warm-800">
                イベント日程 全{acceptingSlots.length + comingSlots.length}回
              </h2>
              <div className="h-px w-[60px] bg-brand-green-light" />
            </div>
          </div>

          <p className="text-base leading-7 text-warm-600">
            参加したいイベントに応募しましょう！
            <br />
            イベントの左上のあるチェックボックスを選択して最大3つまで選んでまとめて応募することができます。
          </p>

          {acceptingSlots.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <div className="size-2 rounded bg-brand-green-text" />
                <span className="text-[15px] font-bold text-warm-900">
                  応募中のイベント
                </span>
              </div>
              <div className="flex flex-col gap-4">
                {visibleAccepting.map((slot) => (
                  <EventCard
                    key={slot.id}
                    slot={slot}
                    variant="accepting"
                    selected={selectedIds.has(slot.id)}
                    onToggle={() => toggleSelection(slot.id)}
                  />
                ))}
              </div>
              {!showAllAccepting && remainingAccepting > 0 && (
                <button
                  type="button"
                  onClick={() => setShowAllAccepting(true)}
                  className="flex items-center justify-center gap-2 text-[13px] font-medium text-warm-500"
                >
                  他 {remainingAccepting}件のイベントを表示
                  <Icon
                    className="text-warm-500"
                    name="ChevronRight"
                    size={16}
                  />
                </button>
              )}
            </div>
          )}

          {comingSlots.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <div className="size-2 rounded bg-warm-500" />
                <span className="text-[15px] font-bold text-warm-900">
                  準備中のイベント
                </span>
              </div>
              <div className="flex flex-col gap-4">
                {visibleComing.map((slot) => (
                  <EventCard key={slot.id} slot={slot} variant="coming" />
                ))}
              </div>
              {!showAllComing && remainingComing > 0 && (
                <button
                  type="button"
                  onClick={() => setShowAllComing(true)}
                  className="flex items-center justify-center gap-2 text-[13px] font-medium text-warm-500"
                >
                  他 {remainingComing}件のイベントを表示
                  <Icon
                    className="text-warm-500"
                    name="ChevronRight"
                    size={16}
                  />
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <div
        className={`sticky bottom-0 z-50 bg-white px-4 transition-all duration-500 ease-in-out overflow-hidden ${
          selectedIds.size > 0
            ? "h-[106px] translate-y-0 opacity-100"
            : "h-0 min-h-0 pointer-events-none translate-y-full opacity-0"
        }`}
      >
        <div className="flex flex-col items-center gap-3 py-4">
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
            <Icon className="text-warm-400" name="X" size={14} />
          </button>
          <a
            href={`/event/apply?slots=${Array.from(selectedIds).join(",")}`}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-brand-green text-sm font-bold text-white"
          >
            まとめて応募
            <Icon className="text-white" name="ChevronRight" size={16} />
          </a>
        </div>
      </div>
    </>
  );
}
