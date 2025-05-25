import { apiSlice } from './api/apiSlice'
import type { CartLine } from '@/types'

export const cartApi = apiSlice.injectEndpoints({
  endpoints: build => ({
    // ── 1) read
    getCart: build.query<CartLine[], void>({
      query: () => '/cart',
      providesTags: ['Cart'],
    }),

    // ── 2) add
    addToCart: build.mutation<void, { courseId: string }>({
      query: body => ({
        url: '/cart',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Cart'],
    }),

    // ── 3) remove
    removeItem: build.mutation<void, string>({
      query: courseId => ({
        url: `/cart/${courseId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),

    // ── 4) checkout
    checkout: build.mutation<
      { id: string; paid: number; count: number },
      void
    >({
      query: () => ({
        url: '/orders/checkout',
        method: 'POST',
        
      }),
      invalidatesTags: ['Cart'],
    }),
  }),

  overrideExisting: false,
})

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveItemMutation,
  useCheckoutMutation,
} = cartApi
