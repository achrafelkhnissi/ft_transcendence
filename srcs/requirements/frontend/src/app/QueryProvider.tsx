'use client'

import { useQueryClient, QueryClient , QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState } from "react"

const QueryProvider = ({children}: {children: React.ReactNode}) => {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools/>
        </QueryClientProvider>
    )
}

export default QueryProvider;