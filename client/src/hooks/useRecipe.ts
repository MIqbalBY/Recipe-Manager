import { useState, useEffect } from 'react';
import { Recipe } from '@/types/recipe';

export function useRecipe(id: number | string) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`/api/recipes/${id}`, { headers });
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Recipe not found');
        }
        throw new Error('Failed to fetch recipe');
      }
      
      const data = await response.json();
      setRecipe(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRecipe();
    }
  }, [id]);

  return { recipe, loading, error, refetch: fetchRecipe };
}