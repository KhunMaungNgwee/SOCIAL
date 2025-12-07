
export type AuthorDTO = {
  id: number
  name: string
}


export type PostResponseDTO = {
  id: number
  title: string
  content: string
  image?: string
  createdAt?: string 
  author: AuthorDTO
  commentCount: number
  reactionCount: number
}


export type CreateCommentDTO = {
  content: string
}


export type ReactionRequestDTO = {
  type: string 
}

export type ReactionResponseDTO = {
  liked: boolean
  count: number
}

export type User = {
  id: number
  name: string
  email?: string
  role?: string
}

export type Post = {
  id: number
  title: string
  content: string
  image?: string
  createdAt?: string
  author: User
  commentCount: number
  reactionCount: number
}

// Comment entity
export type Comment = {
  id: number
  postId: number
  post: Post
  userId: number
  user: User
  content: string
}
