import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeftRight, Wallet, ShoppingCart, Coffee, CheckCircle2, PlusCircle, MinusCircle, Trash2, Settings, X, Sparkles, Calculator, CalendarClock } from 'lucide-react';

const PlannerDashboard = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showSettings, setShowSettings] = useState(false);
  const [adultsCount, setAdultsCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(1);
  const [monthlyBudget, setMonthlyBudget] = useState(1500);
  const [localPrices, setLocalPrices] = useState({});
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItemName, setNewItemName] = useState("");

  const handleAddNewItem = async () => {
    if (!newItemName.trim()) {
      setIsAddingNew(false);
      return;
    }

    try {
      // O fator 2.0 faz o Java recuperar da lixeira OU criar um novo!
      await axios.post(`http://localhost:8080/api/planner/feedback?itemName=${newItemName}&factor=2.0`);
      
      setNewItemName("");
      setIsAddingNew(false);
      
      // Recarrega a lista do backend para o item aparecer na tela com o preço arbitrário
      fetchPlan(); // Use o nome da função que você já tem para carregar os dados
      
    } catch (error) {
      console.error("Erro ao adicionar:", error);
      alert("Erro ao adicionar o item ao planejamento.");
    }
  };

  const fetchPlan = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/planner/generate');
      setPlan(response.data);
    } catch (error) {
      console.error("Erro ao buscar o plano:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  useEffect(() => {
    if (plan) {
      setLocalPrices(prev => {
        const newPrices = { ...prev };
        plan.items.forEach(item => {
          if (newPrices[item.itemName] === undefined) {
            newPrices[item.itemName] = item.unitPrice || 0;
          }
        });
        return newPrices;
      });
    }
  }, [plan]);

  const handlePriceChange = (itemName, value) => {
    setLocalPrices(prev => ({ ...prev, [itemName]: parseFloat(value) || 0 }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault(); 
    try {
      await axios.post('http://localhost:8080/api/planner/profile', {
        adultsCount: parseInt(adultsCount),
        childrenCount: parseInt(childrenCount),
        monthlyBudget: parseFloat(monthlyBudget)
      });
      setShowSettings(false);
      fetchPlan(); 
    } catch (error) {
      alert("Erro ao salvar as configurações.");
    }
  };

  const handleFeedback = async (itemName, factor) => {
    try {
      await axios.post(`http://localhost:8080/api/planner/feedback?itemName=${encodeURIComponent(itemName)}&factor=${factor}`);
      fetchPlan();
    } catch (error) {}
  };

  const handleToggleCategory = (item) => {
    const novaCategoria = item.category === 'SEMANAL_FRESCOS' ? 'MENSAL_BASE' : 'SEMANAL_FRESCOS';
    const itemAtualizado = { ...item, category: novaCategoria };

    setPlan(prevPlan => ({
      ...prevPlan,
      // Trocamos o .id pelo nome do produto!
      items: prevPlan.items.map(i => i.itemName === item.itemName ? itemAtualizado : i 
      )
    }));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  if (loading && !plan) return <div className="flex justify-center items-center h-64 text-xl font-semibold text-gray-500">Calculando seu plano ideal... 🧠</div>;
  if (!plan) return <div className="text-red-500 text-center p-4">Erro de conexão.</div>;

  const listMensal = plan.items.filter(item => item.category.includes('MENSAL'));
  const listSemanal = plan.items.filter(item => item.category === 'SEMANAL_FRESCOS');
  const listSugestoes = plan.items.filter(item => item.category === 'SUGESTAO_HISTORICO');

  const custoItensMensais = listMensal.reduce((acc, item) => acc + (item.quantity * (localPrices[item.itemName] || 0)), 0);
  const custoItensSemanais = listSemanal.reduce((acc, item) => acc + (item.quantity * (localPrices[item.itemName] || 0)), 0);
  const projecaoSemanalNoMes = custoItensSemanais * 4;
  
  const custoTotalPlanejado = custoItensMensais + projecaoSemanalNoMes;
  const orcamentoMensalBase = plan.monthlyEstimatedCost;
  const orcamentoSemanalBase = plan.weeklyReserve;
  const estourouOrcamento = custoTotalPlanejado > orcamentoMensalBase + orcamentoSemanalBase;

  return (
    //Container Principal - Limita a largura e centraliza
    <div className="w-full max-w-[1600px] mx-auto p-4 sm:p-6 space-y-8 bg-gray-50 min-h-screen relative">
      
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Plano de Voo do Mês 🚀</h1>
          <p className="text-gray-600 mt-2">Simule os preços e gerencie seu orçamento real.</p>
        </div>
        <button onClick={() => setShowSettings(true)} className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 shadow-sm font-medium">
          <Settings size={18} />
          <span className="hidden sm:inline">Configurar Perfil</span>
        </button>
      </div>
    
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Wallet size={28} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Orçamento Total</p>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(plan.totalBudget)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg"><ShoppingCart size={28} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Padaria & Hortifruti</p>
            <p className="text-2xl font-bold text-green-700">{formatCurrency(plan.weeklyReserve / 4)} <span className="text-sm font-normal text-gray-500">/sem</span></p>
            <p className="text-xs text-gray-500 mt-1">Verba livre. Total do mês: {formatCurrency(plan.weeklyReserve)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><Coffee size={28} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Fundo Lazer (Churras/Ifood)</p>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(plan.leisureReserve)}</p>
            <p className="text-xs text-purple-600 font-semibold mt-1">Aproveite sem culpa!</p>
          </div>
        </div>
      </div>


      {/* LISTAS DE ITENS - MENSAL E SEMANAL */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* ========================================= */}
        {/* COLUNA 1: COMPRA DO MÊS */}
        {/* ========================================= */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="bg-blue-50 p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-blue-800 flex items-center gap-2">📅 Compra do Mês</h2>
            <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Atacadista / Base</span>
          </div>
          
          <div className="overflow-x-auto">
            <ul className="divide-y divide-gray-100 min-w-full">
              {listMensal.map((item, index) => {
                const currentPrice = localPrices[item.itemName] || 0;
                const itemTotal = item.quantity * currentPrice;
                return (
                  // A mágica acontece aqui: flex-wrap permite que os itens caiam de linha se necessário, sem cortar a tela.
                  <li key={index} className="p-4 hover:bg-gray-50 transition flex flex-wrap items-center justify-between gap-4">
                    
                    <div className="flex items-start gap-2 flex-1 min-w-[200px]">
                      <CheckCircle2 className="text-gray-300 shrink-0 mt-0.5" size={18} />
                      <span className="font-medium text-gray-700 break-words">{item.itemName}</span>
                    </div>
                    
                    {/* Bloco de Controles - Sempre juntos */}
                    <div className="flex flex-wrap items-center gap-3">
                      
                      <div className="flex items-center gap-1.5 border-r border-gray-200 pr-3">
                        <button onClick={() => handleFeedback(item.itemName, 1.2)} className="text-gray-400 hover:text-green-600"><PlusCircle size={18} /></button>
                        <button onClick={() => handleFeedback(item.itemName, 0.8)} className="text-gray-400 hover:text-blue-600"><MinusCircle size={18} /></button>
                        <button onClick={() => handleFeedback(item.itemName, 0.0)} className="text-gray-400 hover:text-red-600"><Trash2 size={18} /></button>
                        <button onClick={() => handleToggleCategory(item)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors" title="Mover para a outra lista" ><ArrowLeftRight className="w-4 h-4" /></button>                      
                      </div>

                      <span className="inline-block px-3 py-1.5 bg-gray-100 text-gray-800 rounded font-semibold text-center text-xs w-[80px]">
                        {item.quantity} {item.unit}
                      </span>

                      <div className="flex items-center gap-1 border border-gray-300 rounded px-2 py-1.5 bg-white w-[100px] focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                        <span className="text-gray-400 text-xs">R$</span>
                        <input 
                          type="number" step="0.10" 
                          value={currentPrice} 
                          onChange={(e) => handlePriceChange(item.itemName, e.target.value)} 
                          className="w-full text-right outline-none font-medium bg-transparent text-sm" 
                        />
                      </div>

                      <div className="font-bold text-gray-700 w-[90px] text-right text-sm">
                        {formatCurrency(itemTotal)}
                      </div>
                    </div>                    
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ========================================= */}
          {/* LÓGICA DE ADIÇÃO MANUAL */}
          {/* ========================================= */}
          <div className="mt-4 flex justify-center">
            {!isAddingNew ? (
              <button 
                onClick={() => setIsAddingNew(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-600 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors"
              >
                + Adicionar item manualmente
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-white p-1 rounded-lg shadow-sm border border-gray-200">
                <input 
                  type="text"
                  placeholder="Digite o nome do produto..."
                  className="px-3 py-1.5 outline-none text-sm w-48"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddNewItem(); }}
                />
                <button 
                  onClick={handleAddNewItem}
                  className="px-3 py-1.5 bg-brand-600 text-white text-sm font-medium rounded-md hover:bg-brand-700"
                >
                  Salvar
                </button>
                <button 
                  onClick={() => setIsAddingNew(false)}
                  className="px-2 py-1.5 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* ========================================= */}
          {/* Resumo de custos da compra mensal */}
          {/* ========================================= */}
          <div className={`p-4 border-t mt-auto ${estourouOrcamento ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex justify-between items-center text-xs text-gray-500 mb-2 pb-2 border-b border-gray-200/50">
              <span>Custo Itens Mensais: {formatCurrency(custoItensMensais)}</span>
              <span>+ Projeção Semanal (x4): {formatCurrency(projecaoSemanalNoMes)}</span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-600 flex items-center gap-1"><Calculator size={16}/> Total Planejado no Mês:</span>
              <span className={`text-lg font-bold ${estourouOrcamento ? 'text-red-600' : 'text-gray-800'}`}>
                {formatCurrency(custoTotalPlanejado)}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Orçamento Base Disponível:</span>
              <span className="font-semibold text-gray-600">
                {formatCurrency(Number(orcamentoMensalBase) + Number(orcamentoSemanalBase))}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================= */}
        {/* COLUNA 2: COMPRA DA SEMANA */}
        {/* ========================================= */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-fit">
          <div className="bg-orange-50 p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-orange-800 flex items-center gap-2">📆 Carnes & Laticínios</h2>
            <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">Toda Semana</span>
          </div>
          
          <div className="overflow-x-auto">
            <ul className="divide-y divide-gray-100 min-w-full">
              {listSemanal.map((item, index) => {
                const currentPrice = localPrices[item.itemName] || 0;
                const itemTotal = item.quantity * currentPrice;
                return (
                  <li key={index} className="p-4 hover:bg-gray-50 transition flex flex-wrap items-center justify-between gap-4">
                    
                    <div className="flex items-start gap-2 flex-1 min-w-[200px]">
                      <CheckCircle2 className="text-gray-300 shrink-0 mt-0.5" size={18} />
                      <span className="font-medium text-gray-700 break-words">{item.itemName}</span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1.5 border-r border-gray-200 pr-3">
                        <button onClick={() => handleFeedback(item.itemName, 1.2)} className="text-gray-400 hover:text-green-600"><PlusCircle size={18} /></button>
                        <button onClick={() => handleFeedback(item.itemName, 0.8)} className="text-gray-400 hover:text-blue-600"><MinusCircle size={18} /></button>
                        <button onClick={() => handleFeedback(item.itemName, 0.0)} className="text-gray-400 hover:text-red-600"><Trash2 size={18} /></button>
                        <button onClick={() => handleToggleCategory(item)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors" title="Mover para a outra lista" ><ArrowLeftRight className="w-4 h-4" /></button>                      
                      </div>

                      <span className="inline-block px-3 py-1.5 bg-orange-50 text-orange-800 rounded font-semibold text-center text-xs w-[80px]">
                        {item.quantity} {item.unit}
                      </span>

                      <div className="flex items-center gap-1 border border-gray-300 rounded px-2 py-1.5 bg-white w-[100px] focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                        <span className="text-gray-400 text-xs">R$</span>
                        <input 
                          type="number" step="0.10" 
                          value={currentPrice} 
                          onChange={(e) => handlePriceChange(item.itemName, e.target.value)} 
                          className="w-full text-right outline-none font-medium bg-transparent text-sm" 
                        />
                      </div>

                      <div className="font-bold text-gray-700 w-[90px] text-right text-sm">
                        {formatCurrency(itemTotal)}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ========================================= */}
          {/* Resumo de custos da compra semanal */}
          {/* ========================================= */}
          <div className="p-4 border-t mt-auto bg-gray-50 border-gray-200">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-600 flex items-center gap-1">Custo de 1 Semana:</span>
              <span className="text-lg font-bold text-gray-800">{formatCurrency(custoItensSemanais)}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 flex items-center gap-1"><CalendarClock size={12}/> Projeção no Mês (x4):</span>
              <span className="font-semibold text-orange-600">{formatCurrency(projecaoSemanalNoMes)}</span>
            </div>
          </div>
        </div>
      </div>
    
      {/* ========================================= */}
      {/* SUGESTÕES DO HISTÓRICO */}
      {/* ========================================= */}
      {listSugestoes.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-purple-200 overflow-hidden mt-8">
           <div className="bg-purple-50 p-4 border-b border-purple-100 flex items-center gap-2">
            <Sparkles className="text-purple-600" size={24} />
            <div>
              <h2 className="text-lg font-bold text-purple-900">Sugestões do seu Histórico</h2>
              <p className="text-xs text-purple-700">Baseado no que você comprou nos últimos 60 dias.</p>
            </div>
          </div>
          <ul className="divide-y divide-purple-50">
            {listSugestoes.map((item, index) => (
              <li key={index} className="p-4 flex flex-wrap items-center justify-between hover:bg-purple-50/50 transition gap-4">
                <div className="flex items-center gap-3 min-w-[200px] flex-1">
                  <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  <span className="font-medium text-gray-800 break-words">{item.itemName}</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 border-r border-purple-200 pr-4">
                    <button onClick={() => handleFeedback(item.itemName, 1.2)} title="Incluir na compra (+1)" className="text-gray-400 hover:text-green-600 transition"><PlusCircle size={18} /></button>
                    <button onClick={() => handleFeedback(item.itemName, 0.0)} title="Ignorar sugestão" className="text-gray-400 hover:text-red-600 transition"><Trash2 size={18} /></button>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${loading ? 'opacity-50' : 'bg-purple-100 text-purple-800'}`}>
                    {item.quantity} {item.unit}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ========================================= */}
      {/* CONFIGURAÇÕES DO PERFIL - MODAL */}
      {/* ========================================= */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Perfil da Família</h2>
              <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Orçamento Mensal (R$)</label>
                <input type="number" step="0.01" required value={monthlyBudget} onChange={(e) => setMonthlyBudget(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qtd. Adultos</label>
                  <input type="number" min="1" required value={adultsCount} onChange={(e) => setAdultsCount(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qtd. Crianças</label>
                  <input type="number" min="0" required value={childrenCount} onChange={(e) => setChildrenCount(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowSettings(false)} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition">Cancelar</button>
                <button type="submit" className="px-5 py-2.5 bg-brand-600 text-blue-600 font-bold bg-blue-100 hover:bg-blue-200 rounded-lg transition">Salvar e Recalcular</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlannerDashboard;