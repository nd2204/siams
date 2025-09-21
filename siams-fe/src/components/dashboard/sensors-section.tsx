import { cn } from "@/lib/utils"

export const SensorsSection = () => {
  return (
    <div className={
      cn(
        "*:data-[slot=card]:from-primary/5",
        "*:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card",
        "*:data-[slot=card]:bg-gradient-to-t",
        "grid grid-cols-1 gap-4 px-4",
        "*:data-[slot=card]:shadow-xs",
        "lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4"
      )
    }>
    </div>
  )
}
