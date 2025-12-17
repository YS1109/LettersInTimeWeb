"use client"

import { Bold, Italic, Underline, List, ListOrdered, LinkIcon, Undo, Redo } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({ value = "", onChange, placeholder, className }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML && value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    updateContent()
  }

  const updateContent = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const addLink = () => {
    const url = prompt("请输入链接地址：")
    if (url) {
      execCommand("createLink", url)
    }
  }

  const toolbarButtons = [
    { icon: Bold, command: "bold", label: "粗体" },
    { icon: Italic, command: "italic", label: "斜体" },
    { icon: Underline, command: "underline", label: "下划线" },
    { icon: List, command: "insertUnorderedList", label: "无序列表" },
    { icon: ListOrdered, command: "insertOrderedList", label: "有序列表" },
    { icon: LinkIcon, command: "link", label: "插入链接", onClick: addLink },
    { icon: Undo, command: "undo", label: "撤销" },
    { icon: Redo, command: "redo", label: "重做" },
  ]

  return (
    <div
      className={cn(
        "border border-border rounded-lg overflow-hidden bg-card",
        isFocused && "ring-2 ring-primary/20",
        className,
      )}
    >
      <div className="border-b border-border bg-muted/20 p-2 flex flex-wrap gap-1">
        {toolbarButtons.map((btn) => (
          <Button
            key={btn.command}
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
            onClick={() => (btn.onClick ? btn.onClick() : execCommand(btn.command))}
            title={btn.label}
          >
            <btn.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={updateContent}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "min-h-[400px] px-6 py-4 outline-none text-base leading-relaxed",
          "prose prose-slate dark:prose-invert max-w-none",
          "prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-1",
          "prose-a:text-primary prose-a:underline",
          !editorRef.current?.textContent &&
            "before:content-[attr(data-placeholder)] before:text-muted-foreground before:pointer-events-none",
        )}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
    </div>
  )
}
