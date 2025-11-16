import { GalleryVerticalEnd } from "lucide-react"
import { Outlet } from "react-router"
import { GradFlow } from 'gradflow'
import { FieldDescription } from "@/components/ui/field"
import { useTheme } from "@/hooks/use-theme"

export default function AuthLayout() {
  const { theme } = useTheme()

  return (
    <div className="relative h-screen">
      <GradFlow className="absolute z-0"
        config={theme === "light" ? {
          color1: { r: 184, g: 187, b: 38 },
          color2: { r: 235, g: 219, b: 178 },
          color3: { r: 184, g: 187, b: 38 },
          speed: 0.6,
          scale: 2.4,
          type: 'animated',
          noise: 0.13
        } : {
          color1: { r: 27, g: 27, b: 27 },
          color2: { r: 27, g: 27, b: 27 },
          color3: { r: 184, g: 187, b: 38 },
          speed: 0.7,
          scale: 1,
          type: 'stripe',
          noise: 0.07
        }}
      />
      <main className="absolute inset-0 z-10">
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
          <div className="flex w-full max-w-sm flex-col gap-6">
            <a href="#" className="flex items-center gap-2 self-center text-xl font-bold">
              <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-4" />
              </div>
              SIAMS
            </a>
            <Outlet />
            <FieldDescription className="px-6 text-center">
              By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
              and <a href="#">Privacy Policy</a>.
            </FieldDescription>
          </div>
        </div>
      </main>
    </div>
  )
}
