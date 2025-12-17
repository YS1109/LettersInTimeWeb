import { Clock } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-semibold">慢邮时光</span>
        </div>
        <nav className="flex items-center gap-6">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {"关于"}
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {"我的邮件"}
          </a>
        </nav>
      </div>
    </header>
  )
}
