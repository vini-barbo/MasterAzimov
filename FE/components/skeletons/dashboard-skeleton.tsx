import { Suspense, lazy } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { AnimatedSkeleton, LoadingDots } from "@/components/ui/animated-skeleton"
import { useI18n } from "@/lib/i18n"

const LazyProductRankingItem = lazy(() =>
  Promise.resolve({
    default: ({ variant = "shimmer" }: { variant?: "shimmer" | "pulse" | "wave" }) => (
      <div className="flex items-center space-x-4">
        <AnimatedSkeleton variant={variant} className="h-8 w-8 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <AnimatedSkeleton variant={variant} className="h-5 w-48" />
              <AnimatedSkeleton variant={variant} className="h-4 w-24 mt-1" />
            </div>
            <div className="flex items-center space-x-2">
              <AnimatedSkeleton variant={variant} className="h-4 w-4" />
              <AnimatedSkeleton variant={variant} className="h-6 w-16" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <AnimatedSkeleton variant={variant} className="h-4 w-16 mb-1" />
              <AnimatedSkeleton variant={variant} className="h-4 w-20" />
            </div>
            <div>
              <AnimatedSkeleton variant={variant} className="h-4 w-12 mb-1" />
              <AnimatedSkeleton variant={variant} className="h-4 w-16" />
            </div>
            <div>
              <AnimatedSkeleton variant={variant} className="h-4 w-20 mb-1" />
              <AnimatedSkeleton variant={variant} className="h-4 w-16" />
            </div>
          </div>
          <AnimatedSkeleton variant={variant} className="h-2 w-full" />
        </div>
      </div>
    ),
  }),
)

export function DashboardPageSkeleton() {
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
            <AnimatedSkeleton variant={randomVariant} className="h-8 w-52" />
            <AnimatedSkeleton variant={randomVariant} className="h-4 w-80 mt-2" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LoadingDots />
          <span className="text-sm text-muted-foreground">{t("dashboard.loadingDashboard")}</span>
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <AnimatedSkeleton variant={randomVariant} className="h-4 w-24" />
              <AnimatedSkeleton variant={randomVariant} className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <AnimatedSkeleton variant={randomVariant} className="h-8 w-20 mb-2" />
              <AnimatedSkeleton variant={randomVariant} className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Products ranking skeleton */}
      <Card>
        <CardHeader>
          <AnimatedSkeleton variant={randomVariant} className="h-6 w-64" />
          <AnimatedSkeleton variant={randomVariant} className="h-4 w-96" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Suspense
              fallback={
                <div className="space-y-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <AnimatedSkeleton key={i} variant="pulse" className="h-24 w-full rounded-lg" />
                  ))}
                </div>
              }
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <LazyProductRankingItem key={i} variant={randomVariant} />
              ))}
            </Suspense>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
