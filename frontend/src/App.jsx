import { useState, useEffect } from 'react';
import axios from 'axios';
import ReceiptUpload from './components/ReceiptUpload';
import ReceiptCard from './components/ReceiptCard';
import Dashboard from './components/Dashboard';
import PriceHistoryChart from './components/PriceHistoryChart';
import EditItemModal from './components/EditItemModal'; 
import { Folder, Tag, Search, X, Loader2, ScanLine } from 'lucide-react'; // Adicione Folder e Tag

function App() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados da Busca
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Estado para controlar o modal de edição de item
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/receipts');
      setReceipts(response.data.reverse());
    } catch (error) {
      console.error("Erro ao buscar notas:", error);
    } finally {
      setLoading(false);
    }
  };

  // 1. Função que busca sugestões ENQUANTO você digita
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 2) {
        try {
            // Chama o endpoint SMART
            const response = await axios.get(`http://localhost:8080/api/items/search-smart?name=${value}`);
            setSuggestions(response.data); // Agora recebe [{name: "Leite", type: "CATEGORIA"}, ...]
            setShowSuggestions(true);
        } catch (err) {
            console.error(err);
        }
    } else {
        setShowSuggestions(false);
    }
  };

  //
  const selectProduct = async (item) => {
    setSearchTerm(item.name);
    setShowSuggestions(false);
    setIsSearching(true);
    setLoading(true);

    try {
        let response;
        if (item.type === 'CATEGORIA') {
            // Se escolheu categoria, chama o endpoint de histórico agrupado
            response = await axios.get(`http://localhost:8080/api/items/category-history?categoryName=${item.name}`);
        } else {
            // Se escolheu produto, chama o endpoint exato (antigo)
            response = await axios.get(`http://localhost:8080/api/items/history?exactName=${item.name}`);
        }
        setSearchResults(response.data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setIsSearching(false);
  };

  const addReceipt = (newReceipt) => {
    setReceipts([newReceipt, ...receipts]); 
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta nota?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/receipts/${id}`);
      setReceipts(receipts.filter((r) => r.id !== id));
    } catch (error) {
      alert("Erro ao excluir nota.");
    }
  };

  const handleUpdateItem = async (updatedItemData) => {
    try {
      // 1. Chama Backend
      const response = await axios.put(`http://localhost:8080/api/items/${updatedItemData.id}`, updatedItemData);
      const savedItem = response.data;

      // 2. Atualiza Estado Local (Sem refresh na página)
      const updatedReceipts = receipts.map(receipt => {
        // Encontra a nota fiscal dona desse item
        if (receipt.items.some(i => i.id === savedItem.id)) {
            // Atualiza a lista de itens dessa nota
            const newItems = receipt.items.map(i => i.id === savedItem.id ? savedItem : i);
            // Recalcula o total da nota localmente para o card atualizar na hora
            const newTotal = newItems.reduce((acc, curr) => acc + curr.totalPrice, 0);
            
            return { ...receipt, items: newItems, totalAmount: newTotal };
        }
        return receipt;
      });

      setReceipts(updatedReceipts);
      setEditingItem(null); // Fecha o modal
    } catch (error) {
      console.error("Erro ao atualizar item:", error);
      alert("Erro ao salvar alterações.");
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          {/* Logo (Esconde em mobile se estiver buscando) */}
          <div className={`flex items-center gap-2 text-brand-600 ${isSearching ? 'hidden md:flex' : 'flex'}`}>
            <ScanLine className="w-8 h-8" />
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Market<span className="text-brand-600">Lens</span>
            </h1>
          </div>

          {/* BARRA DE BUSCA */}
          <div className="flex-1 max-w-md relative group">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Busque por 'Carne', 'Leite'..." 
                  className="w-full pl-10 pr-10 py-2 bg-gray-100 border-transparent focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 rounded-lg text-sm transition-all outline-none"
                  value={searchTerm}
                  onChange={handleInputChange} // <--- Mudou aqui
                  onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true) }}
                />
                
                {/* Botão X para limpar */}
                {(searchTerm || isSearching) && (
                  <button 
                    type="button"
                    onClick={() => {
                        clearSearch();
                        setShowSuggestions(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full"
                  >
                    <X className="w-3 h-3 text-gray-500" />
                  </button>
                )}
            </div>

            {/* LISTA DE SUGESTÕES INTELIGENTE */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                    <ul className="max-h-60 overflow-y-auto">
                        {suggestions.map((item, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => selectProduct(item)} // Passa o objeto inteiro (nome + tipo)
                                    className="w-full text-left px-4 py-3 hover:bg-brand-50 hover:text-brand-700 text-sm text-gray-700 flex items-center gap-3 group transition-colors border-b border-gray-50 last:border-0"
                                >
                                    {/* Ícone muda conforme o tipo */}
                                    {item.type === 'CATEGORIA' ? (
                                        <div className="bg-purple-100 p-1.5 rounded-md text-purple-600">
                                            <Folder className="w-4 h-4" />
                                        </div>
                                    ) : (
                                        <div className="bg-gray-100 p-1.5 rounded-md text-gray-500">
                                            <Tag className="w-4 h-4" />
                                        </div>
                                    )}
                                    
                                    <div className="flex-1">
                                        <span className="font-medium block">{item.name}</span>
                                        <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                                            {item.type === 'CATEGORIA' ? 'Agrupamento (Média)' : 'Produto Específico'}
                                        </span>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
          </div>

          {/* Modal para edicao do item */}
          <EditItemModal 
            key={editingItem ? editingItem.id : 'empty'} 
            isOpen={!!editingItem} 
            item={editingItem} 
            onClose={() => setEditingItem(null)} 
            onSave={handleUpdateItem} 
          />

        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-brand-500" />
            <p>Carregando...</p>
          </div>
        ) : (
          <>
            {/* MODO BUSCA: Mostra o Gráfico de Evolução */}
            {isSearching ? (
              <div className="animate-in fade-in slide-in-from-bottom-2">
                <button onClick={clearSearch} className="mb-4 text-sm text-gray-500 hover:text-brand-600 flex items-center gap-1">
                  ← Voltar para o Dashboard
                </button>

                {searchResults.length > 0 ? (
                  <>
                    <PriceHistoryChart data={searchResults} productName={searchTerm} />
                    
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Ocorrências Encontradas</h3>
                    <div className="grid gap-4">
                        {searchResults.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-100 flex justify-between items-center shadow-sm">
                                <div>
                                    <p className="font-bold text-gray-800">{item.productName}</p>
                                    <p className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString('pt-BR')} • {item.supermarket}</p>
                                </div>
                                <div className="text-brand-600 font-bold">
                                    R$ {item.price.toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-20 text-gray-400">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Nenhum produto encontrado com o nome "{searchTerm}".</p>
                  </div>
                )}
              </div>
            ) : (
              /* MODO NORMAL: Dashboard + Lista de Upload */
              <>
                {receipts.length > 0 && <Dashboard receipts={receipts} />}

                <div className="grid md:grid-cols-[350px_1fr] gap-8 mt-8">
                  <div className="space-y-6">
                    <div className="sticky top-24">
                      <ReceiptUpload onUploadSuccess={addReceipt} />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-800">Histórico de Compras</h2>
                      <span className="text-xs font-semibold text-gray-500 bg-white px-3 py-1 rounded-full border shadow-sm">
                        {receipts.length} notas
                      </span>
                    </div>
                    {receipts.map((receipt) => (
                      <ReceiptCard 
                        key={receipt.id} 
                        receipt={receipt} 
                        onDelete={handleDelete} 
                        onEditItem={setEditingItem}/>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;