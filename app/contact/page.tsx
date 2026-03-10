"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"


import { toast } from "@/components/ui/toast"
// Success example
toast.success("Logged in successfully!")

// Error example
toast.error("Something went wrong")


/* ---------------- SCHEMA ---------------- */

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

type ContactFormValues = z.infer<typeof contactSchema>

/* ---------------- COMPONENT ---------------- */

export default function ContactForm() {
  const [loading, setLoading] = React.useState(false)

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  async function onSubmit(_: ContactFormValues) {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    alert("Message sent (mock)")
    form.reset()
  }

  return (
    <main className="flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
          <CardDescription>
            Send us a message and we’ll get back to you
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" {...form.register("email")} />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Subject</Label>
              <Input {...form.register("subject")} />
              {form.formState.errors.subject && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.subject.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea rows={5} {...form.register("message")} />
              {form.formState.errors.message && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.message.message}
                </p>
              )}
            </div>

            <Button className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
