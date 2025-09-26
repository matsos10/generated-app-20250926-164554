import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { useTheme } from '@/hooks/use-theme';
const data = Array.from({ length: 12 }, (_, i) => ({
  month: new Date(2024, i, 1).toLocaleString('default', { month: 'short' }),
  cosmetic: Math.floor(Math.random() * 20) + 5,
  functional: Math.floor(Math.random() * 15) + 3,
  structural: Math.floor(Math.random() * 10) + 2,
}));
export function DefectTrendChart() {
  const { isDark } = useTheme();
  const mutedColor = isDark ? 'hsl(215 20.2% 65.1%)' : 'hsl(215.4 16.3% 46.9%)';
  const cosmeticColor = "hsl(262.1 83.3% 57.8%)"; // Purple
  const functionalColor = "hsl(346.8 77.2% 49.8%)"; // Red
  const structuralColor = "hsl(37.9 98.6% 52.5%)"; // Orange
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorCosmetic" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={cosmeticColor} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={cosmeticColor} stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorFunctional" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={functionalColor} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={functionalColor} stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorStructural" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={structuralColor} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={structuralColor} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={mutedColor} strokeOpacity={0.2} />
        <XAxis
          dataKey="month"
          stroke={mutedColor}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke={mutedColor}
          fontSize={12}
          tickLine={false}
          axisLine={false}
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
        <Area type="monotone" dataKey="cosmetic" stackId="1" stroke={cosmeticColor} fillOpacity={1} fill="url(#colorCosmetic)" />
        <Area type="monotone" dataKey="functional" stackId="1" stroke={functionalColor} fillOpacity={1} fill="url(#colorFunctional)" />
        <Area type="monotone" dataKey="structural" stackId="1" stroke={structuralColor} fillOpacity={1} fill="url(#colorStructural)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}