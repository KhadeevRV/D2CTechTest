import AxiosMockAdapter from 'axios-mock-adapter';
import {api, axios} from './api';
import {TProduct} from '../../features/Products/screens/types';

const mock = new AxiosMockAdapter(axios, {delayResponse: 2000});

// Функция для создания массива объектов
const createProductsArray = ({
  count,
  initialNumber,
}: {
  count: number;
  initialNumber: number;
}): TProduct[] => {
  // Создаем массив заданной длины и заполняем его undefined
  return new Array(count).fill(null).map((_, index) => ({
    id: initialNumber + index + 1, // Уникальный ID (начинается с 1)
    name: `Товар-${initialNumber + index + 1}`, // Название товара
    // price: Math.floor(Math.random() * (1000)), // Случайная цена
    price: 200 + initialNumber + index, // Цена
    count: 1,
    description: `Описание товара-${initialNumber + index + 1}. Текст может быть любым`, // Описание товара
  }));
};

export const initMocks = () => {
  mock
    .onGet(new RegExp(`${api.apiUrl}/api/get-products/?(.+)$`))
    .reply(config => {
      const url = config.url;
      const pageNumberStr = url?.includes('page=') ? url.split('page=')[1] : '';
      const pageNum = Number(pageNumberStr);
      if (isNaN(pageNum)) {
        return [400, {error: 'Invalid page number'}];
      }
      return [
        200,
        {
          results: createProductsArray({
            count: 100,
            initialNumber: 100 * (pageNum - 1),
          }),
          next: url?.split('page=')[0] + `page=${pageNum + 1}`,
        },
      ];
    });
  mock.onPost(`${api.apiUrl}/api/buy-products/`).reply(config => {
    const data = JSON.parse(config.data);
    if (data?.errorType === 'service') {
      return [502, {message: 'Сервер недоступен'}];
    }
    if (data?.errorType === 'stock') {
      return [409, {message: 'Товара нет на складе'}];
    }
    if (data?.price < 1000) {
      return [400, {message: 'Минимальная сумма покупки - 1000р'}];
    }
    return [
      200,
      {
        status: 'success',
      },
    ];
  });
};
