import { ShoppingBag, Calendar, DollarSign, Trash2 } from 'lucide-react';

const ReceiptCard = ({ receipt, onDelete, onEditItem }) => {
  const formattedDate = new Date(receipt.date).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all hover:shadow-xl group">
      
      <div className="bg-brand-600 p-4 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              {receipt.supermarketName}
            </h3>
            <p className="text-brand-100 text-sm flex items-center gap-1 mt-1">
              <Calendar className="w-3 h-3" /> {formattedDate}
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            
            <button 
              onClick={() => onDelete(receipt.id)}
              className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors opacity-100 md:opacity-0 group-hover:opacity-100"
              title="Excluir nota"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="text-right">
              <p className="text-xs text-brand-200 uppercase tracking-wider">Total</p>
              <p className="text-2xl font-bold flex items-center">
                <span className="text-lg mr-1">R$</span>
                {receipt.totalAmount?.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-0">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 font-medium">Produto</th>
              <th className="px-4 py-3 font-medium text-center">Qtd</th>
              <th className="px-4 py-3 font-medium text-right">Preço</th>
            </tr>
          </thead>
  
          <tbody className="divide-y divide-gray-100">
            {receipt.items.map((item) => (
              <tr 
                key={item.id} 
                // Permite clicar em qualquer parte da linha para editar o item
                onClick={() => onEditItem(item)}
                className="hover:bg-blue-50 transition-colors cursor-pointer group"
                title="Clique para editar"
              >
                <td className="px-4 py-3 relative">
                  {/* Indicador visual de edição */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <p className="font-medium text-gray-800 group-hover:text-brand-700 transition-colors">
                    {item.productName}
                  </p>
                
                  <div className="flex gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase">
                      {item.category}
                    </span>
                    {item.subCategory && (
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] uppercase">
                        {item.subCategory}
                        </span>
                    )}
                  </div>
                </td>

                <td className="px-4 py-3 text-center text-gray-500">
                  {item.quantity} <span className="text-xs">{item.unit}</span>
                </td>
                <td className="px-4 py-3 text-right font-medium text-gray-800">
                  R$ {item.totalPrice?.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="bg-gray-50 p-3 text-center border-t border-gray-100 text-xs text-gray-400">
        Processado por Gemini AI • ID: {receipt.id}
      </div>
    </div>
  );
};

export default ReceiptCard;