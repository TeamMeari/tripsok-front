import { useState, useCallback } from "react"
import axios from '../utils/axios'

interface ApiResponse<T> {
  data: T | null;
  status: number;
  error: Error | null;
}

export function useApi() {
  const [isLoading, setIsLoading] = useState(false)

  const apiCall = useCallback(async <T>(url: string, method: string, data?: any): Promise<ApiResponse<T>> => {
    setIsLoading(true)
    try {
      const response = await axios.request({
        method,
        url,
        data
      })
      return {
        data: response.data,
        status: response.status,
        error: null
      }
    } catch (err: any) {
      return {
        data: null,
        status: err.response.status,
        error: err
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { apiCall, isLoading }
}