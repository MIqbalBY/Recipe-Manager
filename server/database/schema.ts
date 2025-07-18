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
  created_at: string;
  updated_at: string;
}

export interface DatabaseSchema {
  recipes: Recipe;
}