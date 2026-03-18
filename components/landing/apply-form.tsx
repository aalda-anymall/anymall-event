"use client";

import { useState } from "react";
import { prefectureOptions } from "@/lib/labels";
import { getMemoMaxLength } from "@/lib/validation";
import { Icon } from "@/components/icon";

type SlotData = {
  id: string;
  eventName: string;
  startsAt: string;
  endsAt: string;
  venue: { name: string; address: string };
  instructor: string;
};

type FormData = {
  name: string;
  furigana: string;
  email: string;
  birthday: string;
  prefecture: string;
  memo: string;
};

type Step = "form" | "confirm" | "complete";

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

const STEPS = [
  { key: "form", label: "入力" },
  { key: "confirm", label: "確認" },
  { key: "complete", label: "完了" },
] as const;

function StepIndicator({ current }: { current: Step }) {
  const currentIndex = STEPS.findIndex((s) => s.key === current);

  return (
    <div className="flex items-center justify-center gap-0 px-4 py-5">
      {STEPS.map((s, i) => {
        const isCompleted = i < currentIndex;
        const isCurrent = i === currentIndex;

        return (
          <div key={s.key} className="flex">
            {i > 0 && (
              <div
                className={`relative top-[14px] h-px w-10 ${
                  i <= currentIndex ? "bg-brand-green" : "bg-warm-300"
                }`}
              />
            )}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex size-7 items-center justify-center rounded-full text-xs font-bold ${
                  isCompleted
                    ? "bg-brand-green text-white"
                    : isCurrent
                      ? "bg-brand-green text-white"
                      : "bg-warm-300 text-warm-500"
                }`}
              >
                {isCompleted ? (
                  <Icon className="text-white" name="Check" size={14} />
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`text-[11px] font-medium ${
                  isCurrent
                    ? "text-brand-green"
                    : isCompleted
                      ? "text-brand-green"
                      : "text-warm-400"
                }`}
              >
                {s.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] text-[#8a8a8a]">
        {label}
        {required && " *"}
      </label>
      {children}
    </div>
  );
}

function ConfirmRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-warm-200 pb-3">
      <span className="text-[11px] text-[#8a8a8a]">{label}</span>
      <span className="text-sm text-[#313131]">{value || "—"}</span>
    </div>
  );
}

function SlotSummaryCard({ slot }: { slot: SlotData }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-[#9c968f] bg-white p-3">
      <h4 className="text-sm font-bold text-warm-900">{slot.eventName}</h4>
      <div className="flex items-center gap-1.5">
        <div className="min-w-4">
          <Icon className="text-[#8a8a8a]" name="Calendar" size={14} />
        </div>
        <span className="text-xs text-[#313131]">
          {formatDate(slot.startsAt)} {formatTime(slot.startsAt)}〜
          {formatTime(slot.endsAt)}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="min-w-4">
          <Icon className="text-[#8a8a8a]" name="MapPin" size={14} />
        </div>
        <span className="text-xs text-[#313131]">
          {slot.venue.name} — {slot.venue.address}
        </span>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex gap-4 text-[13px]">
          <div className="text-[#8a8a8a]">
            <p>担当者</p>
          </div>
          <div className="text-[#313131]">
            <p>{slot.instructor}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --------------- Step components ---------------

function FormStep({
  formData,
  setFormData,
  error,
  onBack,
  onConfirm,
}: {
  formData: FormData;
  setFormData: (data: FormData) => void;
  error: string | null;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const memoMaxLength = getMemoMaxLength();

  function update(field: keyof FormData, value: string) {
    setFormData({ ...formData, [field]: value });
  }

  return (
    <div className="flex flex-col gap-3.5 pt-6">
      <div className="flex flex-col gap-3.5 px-4">
        <FormField label="氏名" required>
          <input
            type="text"
            className="w-full rounded-lg border border-[#9c968f] bg-white px-3.5 py-2.5 text-[13px] text-[#313131] outline-none"
            placeholder="山内 あい"
            value={formData.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </FormField>

        <FormField label="氏名（フリガナ）" required>
          <input
            type="text"
            className="w-full rounded-lg border border-[#9c968f] bg-white px-3.5 py-2.5 text-[13px] text-[#313131] outline-none"
            placeholder="ヤマウチ アイ"
            value={formData.furigana}
            onChange={(e) => update("furigana", e.target.value)}
          />
        </FormField>

        <FormField label="メールアドレス" required>
          <input
            type="email"
            className="w-full rounded-lg border border-[#9c968f] bg-white px-3.5 py-2.5 text-[13px] text-[#313131] outline-none"
            placeholder="ai_yamauchi@example.com"
            value={formData.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </FormField>

        <FormField label="生年月日">
          <input
            type="date"
            className="w-full rounded-lg border border-[#9c968f] bg-white px-3.5 py-2.5 text-[13px] text-[#313131] outline-none"
            value={formData.birthday}
            onChange={(e) => update("birthday", e.target.value)}
          />
        </FormField>

        <FormField label="都道府県">
          <div className="relative">
            <select
              className="w-full appearance-none rounded-lg border border-[#9c968f] bg-white py-2.5 pl-3.5 pr-9 text-[13px] text-[#313131] outline-none"
              value={formData.prefecture}
              onChange={(e) => update("prefecture", e.target.value)}
            >
              <option value="">選択してください</option>
              {prefectureOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <Icon
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8a8a]"
              name="ChevronDown"
              size={16}
            />
          </div>
        </FormField>

        <FormField label="メモ">
          <textarea
            className="min-h-[115px] w-full rounded-lg border border-[#9c968f] bg-white px-3.5 py-2.5 text-[13px] text-[#313131] outline-none"
            placeholder="ご要望があればご記入ください"
            maxLength={memoMaxLength}
            value={formData.memo}
            onChange={(e) => update("memo", e.target.value)}
          />
          <p className="text-right text-[11px] text-[#8a8a8a]">
            {formData.memo.length}/{memoMaxLength}
          </p>
        </FormField>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
      <div className="flex items-center justify-center gap-4 bg-white py-4">
        <button
          type="button"
          onClick={onBack}
          className="flex h-11 w-[140px] items-center justify-center rounded-full border border-warm-200 bg-white text-sm font-bold text-warm-500"
        >
          戻る
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex h-11 w-[140px] items-center justify-center rounded-full bg-brand-green text-sm font-bold text-white"
        >
          確認する
        </button>
      </div>
    </div>
  );
}

function ConfirmStep({
  formData,
  slots,
  isSubmitting,
  error,
  onBack,
  onSubmit,
}: {
  formData: FormData;
  slots: SlotData[];
  isSubmitting: boolean;
  error: string | null;
  onBack: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="flex flex-col gap-3.5 pt-6">
      <div className="flex flex-col gap-3.5 px-4">
        <div>
          <h2 className="text-lg font-bold text-warm-900">入力内容の確認</h2>
          <p className="mt-1 text-sm text-warm-500">
            以下の内容でよろしければ応募してください
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <ConfirmRow label="氏名" value={formData.name} />
          <ConfirmRow label="氏名（フリガナ）" value={formData.furigana} />
          <ConfirmRow label="メールアドレス" value={formData.email} />
          <ConfirmRow label="生年月日" value={formData.birthday} />
          <ConfirmRow label="都道府県" value={formData.prefecture} />
          <ConfirmRow label="メモ" value={formData.memo} />
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-[11px] text-[#8a8a8a]">応募イベント</span>
          {slots.map((slot) => (
            <SlotSummaryCard key={slot.id} slot={slot} />
          ))}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
      <div className="flex items-center justify-center gap-4 bg-white py-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex h-11 w-[140px] items-center justify-center rounded-full border border-warm-200 bg-white text-sm font-bold text-warm-500"
        >
          修正する
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex h-11 items-center justify-center gap-2 rounded-full bg-brand-green px-6 text-sm font-bold text-white disabled:opacity-60"
        >
          {isSubmitting ? "送信中..." : "この内容で応募する"}
        </button>
      </div>
    </div>
  );
}

function CompleteStep() {
  return (
    <div className="flex flex-col items-center gap-6 px-4 py-16">
      <div className="flex size-16 items-center justify-center rounded-full bg-brand-green">
        <Icon className="text-white" name="Check" size={32} />
      </div>

      <div className="flex flex-col items-center gap-3 text-center">
        <h2 className="text-2xl font-bold text-warm-900">
          応募ありがとうございます
        </h2>
        <p className="text-sm leading-6 text-warm-500">
          メールを送信しました。メールをご確認ください。
          <br />
          抽選結果はメールでお知らせします。
        </p>
      </div>

      <div className="flex w-full flex-col items-center gap-3 pt-4">
        <a
          href="/#events"
          className="flex h-11 w-full items-center justify-center rounded-full bg-brand-green text-sm font-bold text-white"
        >
          他のイベントも見る
        </a>
        <a
          href="/"
          className="flex h-11 w-full items-center justify-center rounded-full border border-warm-200 bg-white text-sm font-bold text-warm-500"
        >
          トップページに戻る
        </a>
      </div>
    </div>
  );
}

// --------------- Main component ---------------

export function ApplyForm({ slots }: { slots: SlotData[] }) {
  const [step, setStep] = useState<Step>("form");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    furigana: "",
    email: "",
    birthday: "",
    prefecture: "",
    memo: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const katakanaPattern = /^[\u30A0-\u30FFー・\s]+$/;

  function handleConfirm() {
    setError(null);

    if (!formData.name.trim()) {
      setError("氏名を入力してください。");
      return;
    }
    if (!formData.furigana.trim()) {
      setError("フリガナを入力してください。");
      return;
    }
    if (!katakanaPattern.test(formData.furigana.trim())) {
      setError("フリガナはカタカナで入力してください。");
      return;
    }
    if (!emailPattern.test(formData.email.trim())) {
      setError("有効なメールアドレスを入力してください。");
      return;
    }

    setStep("confirm");
    window.scrollTo(0, 0);
  }

  async function handleSubmit() {
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.furigana.trim(),
          email: formData.email.trim().toLowerCase(),
          birthday: formData.birthday.trim(),
          gender: "unspecified",
          prefecture: formData.prefecture.trim(),
          memo: formData.memo.trim(),
          selectedSlotIds: slots.map((s) => s.id),
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (response.ok) {
        setStep("complete");
        window.scrollTo(0, 0);
        return;
      }

      setError(data?.error ?? "送信に失敗しました。もう一度お試しください。");
    } catch {
      setError("送信に失敗しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <StepIndicator current={step} />
      {step === "complete" && <CompleteStep />}
      {step === "confirm" && (
        <ConfirmStep
          formData={formData}
          slots={slots}
          isSubmitting={isSubmitting}
          error={error}
          onBack={() => {
            setError(null);
            setStep("form");
            window.scrollTo(0, 0);
          }}
          onSubmit={handleSubmit}
        />
      )}
      {step === "form" && (
        <FormStep
          formData={formData}
          setFormData={setFormData}
          error={error}
          onBack={() => window.history.back()}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
