export interface Recipe {
  id: number;
  title: string;
  description: string | null;
  ingredients: string;
  instructions: string;
  prep_time: number | null;
  cook_time: number | null;
  servings: number | null;
  difficulty: 'Easy' | 'Medium' | 'Hard' | null;
  category: string | null;
  image_url: string | null;
  is_favorite: number;
  user_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  email: string;
  password_hash: string | null;
  name: string;
  google_id: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface DatabaseSchema {
  recipes: Recipe;
  users: User;
}