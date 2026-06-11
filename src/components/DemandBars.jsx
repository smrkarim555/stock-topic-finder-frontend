export default function DemandBars({ demand }) {
  const levels = { High: 3, Medium: 2, Low: 1 };
  const level = levels[demand] || 1;
  const colors = {
    3: ['#16a34a', '#16a34a', '#16a34a'],
    2: ['#d97706', '#d97706', '#e5e7eb'],
    1: ['#dc2626', '#e5e7eb', '#e5e7eb'],
  }[level];

  return (
    <div className="inline-flex items-end gap-[2px]">
      {[8, 12, 16].map((h, i) => (
        <div key={i} style={{ height: h, width: 4, backgroundColor: colors[i], borderRadius: 2 }} />
      ))}
    </div>
  );
}
