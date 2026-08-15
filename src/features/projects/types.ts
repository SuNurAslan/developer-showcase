export interface Project {
  id: string
  title: string
  description: string
  github_url?: string
  demo_url?: string
  image_url?: string
  user_id: string
  profiles?: {
    username?: string
    full_name?: string
    avatar_url?: string
  }
}