import { useState } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts'; // <--- Novos Imports
import { Wallet, TrendingUp, AlertTriangle, ArrowLeft, Layers, Calendar } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919', '#A0A0A0'];

const Dashboard = ({ receipts }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // --- LÓGICA 1: Pizza (Categorias) ---
  const categoryTotals = receipts.reduce((acc, receipt) => {
    receipt.items.forEach(item => {
      const cat = item.category || 'OUTROS';
      if (!acc[cat]) acc[cat] = 0;
      acc[cat] += item.totalPrice;
    });
    return acc;
  }, {});

  const macroData = Object.keys(categoryTotals).map(cat => ({
    name: cat,
    value: categoryTotals[cat]
  })).sort((a, b) => b.value - a.value);

  // --- LÓGICA 2: Drill Down (Detalhes) ---
  let microData = [];
  if (selectedCategory) {
    const subCatTotals = {};
    receipts.forEach(receipt => {
      receipt.items.forEach(item => {
        if (item.category === selectedCategory) {
          const sub = item.subCategory || 'Geral';
          if (!subCatTotals[sub]) subCatTotals[sub] = 0;
          subCatTotals[sub] += item.totalPrice;
        }
      });
    });

    microData = Object.keys(subCatTotals).map(sub => ({
      name: sub,
      value: subCatTotals[sub]
    })).sort((a, b) => b.value - a.value);
  }

  const activeData = selectedCategory ? microData : macroData;
  const totalSpending = receipts.reduce((sum, r) => sum + r.totalAmount, 0);

  // --- LÓGICA 3: Barras (Evolução Mensal) ---
  const monthlyTotals = receipts.reduce((acc, receipt) => {
    // Pega "2024-02" da data
    const monthKey = receipt.date.substring(0, 7); 
    if (!acc[monthKey]) acc[monthKey] = 0;
    acc[monthKey] += receipt.totalAmount;
    return acc;
  }, {});

  // Transforma em array e ordena por data
  const barData = Object.keys(monthlyTotals).map(key => {
    const [year, month] = key.split('-');
    // Cria nome bonito: "Fev/24"
    const dateObj = new Date(year, month - 1);
    const name = dateObj.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
    return {
      fullDate: key,
      name: name.charAt(0).toUpperCase() + name.slice(1), // Capitaliza primeira letra
      total: monthlyTotals[key]
    };
  }).sort((a, b) => a.fullDate.localeCompare(b.fullDate));

  if (receipts.length === 0) return null;

  return (
    <div className="space-y-6 mb-8 animate-in fade-in slide-in-from-bottom-4">
      
      {/* LINHA 1: Cards Principais */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Card Resumo */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <Wallet className="w-32 h-32 text-brand-600" />
            </div>
            <h3 className="text-gray-500 font-medium mb-2 flex items-center gap-2 z-10">
            <Wallet className="w-5 h-5 text-brand-600" />
            Gasto Total Acumulado
            </h3>
            <p className="text-4xl font-bold text-gray-800 mb-6 z-10">
            R$ {totalSpending.toFixed(2)}
            </p>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 z-10">
            <h4 className="text-orange-800 font-semibold text-sm flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4" />
                Maior Gasto (Categoria):
            </h4>
            <p className="text-gray-700 font-medium">
                {macroData.length > 0 ? macroData[0].name : '-'} 
                <span className="text-gray-500 text-sm ml-2">
                (R$ {macroData.length > 0 ? macroData[0].value.toFixed(2) : '0.00'})
                </span>
            </p>
            </div>
        </div>

        {/* Card Pizza Interativa */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-700 font-semibold flex items-center gap-2">
                {selectedCategory ? (
                <>
                    <Layers className="w-5 h-5 text-purple-600" />
                    Detalhes: <span className="text-purple-700 underline">{selectedCategory}</span>
                </>
                ) : (
                <>
                    <TrendingUp className="w-5 h-5 text-brand-600" />
                    Divisão por Categoria
                </>
                )}
            </h3>
            {selectedCategory && (
                <button 
                onClick={() => setSelectedCategory(null)}
                className="text-xs flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors font-medium text-gray-600"
                >
                <ArrowLeft className="w-3 h-3" /> Voltar
                </button>
            )}
            </div>
            
            <div className="h-64 w-full relative">
                {!selectedCategory && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none opacity-0 hover:opacity-100 transition-opacity z-10">
                        <p className="text-xs text-white bg-black/50 px-2 py-1 rounded">Clique na fatia</p>
                    </div>
                )}
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                        data={activeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        onClick={(data) => {
                            if (!selectedCategory) setSelectedCategory(data.name);
                        }}
                        className="cursor-pointer outline-none"
                    >
                        {activeData.map((entry, index) => (
                        <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                            className="hover:opacity-80 transition-opacity stroke-white stroke-2"
                        />
                        ))}
                    </Pie>
                    <Tooltip 
                        formatter={(value) => `R$ ${value.toFixed(2)}`}
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #eee' }}
                    />
                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* LINHA 2: Gráfico de Barras (Novo) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-gray-700 font-semibold mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Evolução Mensal de Gastos
        </h3>
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#6b7280', fontSize: 12}} 
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#6b7280', fontSize: 12}} 
                        tickFormatter={(val) => `R$${val}`}
                    />
                    <Tooltip 
                        cursor={{fill: '#f3f4f6'}}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value) => [`R$ ${value.toFixed(2)}`, 'Total Gasto']}
                    />
                    <Bar 
                        dataKey="total" 
                        fill="#3b82f6" 
                        radius={[4, 4, 0, 0]} 
                        barSize={40}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;