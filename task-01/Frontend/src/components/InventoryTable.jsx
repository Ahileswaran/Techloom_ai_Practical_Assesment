export default function InventoryTable({ products = [] }) {
  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <div className="overflow-x-auto rounded">
      <table className="w-full text-left bg-blue-200">
        <thead className="bg-blue-400 text-white font-bold">
          <tr>
            <th className="p-2 border">Items</th>
            <th className="p-2 border">Stock</th>
            <th className="p-2 border">Price LKR</th>
          </tr>
        </thead>
        <tbody>
          {safeProducts.length === 0 ? (
            <tr>
              <td colSpan="3" className="p-4 text-center text-gray-600 bg-white">
                Loading inventory...
              </td>
            </tr>
          ) : (
            safeProducts.map((p, index) => {
              const qty = Number(p.stock_quantity) || 0;
              const price = Number(p.price) || 0;
              return (
                <tr key={p.product_id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                  <td className="p-2 border">{p.name}</td>
                  <td className={`p-2 border font-bold ${qty <= 5 ? 'text-red-600' : 'text-gray-800'}`}>
                    {qty}
                  </td>
                  <td className="p-2 border">{price.toFixed(2)}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
