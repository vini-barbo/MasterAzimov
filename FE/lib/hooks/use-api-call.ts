import { useState, useEffect } from 'react'
import api from '../api'
import { HttpError } from '../services/http-client'

interface UseApiOptions<T> {
  immediate?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

interface UseApiReturn<T> {
  data: T | null
  loading: boolean
  error: Error | null
  execute: () => Promise<void>
  reset: () => void
}

/**
 * Custom hook for API calls with loading, error, and success states
 * 
 * @param apiCall - Function that returns a Promise with the API call
 * @param options - Configuration options
 * @returns Object with data, loading, error states and control functions
 * 
 * @example
 * ```tsx
 * // Basic usage
 * const { data: users, loading, error } = useApiCall(() => api.users.getAll())
 * 
 * // With options
 * const { data, loading, execute } = useApiCall(
 *   () => api.products.getById(productId),
 *   {
 *     immediate: false,
 *     onSuccess: (product) => console.log('Product loaded:', product),
 *     onError: (error) => toast.error(error.message)
 *   }
 * )
 * ```
 */
export function useApiCall<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const { immediate = true, onSuccess, onError } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await apiCall()
      setData(result)

      if (onSuccess) {
        onSuccess(result)
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)

      if (onError) {
        onError(error)
      }
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setData(null)
    setError(null)
    setLoading(false)
  }

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    data,
    loading,
    error,
    execute,
    reset
  }
}

/**
 * Hook for mutations (create, update, delete operations)
 * 
 * @example
 * ```tsx
 * const { mutate: createUser, loading } = useMutation(
 *   (userData) => api.users.create(userData),
 *   {
 *     onSuccess: () => {
 *       toast.success('User created successfully')
 *       refetchUsers()
 *     }
 *   }
 * )
 * ```
 */
export function useMutation<TData, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: UseApiOptions<TData> = {}
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<TData | null>(null)

  const mutate = async (variables: TVariables) => {
    try {
      setLoading(true)
      setError(null)

      const result = await mutationFn(variables)
      setData(result)

      if (options.onSuccess) {
        options.onSuccess(result)
      }

      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)

      if (options.onError) {
        options.onError(error)
      }

      throw error
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setData(null)
    setError(null)
    setLoading(false)
  }

  return {
    mutate,
    data,
    loading,
    error,
    reset
  }
}

/**
 * Hook to handle HTTP errors with user-friendly messages
 */
export function useErrorHandler() {
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof HttpError) {
      switch (error.status) {
        case 400:
          return 'Dados inválidos. Verifique as informações e tente novamente.'
        case 401:
          return 'Sessão expirada. Faça login novamente.'
        case 403:
          return 'Você não tem permissão para realizar esta ação.'
        case 404:
          return 'Recurso não encontrado.'
        case 409:
          return 'Conflito de dados. O recurso já existe.'
        case 422:
          return 'Dados de entrada inválidos.'
        case 429:
          return 'Muitas tentativas. Tente novamente mais tarde.'
        case 500:
          return 'Erro interno do servidor. Tente novamente mais tarde.'
        case 503:
          return 'Serviço temporariamente indisponível.'
        default:
          return error.message || 'Erro desconhecido'
      }
    }

    if (error instanceof Error) {
      return error.message
    }

    return 'Erro desconhecido'
  }

  return { getErrorMessage }
}
