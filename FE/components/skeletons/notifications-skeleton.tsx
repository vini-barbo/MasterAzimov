import { Suspense, lazy } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { AnimatedSkeleton, LoadingDots } from "@/components/ui/animated-skeleton"
import { useI18n } from "@/lib/i18n"

const LazyNotificationItem = lazy(() =>
  Promise.resolve({
    default: ({ variant = "shimmer" }: { variant?: "shimmer" | "pulse" | "wave" }) => (
      <div className="flex items-start space-x-4 p-4 border rounded-lg">
        <AnimatedSkeleton variant={variant} className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <AnimatedSkeleton variant={variant} className="h-5 w-48" />
            <AnimatedSkeleton variant={variant} className="h-6 w-16" />
          </div>
          <AnimatedSkeleton variant={variant} className="h-4 w-64" />
          <AnimatedSkeleton variant={variant} className="h-4 w-80" />
          <AnimatedSkeleton variant={variant} className="h-3 w-32" />
        </div>
      </div>
    ),
  }),
)

export function NotificationsPageSkeleton() {
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
            <AnimatedSkeleton variant={randomVariant} className="h-8 w-56" />
            <AnimatedSkeleton variant={randomVariant} className="h-4 w-72 mt-2" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LoadingDots />
          <span className="text-sm text-muted-foreground">{t("notifications.loadingAlerts")}</span>
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <AnimatedSkeleton variant={randomVariant} className="h-4 w-28" />
              <AnimatedSkeleton variant={randomVariant} className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <AnimatedSkeleton variant={randomVariant} className="h-8 w-12 mb-2" />
              <AnimatedSkeleton variant={randomVariant} className="h-3 w-36" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Notifications skeleton */}
      <Card>
        <CardHeader>
          <AnimatedSkeleton variant={randomVariant} className="h-6 w-40" />
          <AnimatedSkeleton variant={randomVariant} className="h-4 w-80" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Suspense
              fallback={
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <AnimatedSkeleton key={i} variant="pulse" className="h-20 w-full rounded-lg" />
                  ))}
                </div>
              }
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <LazyNotificationItem key={i} variant={randomVariant} />
              ))}
            </Suspense>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
