import { MailComposer } from "@/components/mail-composer"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 md:py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 space-y-3">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-balance">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Letters to Tomorrow
              </span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              此刻的心情，未来的惊喜。让时间为你传递那些珍贵的记忆与期许
            </p>
          </div>
          <MailComposer />
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}

