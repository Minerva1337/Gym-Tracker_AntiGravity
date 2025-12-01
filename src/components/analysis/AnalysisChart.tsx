import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';

const data = [
    { name: 'KW 40', value: 65 },
    { name: 'KW 41', value: 68 },
    { name: 'KW 42', value: 70 },
    { name: 'KW 43', value: 72 },
    { name: 'KW 44', value: 75 },
    { name: 'KW 45', value: 75 },
    { name: 'KW 46', value: 78 },
];

export function AnalysisChart() {
    return (
        <Card className="p-4">
            <h3 className="font-bold text-lg mb-4">Leistungsindex (Bankdrücken)</h3>
            <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2e" />
                        <XAxis
                            dataKey="name"
                            stroke="#71717a"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#71717a"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            unit="kg"
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1c1c1f', border: '1px solid #2a2a2e', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#a855f7"
                            strokeWidth={2}
                            dot={{ fill: '#a855f7', strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: '#fff' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
