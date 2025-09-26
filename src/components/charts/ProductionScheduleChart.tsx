import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { useTheme } from '@/hooks/use-theme';
const data = [
  { task: 'Task A', machine: 'CNC-Mill-01', start: 0, end: 4, duration: 4 },
  { task: 'Task B', machine: 'CNC-Mill-02', start: 1, end: 5, duration: 4 },
  { task: 'Task C', machine: 'Lathe-03', start: 4, end: 7, duration: 3 },
  { task: 'Task D', machine: 'Robot-Arm-05', start: 5, end: 8, duration: 3 },
  { task: 'Task E', machine: 'CNC-Mill-01', start: 7, end: 10, duration: 3 },
  { task: 'Task F', machine: 'Lathe-03', start: 8, end: 11, duration: 3 },
].reverse(); // Reverse to display from top to bottom correctly in vertical layout
export function ProductionScheduleChart() {
  const { isDark } = useTheme();
  const mutedColor = isDark ? 'hsl(215 20.2% 65.1%)' : 'hsl(215.4 16.3% 46.9%)';
  const primaryColor = isDark ? 'hsl(210 40% 98%)' : 'hsl(222.2 47.4% 11.2%)';
  const accentColor = "hsl(142.1 76.2% 36.2%)"; // Green
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={mutedColor} strokeOpacity={0.2} />
        <XAxis type="number" stroke={mutedColor} fontSize={12} tickLine={false} axisLine={false} domain={[0, 12]} tickFormatter={(tick) => `Hour ${tick}`} />
        <YAxis type="category" dataKey="machine" stroke={mutedColor} fontSize={12} tickLine={false} axisLine={false} width={100} />
        <Tooltip
          cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
          contentStyle={{
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            border: `1px solid ${mutedColor}`,
            borderRadius: '0.5rem',
            backdropFilter: 'blur(4px)',
          }}
          formatter={(value, name, props) => {
            if (name === 'range') {
              return [`${props.payload.start}h - ${props.payload.end}h`, 'Time'];
            }
            return [value, name];
          }}
          labelFormatter={(label, payload) => payload[0]?.payload.task || label}
        />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Bar dataKey="start" stackId="a" fill="transparent" name="Start Time" />
        <Bar dataKey="duration" stackId="a" fill={primaryColor} name="Task Duration" radius={[4, 4, 4, 4]} />
      </BarChart>
    </ResponsiveContainer>
  );
}