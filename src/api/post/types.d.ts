
export type User = {
  id: number
  name: string
  email?: string
  role?: string
}


export type Comment = {
  id: number
  postId: number
  userId: number
  user: User
  content: string
}

export type Reaction = {
  id: number
  postId: number
  userId: number
  type: string 
}


export type Post = {
  id: number
  userId: number
  user: User
  title: string
  content: string
  image?: string
  createdAt?: string
  comments: Comment[]
  reactions: Reaction[]
}


export type CreatePostDTO = {
  title: string
  content: string
  image?: string
}

