import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  QueryFunctionContext,
} from '@tanstack/react-query';
import {api} from '../../../common/network/api';
import {TProduct} from '../screens/types';

export const useGetProducts = () => {
  const options: UseInfiniteQueryOptions<{results: TProduct[]; next: string}> =
    {
      queryKey: ['productsList'],
      queryFn: ({pageParam = ''}: QueryFunctionContext) =>
        api.getProducts({requestUrl: pageParam as string}),
      select: data => ({
        results: data.pages.flatMap(item => item?.results || []),
        next: data.pages.at(-1)?.next || '',
      }),
      getNextPageParam: lastPage => lastPage.next,
      initialPageParam: '',
    };
  return useInfiniteQuery(options);
};
