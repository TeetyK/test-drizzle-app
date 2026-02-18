import { db } from '@/db'
import { users } from '@/db/schema'
import {eq} from 'drizzle-orm'

interface CreateUserRequest {
    name:string,
    email:string
}
interface UpdateUserBody{
    name?:string,
    email?:string
}
export async function GET(request:Request,{params}:{params:{ id:string}}){
    try{
        const id = parseInt(params.id)
        // const allUsers = await db.select().from(users)
        const [user] = await db.select().from(users).where(eq(users.id,id)).limit(1)
        if (!user){
            return Response.json({error:'User not found'},{status:404})
        }
        // return Response.json(allUsers)
        return Response.json(user)
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
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body: UpdateUserBody = await request.json()
    const { name, email } = body

    if (!name && !email) {
      return Response.json(
        { error: 'Name or email is required for update' },
        { status: 400 }
      )
    }

    const updateData: { name?: string; email?: string } = {}
    if (name) updateData.name = name
    if (email) updateData.email = email

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning()
    if (!updatedUser) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }
    return Response.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning()

    if (!deletedUser) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    return Response.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}