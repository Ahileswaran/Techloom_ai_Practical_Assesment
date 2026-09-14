export default function SlipPreview({ items = [], storeName = 'AROMEX' }) {
  const safeItems = Array.isArray(items) ? items : [];
  const subtotal = safeItems.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  return (
    <div className="bg-white p-6 rounded shadow-md font-mono text-sm text-gray-800 h-full overflow-y-auto">
      <div className="text-center font-bold text-xl mb-1">{storeName}</div>
      <div className="text-center mb-4 text-xs">
        No. 42, Galle Road, Colombo 03, Sri Lanka<br />
        {new Date().toLocaleString()}
      </div>
      
      <hr className="border-t-2 border-dashed border-gray-400 mb-4" />
      
      {safeItems.map((item, idx) => (
        <div key={idx} className="flex justify-between mb-1">
          <span>{item.quantity}x {item.name}</span>
          <span>{((Number(item.price) || 0) * (Number(item.quantity) || 1)).toFixed(2)}</span>
        </div>
      ))}
      
      <hr className="border-t-2 border-dashed border-gray-400 my-4" />
      
      <div className="flex justify-end gap-4 mb-1">
        <span className="font-bold">AMT</span>
        <span>{subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-end gap-4 mb-1">
        <span className="font-bold">SUBTOTAL</span>
        <span>{subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-end gap-4 mb-1">
        <span className="font-bold">TAX (5%)</span>
        <span>{tax.toFixed(2)}</span>
      </div>
      <div className="flex justify-end gap-4 mt-2">
        <span className="font-bold text-lg">BALANCE</span>
        <span className="font-bold text-lg">{total.toFixed(2)}</span>
      </div>
      
      <div className="mt-8 flex justify-center items-center gap-1">
        {/* Simple barcode simulation */}
        {[...Array(20)].map((_, i) => (
          <div key={i} className="bg-black" style={{
            width: `${Math.max(1, Math.random() * 4)}px`,
            height: '40px'
          }}></div>
        ))}
      </div>
    </div>
  );
}
