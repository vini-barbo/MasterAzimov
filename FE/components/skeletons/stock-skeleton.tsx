import { Suspense, lazy } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { AnimatedSkeleton, LoadingDots } from "@/components/ui/animated-skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useI18n } from "@/lib/i18n"

// Lazy load skeleton components for better performance
const LazySkeletonCard = lazy(() =>
  Promise.resolve({
    default: ({ variant = "shimmer" }: { variant?: "shimmer" | "pulse" | "wave" }) => (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <AnimatedSkeleton variant={variant} className="h-4 w-24" />
          <AnimatedSkeleton variant={variant} className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <AnimatedSkeleton variant={variant} className="h-8 w-16 mb-2" />
          <AnimatedSkeleton variant={variant} className="h-3 w-32" />
        </CardContent>
      </Card>
    ),
  }),
)

const LazyTableSkeleton = lazy(() =>
  Promise.resolve({
    default: ({ variant = "shimmer" }: { variant?: "shimmer" | "pulse" | "wave" }) => (
      <Table>
        <TableHeader>
          <TableRow>
            {["SKU", "Produto", "Armazém", "Estoque Atual", "Estoque Mínimo", "Status"].map((header, i) => (
              <TableHead key={i}>
                <AnimatedSkeleton variant={variant} className="h-4 w-16" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 6 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <AnimatedSkeleton variant={variant} className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <AnimatedSkeleton variant={variant} className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <AnimatedSkeleton variant={variant} className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <AnimatedSkeleton variant={variant} className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <AnimatedSkeleton variant={variant} className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <AnimatedSkeleton variant={variant} className="h-6 w-16" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    ),
  }),
)

export function StockPageSkeleton() {
  const { t } = useI18n()
  const skeletonVariants: ("shimmer" | "pulse" | "wave")[] = ["shimmer", "pulse", "wave"]
  const randomVariant = skeletonVariants[Math.floor(Math.random() * skeletonVariants.length)]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <AnimatedSkeleton variant={randomVariant} className="h-6 w-6" />
          <div>
            <AnimatedSkeleton variant={randomVariant} className="h-8 w-48" />
            <AnimatedSkeleton variant={randomVariant} className="h-4 w-64 mt-2" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LoadingDots />
          <span className="text-sm text-muted-foreground">{t("stock.loadingStock")}</span>
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="grid gap-4 md:grid-cols-3">
        <Suspense fallback={<div className="h-24 bg-muted animate-pulse rounded-lg" />}>
          {Array.from({ length: 3 }).map((_, i) => (
            <LazySkeletonCard key={i} variant={randomVariant} />
          ))}
        </Suspense>
      </div>

      {/* Table skeleton */}
      <Card>
        <CardHeader>
          <AnimatedSkeleton variant={randomVariant} className="h-6 w-48" />
          <AnimatedSkeleton variant={randomVariant} className="h-4 w-96" />
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <AnimatedSkeleton key={i} variant="pulse" className="h-12 w-full" />
                ))}
              </div>
            }
          >
            <LazyTableSkeleton variant={randomVariant} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
