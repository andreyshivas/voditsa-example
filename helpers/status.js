const getStatusText = (status) => {
  if (status === 'pending') {
    return 'В обработке';
  };
  if (status === 'accepted') {
    return 'Принят';
  };
  if (status === 'payment') {
    return 'В ожидании оплаты';
  };
  if (status === 'payed') {
    return 'Оплачен';
  };
  if (status === 'sent') {
    return 'Оправлен';
  };
  if (status === 'done') {
    return 'Завершен';
  };
  if (status === 'returned') {
    return 'Возвращен';
  };
  if (status === 'canceled') {
    return 'Отменен';
  };
}

const getPaymethodText = (paymethod) => {
  if (paymethod === 'наличными') {
    return 'Наличными при получении';
  };
  if (paymethod === 'картой') {
    return 'Картой при получении';
  };
  if (paymethod === 'онлайн') {
    return 'Картой онлайн';
  };
}

export { getStatusText, getPaymethodText };
