// นำเข้า db object ที่เชื่อมต่อกับฐานข้อมูล และ schema ของตาราง posts
import { db } from '@/db'
import { posts ,users} from '@/db/schema'
import { eq } from 'drizzle-orm'
interface CreatePostRequest {
  title: string  
  content: string 
  userId: number 
}

export async function POST(request: Request) {
  try {
    const body: CreatePostRequest = await request.json()
    const { title, content, userId } = body 

    if (!title || !content || !userId) {
      return Response.json(
        { error: 'Title, content, and userId are required' },
        { status: 400 }
      )
    }
    const [newPost] = await db.insert(posts).values({ title, content, userId }).returning()
    return Response.json(newPost, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
export async function GET(
  request: Request, 
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    const [result] = await db
      .select({
        post: posts, 
        user: {     
          id: users.id,  
          name: users.name, 
          email: users.email, 
        },
      })
      .from(posts)  
      .leftJoin(users, eq(posts.userId, users.id)) 
      .where(eq(posts.id, id)) 
      .limit(1)

    if (!result) {
      return Response.json({ error: 'Post not found' }, { status: 404 })  // ส่ง response แจ้งว่าไม่พบ post
    }
    return Response.json(result)
  } catch (error) {
    console.error('Error fetching post:', error)

    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}