import { useQuery } from "@tanstack/react-query"
import { useState, useCallback } from "react"
import axios from '../utils/axios'

interface ApiResponse<T> {
  data: T | null;
  status: number;
  error: Error | null;
}

// GET 요청용 useQuery 훅
export function useApiQuery<T>(
  queryKey: (string | number)[],
  url: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    cacheTime?: number;
    retry?: number;
    isStatic?: boolean; // 정적 데이터 여부
  }
) {
  // 정적 데이터인 경우 더 긴 캐시 시간 설정
  const defaultStaleTime = options?.isStatic ? 60 * 60 * 1000 : 5 * 60 * 1000; // 1시간,  5분
  const defaultGcTime = options?.isStatic ? 24 * 60 * 60 * 1000 : 10 * 60 * 1000; // 24시간, 10분

  return useQuery({
    queryKey,
    queryFn: async (): Promise<T> => {
      const response = await axios.get(url)
      return response.data
    },
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? defaultStaleTime,
    gcTime: options?.cacheTime ?? defaultGcTime,
    retry: options?.retry ?? 3,
  })
}

// 정적 데이터용 편의 훅
export function useStaticApiQuery<T>(
  queryKey: (string | number)[],
  url: string,
  options?: {
    enabled?: boolean;
    retry?: number;
  }
) {
  return useApiQuery<T>(queryKey, url, {
    ...options,
    isStatic: true,
  })
}

// 기존 useApi와 호환성을 위한 래퍼 (POST/PUT/DELETE 요청용)
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
        data: err.response?.data || null,
        status: err.response?.status || 500,
        error: err
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { apiCall, isLoading }
}