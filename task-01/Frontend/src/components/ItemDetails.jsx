import React from 'react';

export default function ItemDetails({
  selectedItems,
  onAdd,
  onRemove,
  searchTerm,
  onSearchChange,
  quantity,
  onQuantityChange,
  timerDisplay,
  reservationActive,
  onProceed,
  onClear
}) {
  const total = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-white font-bold mb-4 text-xl">Item Details</h2>
      
      <div className="flex-1 bg-blue-200 rounded p-4 overflow-y-auto mb-4">
        <table className="w-full text-left mb-4">
          <thead className="bg-blue-400 text-white font-bold">
            <tr>
              <th className="p-2 border">Items</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Price LKR</th>
            </tr>
          </thead>
          <tbody>
            {selectedItems.map((item, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                <td className="p-2 border">{item.name}</td>
                <td className="p-2 border">{item.quantity}</td>
                <td className="p-2 border">{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-blue-400 text-white font-bold">
              <td className="p-2 border" colSpan="2">Total</td>
              <td className="p-2 border">{total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="bg-blue-200 p-4 rounded mb-4 flex flex-col gap-3">
        {/* Row 1: Search input centred on its own row */}
        <div className="flex justify-center">
          <input
            type="text"
            placeholder="Search items..."
            className="w-full p-2 rounded border text-sm"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Row 2: item name action buttons */}
        <div className="flex justify-center gap-2">
          <button
            className="bg-slate-800 text-white px-4 py-2 rounded text-sm"
            onClick={() => onSearchChange(searchTerm)}
          >
            Search
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
            onClick={() => onAdd(searchTerm, quantity)}
          >
            Add
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
            onClick={() => onRemove(searchTerm)}
          >
            Remove
          </button>
        </div>

        {/* Row 3: quantity + its own add/remove */}
        <div className="flex justify-center gap-2 items-center">
          <input
            type="number"
            min="1"
            className="w-20 p-2 rounded border text-sm text-center"
            value={quantity}
            onChange={(e) => onQuantityChange(Number(e.target.value))}
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
            onClick={() => onAdd(searchTerm, quantity)}
          >
            Add
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
            onClick={() => onRemove(searchTerm)}
          >
            Remove
          </button>
        </div>
      </div>

      {reservationActive && timerDisplay && (
        <div className="bg-white p-4 rounded mb-4 text-center">
          <p className="text-red-600 font-bold text-lg">Stocks Occupied for {timerDisplay}</p>
        </div>
      )}

      <div className="flex gap-2">
        {onClear && selectedItems.length > 0 && (
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded text-sm transition"
            onClick={onClear}
            title="Cancel & Clear Items"
          >
            Clear / Void
          </button>
        )}
        <button
          className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-4 rounded disabled:opacity-50 transition"
          onClick={onProceed}
          disabled={selectedItems.length === 0}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
