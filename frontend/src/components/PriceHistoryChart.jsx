import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, ArrowDown, ArrowUp } from 'lucide-react';

const PriceHistoryChart = ({ data, productName }) => {
  if (!data || data.length === 0) return null;

  // Formata a data para o eixo X (Dia/Mês)
  const chartData = data.map(item => ({
    ...item,
    formattedDate: new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    fullDate: new Date(item.date).toLocaleDateString('pt-BR')
  }));

  // Calcula variação (Inflação Pessoal)
  const firstPrice = chartData[0].price;
  const lastPrice = chartData[chartData.length - 1].price;
  const variation = ((lastPrice - firstPrice) / firstPrice) * 100;
  const isUp = variation > 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wide">Histórico de Preço</h3>
          <h2 className="text-2xl font-bold text-gray-800 capitalize flex items-center gap-2">
            {productName}
          </h2>
        </div>
        
        {chartData.length > 1 && (
          <div className={`text-right px-3 py-1 rounded-lg ${isUp ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            <p className="text-xs font-semibold uppercase">Variação</p>
            <div className="flex items-center justify-end gap-1 font-bold text-lg">
              {isUp ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              {Math.abs(variation).toFixed(1)}%
            </div>
          </div>
        )}
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <XAxis 
                dataKey="formattedDate" 
                tick={{fontSize: 12, fill: '#9ca3af'}} 
                axisLine={false} 
                tickLine={false} 
            />
            <YAxis 
                tick={{fontSize: 12, fill: '#9ca3af'}} 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(val) => `R$${val}`}
            />
            <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                labelFormatter={(label, payload) => payload[0]?.payload.fullDate}
                formatter={(value, name, props) => [`R$ ${value.toFixed(2)}`, props.payload.supermarket]}
            />
            <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#22c55e" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#22c55e', strokeWidth: 2, stroke: '#fff' }} 
                activeDot={{ r: 6 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-xs text-center text-gray-400">
        Preço unitário encontrado nas notas fiscais processadas.
      </div>
    </div>
  );
};

export default PriceHistoryChart;