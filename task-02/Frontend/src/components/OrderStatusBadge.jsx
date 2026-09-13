import React from 'react';

function OrderStatusBadge({ status }) {
  let colorClass = 'bg-gray-400';
  
  switch(status.toLowerCase()) {
    case 'paid':
      colorClass = 'bg-green-500';
      break;
    case 'pending':
      colorClass = 'bg-yellow-400';
      break;
    case 'cancelled':
      colorClass = 'bg-red-500';
      break;
    case 'expired':
      colorClass = 'bg-gray-400';
      break;
    case 'failed':
      colorClass = 'bg-orange-500';
      break;
    default:
      break;
  }

  return (
    <span className={`${colorClass} px-2 py-1 rounded text-white text-sm font-bold`}>
      {status}
    </span>
  );
}

export default OrderStatusBadge;
