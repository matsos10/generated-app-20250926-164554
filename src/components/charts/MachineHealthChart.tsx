import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { useTheme } from '@/hooks/use-theme';
const data = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  temperature: 60 + Math.random() * 20 + (i > 20 ? (i - 20) * 2 : 0),
  vibration: 0.5 + Math.random() * 0.5 + (i > 22 ? (i - 22) * 0.1 : 0),
}));
export function MachineHealthChart() {
  const { isDark } = useTheme();
  const mutedColor = isDark ? 'hsl(215 20.2% 65.1%)' : 'hsl(215.4 16.3% 46.9%)';
  const tempColor = "hsl(346.8 77.2% 49.8%)"; // A red color
  const vibrationColor = "hsl(262.1 83.3% 57.8%)"; // A purple color
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={mutedColor} strokeOpacity={0.2} />
        <XAxis
          dataKey="day"
          stroke={mutedColor}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          yAxisId="left"
          stroke={tempColor}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${Math.round(value)}°C`}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke={vibrationColor}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value.toFixed(1)} mm/s`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            border: `1px solid ${mutedColor}`,
            borderRadius: '0.5rem',
            backdropFilter: 'blur(4px)',
          }}
        />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Line yAxisId="left" type="monotone" dataKey="temperature" stroke={tempColor} strokeWidth={2} dot={false} />
        <Line yAxisId="right" type="monotone" dataKey="vibration" stroke={vibrationColor} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}