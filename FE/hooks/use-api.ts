"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useI18n } from "@/lib/i18n"

interface UseApiOptions {
  autoFetch?: boolean
  onError?: (error: Error) => void
}

export function useApi<T>(fetchFn: () => Promise<T>, options: UseApiOptions = {}) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()
  const { t } = useI18n()

  const { autoFetch = true, onError } = options

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Simular delay de rede
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

      // Simular erro ocasional (10% de chance)
      if (Math.random() < 0.1) {
        throw new Error("Erro de conexão com o servidor")
      }

      const result = await fetchFn()
      setData(result)
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Erro desconhecido")
      setError(error)

      toast({
        variant: "destructive",
        title: t("error.loadingData"),
        description: error.message,
        action: (
          <button
            onClick={() => fetchData()}
            className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            {t("common.tryAgain")}
          </button>
        ),
      })

      onError?.(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoFetch) {
      fetchData()
    }
  }, [])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  }
}
