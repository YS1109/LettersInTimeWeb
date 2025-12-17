"use client"

import type React from "react"

import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Send } from "lucide-react"
import { DateTimePicker } from "@/components/date-time-picker"
import { RichTextEditor } from "@/components/rich-text-editor"
import { useToast } from "@/hooks/use-toast"

export function MailComposer() {
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [sendDate, setSendDate] = useState<Date>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const formatScheduledTime = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    const seconds = String(date.getSeconds()).padStart(2, "0")
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 验证必填字段
    if (!email.trim()) {
      toast({
        variant: "destructive",
        title: "验证失败",
        description: "请填写收件人邮箱",
      })
      return
    }
    
    if (!subject.trim()) {
      toast({
        variant: "destructive",
        title: "验证失败",
        description: "请填写邮件主题",
      })
      return
    }
    
    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "验证失败",
        description: "请填写邮件内容",
      })
      return
    }
    
    if (!sendDate) {
      toast({
        variant: "destructive",
        title: "验证失败",
        description: "请选择计划发送时间",
      })
      return
    }

    // 验证时间必须晚于当前时间至少 5 分钟
    const now = new Date()
    const minTime = new Date(now.getTime() + 5 * 60 * 1000)
    if (sendDate < minTime) {
      toast({
        variant: "destructive",
        title: "验证失败",
        description: "计划发送时间必须晚于当前时间至少 5 分钟",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const scheduledTime = formatScheduledTime(sendDate)
      const response = await axios.post("/api/scheduledEmails/create", {
        to: email.trim(),
        subject: subject.trim(),
        content: content.trim(),
        scheduledTime,
      })

      if (response.data?.code === 0) {
        toast({
          title: "成功",
          description: "邮件已成功创建，将在指定时间发送",
        })
        // 清空表单
        setEmail("")
        setSubject("")
        setContent("")
        setSendDate(undefined)
      } else {
        toast({
          variant: "destructive",
          title: "创建失败",
          description: response.data?.message || "系统异常，请稍后重试",
        })
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "网络错误，请稍后重试"
      toast({
        variant: "destructive",
        title: "创建失败",
        description: errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 最小日期：当前时间 + 5 分钟
  const minDate = new Date()
  minDate.setMinutes(minDate.getMinutes() + 5)

  const getTextLength = (html: string) => {
    const tmp = document.createElement("div")
    tmp.innerHTML = html
    return tmp.textContent?.length || 0
  }

  return (
    <div className="border border-border rounded-lg shadow-2xl bg-card overflow-hidden">
      <div className="border-b border-border bg-muted/30 px-6 py-4">
        <h2 className="text-lg font-semibold">写信</h2>
      </div>

      <form onSubmit={handleSubmit} className="divide-y divide-border">
        <div className="px-6 py-3 flex items-center gap-4">
          <Label htmlFor="email" className="text-sm font-medium w-20 shrink-0">
            收件人
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-10 flex-1 border-0 focus-visible:ring-0 shadow-none"
          />
        </div>

        <div className="px-6 py-3 flex items-center gap-4">
          <Label htmlFor="subject" className="text-sm font-medium w-20 shrink-0">
            主题
          </Label>
          <Input
            id="subject"
            type="text"
            placeholder="给未来的自己"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="h-10 flex-1 border-0 focus-visible:ring-0 shadow-none"
          />
        </div>

        <div className="px-6 py-3 flex items-center gap-4">
          <Label className="text-sm font-medium w-20 shrink-0">送达时间</Label>
          <DateTimePicker date={sendDate} onDateChange={setSendDate} minDate={minDate} placeholder="选择日期和时间" />
        </div>

        <div className="px-6 py-4">
          <Label htmlFor="content" className="text-sm font-medium block mb-3">
            邮件正文
          </Label>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="亲爱的未来的自己：&#10;&#10;此刻我想对你说..."
          />
          <p className="text-xs text-muted-foreground text-right mt-2">{getTextLength(content)} 字</p>
        </div>

        <div className="px-6 py-4 bg-muted/20 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">邮件将在指定时间准时送达</p>
          <Button type="submit" size="lg" className="h-11 px-8" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                正在寄出...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                发送邮件
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
