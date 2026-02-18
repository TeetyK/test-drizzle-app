import { db } from '@/db'
import { users } from '@/db/schema'

interface CreateUserRequest {
    name:string,
    email:string
}
export async function GET(){
    try{
        const allUsers = await db.select().from(users)
        return Response.json(allUsers)
    }catch(error){
        console.error("Error fetching users :", error)
        return Response.json({error : "Internal Server Error"},{ status:500})
    }
}

export async function POST(request:Request){
    try{
        const body: CreateUserRequest = await request.json();
        const { name , email } = body
        if(!name || !email){
            return Response.json(
                {error:'Name and email are required.'},
                {status:400}
            )
        }
        const newUser = await db.insert(users).values({name , email}).returning()
        return Response.json(newUser[0], {status:201})
    }catch(error){
        console.log('Error creating user:',error)
        return Response.json({error:'Internal Server Error'},{status:500})
    }
}