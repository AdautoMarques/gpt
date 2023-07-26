/* eslint-disable react/jsx-key */

"use client"
import axios from "axios"
import { useState  } from "react"
import * as z from "zod"
import  {zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,

} from "@/components/ui/form"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChatCompletionRequestMessage } from "openai"
import { BrainCircuit, UserSquare2 } from "lucide-react"




const formSchema = z.object({
  message:z.string().min(10, {
    message: "O mínimo de caracteres na pergunta é de 10 para ser enviado"
  })
})


export default function Home() {

  const [ messages, setMessages] = useState<ChatCompletionRequestMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    }
  })

  async function onSubmit(values:z.infer<typeof formSchema>) {
    setIsLoading(true)

    const message: ChatCompletionRequestMessage = {
      role: "user",
      content: values.message
    }

    const messagesInContext = [...messages, message]

    try{
      const response = await axios.post("/api/ai/conversation",{
        messagens: messagesInContext,
      });
      setMessages((current) => [...current, message, response.data])

    }catch(err){
      console.error("OPEN_AI_FRONTEND_ERROR:", err); 
    }
    setIsLoading(false)
    form.reset()
  
  }
  return (


    <div className="container mt-4 pt-4 h-full">

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField control={form.control} name="message" render={({field}) => (
            <FormItem>
              <FormLabel>Ask for Advice</FormLabel>
              <FormControl>
                <Input placeholder="como calcular a area do triangulo?" disabled={isLoading} {...field}/>
              </FormControl>
              <FormDescription>Inform the message.</FormDescription>
              <Button type="submit" className="md:w-56" disabled={isLoading}>Ask</Button>
            </FormItem>
          )}/>
        </form>
      </Form>
      
      <div className="flex flex-col-reverse mt-4 space-y-2">
            <div className="flex items-center justify-center">
              {
                isLoading && (
                  <BrainCircuit className="container h-36 w-36 animate-pulse" />
                )
              }
            </div>
            <div className="container">
              {
                messages.map((message) =>(
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {message.role === "assistant" &&  (<BrainCircuit className="w-8 h-8"/>)}
                        {message.role === "user" &&  (<UserSquare2 className="w-8 h-8"/>)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{message.content}</p>
                    </CardContent>
                    <CardFooter>
                      <p>{message.role}</p>
                    </CardFooter>
                  </Card>
               
                
                  
                ))
              }
            </div>
            
            </div>
      </div>
    
  )
}




