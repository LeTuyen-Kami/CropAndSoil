import { useCallback, useEffect, useState, useMemo } from "react";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { PaginatedResponse, PaginationRequests } from "../types";

type FetchFunction<T, P = Record<string, any>> = (
  params: PaginationRequests & P
) => Promise<PaginatedResponse<T>>;

interface UsePaginationOptions<T, P = Record<string, any>>
  extends Omit<
    UseQueryOptions<PaginatedResponse<T>, Error, PaginatedResponse<T>>,
    "queryKey" | "queryFn"
  > {
  initialParams?: P;
  initialPagination?: Partial<PaginationRequests>;
  queryKey: string | string[];
}

export function usePagination<T, P = Record<string, any>>(
  fetchFunction: FetchFunction<T, P>,
  options: UsePaginationOptions<T, P>
) {
  const {
    initialParams = {} as P,
    initialPagination = { skip: 0, take: 10 },
    queryKey,
    ...queryOptions
  } = options;

  // State for additional pages data
  const [additionalPagesData, setAdditionalPagesData] = useState<T[]>([]);
  const [currentParams, setCurrentParams] = useState<P>(initialParams);
  const [isRefresh, setIsRefresh] = useState(false);

  // Calculate effective pagination parameters
  const effectivePagination = useMemo<PaginationRequests>(
    () => ({
      skip: initialPagination.skip ?? 0,
      take: initialPagination.take ?? 10,
    }),
    [initialPagination.skip, initialPagination.take]
  );

  // Create query key with pagination and filter params
  const effectiveQueryKey = useMemo(() => {
    return Array.isArray(queryKey)
      ? [...queryKey, effectivePagination, currentParams]
      : [queryKey, effectivePagination, currentParams];
  }, [queryKey, effectivePagination, currentParams]);

  // React Query for first page
  const {
    data: firstPageData,
    isLoading,
    isFetching,
    refetch,
  } = useQuery<PaginatedResponse<T>, Error>({
    queryKey: effectiveQueryKey,
    queryFn: useCallback(
      () => fetchFunction({ ...effectivePagination, ...currentParams }),
      [fetchFunction, effectivePagination, currentParams]
    ),
    ...queryOptions,
  });

  // Reset additional pages when first page is refreshed or params change
  useEffect(() => {
    setAdditionalPagesData([]);
  }, [currentParams, firstPageData?.skip, firstPageData?.take]);

  // Combined data from all pages
  const combinedData = useMemo(
    () =>
      firstPageData ? [...firstPageData.data, ...additionalPagesData] : [],
    [firstPageData, additionalPagesData]
  );

  // Total number of items
  const total = useMemo(() => {
    return firstPageData?.total ?? 0;
  }, [firstPageData]);

  // Check if there's a next page
  const hasNextPage = useMemo(
    () =>
      firstPageData
        ? firstPageData.skip + firstPageData.take + additionalPagesData.length <
          firstPageData.total
        : false,
    [firstPageData, additionalPagesData.length]
  );

  // Fetch next page
  const fetchNextPage = useCallback(async () => {
    if (!hasNextPage || !firstPageData) return;

    const nextPageParams: PaginationRequests = {
      skip:
        firstPageData.skip + firstPageData.take + additionalPagesData.length,
      take: firstPageData.take,
    };

    try {
      const nextPageData = await fetchFunction({
        ...nextPageParams,
        ...currentParams,
      });

      setAdditionalPagesData((prev) => [...prev, ...nextPageData.data]);
    } catch (error) {
      console.error("Error fetching next page:", error);
    }
  }, [
    firstPageData,
    additionalPagesData.length,
    hasNextPage,
    currentParams,
    fetchFunction,
  ]);

  // Refresh function
  const refresh = useCallback(async () => {
    setIsRefresh(true);
    setAdditionalPagesData([]);
    await refetch();
    setIsRefresh(false);
  }, [refetch]);

  // Update filters/search params
  const updateParams = useCallback((newParams: Partial<P>) => {
    setCurrentParams((prev) => ({ ...prev, ...newParams }));
  }, []);

  const forceUpdateParams = useCallback((newParams: Partial<P>) => {
    setCurrentParams(newParams as P);
  }, []);

  const resetParams = useCallback(() => {
    setCurrentParams(initialParams);
  }, [initialParams]);

  const returnValue = useMemo(
    () => ({
      data: combinedData,
      paginationData: firstPageData,
      total,
      isLoading,
      isFetching,
      isRefresh,
      hasNextPage,
      fetchNextPage,
      refresh,
      updateParams,
      resetParams,
      forceUpdateParams,
    }),
    [
      combinedData,
      firstPageData,
      isLoading,
      isFetching,
      isRefresh,
      hasNextPage,
      fetchNextPage,
      refresh,
      updateParams,
      total,
      resetParams,
      forceUpdateParams,
    ]
  );

  return returnValue;
}
