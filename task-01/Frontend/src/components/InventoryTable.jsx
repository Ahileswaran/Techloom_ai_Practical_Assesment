export default function InventoryTable({ products }) {
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
          {products.map((p, index) => (
            <tr key={p.product_id} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
              <td className="p-2 border">{p.name}</td>
              <td className={`p-2 border font-bold ${p.stock_quantity <= 5 ? 'text-red-600' : 'text-gray-800'}`}>
                {p.stock_quantity}
              </td>
              <td className="p-2 border">{p.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
