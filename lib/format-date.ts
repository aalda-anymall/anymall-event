const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

export function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const weekday = WEEKDAYS[d.getDay()];
  return `${year}.${month}.${day} (${weekday})`;
}

export function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function formatApplicationPeriod(begin: string, deadline: string) {
  const b = new Date(begin);
  const d = new Date(deadline);
  return `${b.getMonth() + 1}月${b.getDate()}日〜${d.getMonth() + 1}月${d.getDate()}日`;
}
