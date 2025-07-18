import { useState, useEffect } from 'react';
import { Recipe } from '@/types/recipe';

interface UseRecipesParams {
  search?: string;
  category?: string;
  difficulty?: string;
  favorites?: boolean;
}

export function useRecipes(params: UseRecipesParams = {}) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const searchParams = new URLSearchParams();
      if (params.search) searchParams.append('search', params.search);
      if (params.category) searchParams.append('category', params.category);
      if (params.difficulty) searchParams.append('difficulty', params.difficulty);
      if (params.favorites) searchParams.append('favorites', 'true');
      
      const response = await fetch(`/api/recipes?${searchParams}`);
      if (!response.ok) throw new Error('Failed to fetch recipes');
      
      const data = await response.json();
      setRecipes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [params.search, params.category, params.difficulty, params.favorites]);

  return { recipes, loading, error, refetch: fetchRecipes };
}