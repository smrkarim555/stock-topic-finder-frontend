export default function Sparkline({ trend, width = 52, height = 22 }) {
  const isPositive = trend >= 0;
  const color = trend > 5 ? '#16a34a' : trend < -2 ? '#dc2626' : '#d97706';

  // Generate fake but consistent sparkline points based on trend
  const generatePoints = () => {
    const points = [];
    const seed = Math.abs(trend * 13.7);
    let val = 50;
    for (let i = 0; i < 8; i++) {
      const noise = ((seed * (i + 1) * 2.3) % 20) - 10;
      val = Math.max(10, Math.min(90, val + (trend / 8) + noise));
      points.push(val);
    }
    return points;
  };

  const pts = generatePoints();
  const min = Math.min(...pts);
  const max = Math.max(...pts);
  const range = max - min || 1;

  const svgPoints = pts.map((p, i) => {
    const x = (i / (pts.length - 1)) * (width - 4) + 2;
    const y = ((1 - (p - min) / range) * (height - 6)) + 3;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="inline-block">
      <polyline
        points={svgPoints}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
