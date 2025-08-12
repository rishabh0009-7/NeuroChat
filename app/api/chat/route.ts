import { NextResponse, NextRequest } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { PrismaClient } from "@/app/generated/prisma"
import OpenAi from 'openai'


const prisma = new PrismaClient()
const openai = new OpenAI({
    apikey:process.env.OPENAI_API_KEY,

})

export async function POST(){
    try {
        const {userId } = await auth()
        if(!userId){
            return NextResponse.json({error :"unauthorized"} , {status :401})
        }


        const {message, conversationId , model = "gpt-4o-mini" } = await req.json()

        if(!message){
            return NextResponse.json({error:"message is required  "} , {status :401})
        }


        // get or create a conversation 
        let conversation;
        if(conversationId){
            conversation = await prisma.conversation.findUnique({
                where :{
                    id:conversationId,
                    userId
                },
                include :{messages :{orderBy:{createdAt:'asc' }}}
            })
        }else {
            conversation = await prisma.conversation.create({
                data :{
                    title :message.slice(0,50)+ '....',
                    userId
                },
                include :{messages :true }
            })
        }

        if(!conversation){
            return NextResponse.json({error :'conversation not found '} , {status :401})
        }


        // save  user messages 

        const userMessage = await prisma.message.create ({
            data :{
                content:message,
                role:'user', 
                conversationId :conversation.id,
                model

                
            }
        })


        // prepare conversation context 

        const messages = conversation.messages.map(msg =>({
            role :msg.role as 'user'| 'assistant'|'system', 
            content:msg.content
        }))


        






        
    } catch (error) {
        
    }
}
