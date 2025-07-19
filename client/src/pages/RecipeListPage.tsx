import { useState, useEffect } from 'react';
import { useRecipes } from '@/hooks/useRecipes';
import { RecipeCard } from '@/components/RecipeCard';
import { SearchFilters } from '@/components/SearchFilters';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Heart, Utensils, Sparkles } from 'lucide-react';

interface RecipeListPageProps {
  onCreateRecipe: () => void;
  onViewRecipe: (id: number) => void;
  showFavorites?: boolean;
}

export function RecipeListPage({ onCreateRecipe, onViewRecipe, showFavorites }: RecipeListPageProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  
  const { recipes, loading, error, refetch } = useRecipes({
    search,
    category,
    difficulty,
    favorites: showFavorites
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('/api/categories', { headers });
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleFavoriteToggle = async (id: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      await fetch(`/api/recipes/${id}/favorite`, {
        method: 'PATCH',
        headers
      });
      refetch();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setDifficulty('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent"></div>
          <div className="text-lg text-gray-600 dark:text-gray-300">Loading delicious recipes...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
              Error: {error}
            </div>
            <Button onClick={refetch} className="hover:scale-[1.02] transition-transform">
              Try again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          {showFavorites ? (
            <>
              <div className="p-2 rounded-xl bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20">
                <Heart className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  Favorite Recipes
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Your most loved culinary creations</p>
              </div>
            </>
          ) : (
            <>
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                <Utensils className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  All Recipes
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Discover amazing culinary adventures</p>
              </div>
            </>
          )}
        </div>
        <Button 
          onClick={onCreateRecipe}
          className="hover:scale-[1.05] transition-all shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Recipe
        </Button>
      </div>

      <SearchFilters
        search={search}
        category={category}
        difficulty={difficulty}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onDifficultyChange={setDifficulty}
        onClear={handleClearFilters}
        categories={categories}
      />

      {recipes.length === 0 ? (
        <Card className="hover:shadow-2xl transition-all duration-300">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="mb-6 relative">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 flex items-center justify-center">
                  {showFavorites ? (
                    <Heart className="h-12 w-12 text-red-500" />
                  ) : (
                    <Utensils className="h-12 w-12 text-primary" />
                  )}
                </div>
                <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                {showFavorites ? 'No favorite recipes yet' : 'No recipes found'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                {showFavorites 
                  ? 'Start adding recipes to your favorites to see them here. Every great dish deserves a special place!'
                  : 'Try adjusting your search or create your first recipe. Your culinary journey starts here!'
                }
              </p>
              {!showFavorites && (
                <Button 
                  onClick={onCreateRecipe}
                  className="hover:scale-[1.05] transition-all shadow-lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Recipe
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onFavoriteToggle={handleFavoriteToggle}
              onView={onViewRecipe}
            />
          ))}
        </div>
      )}
    </div>
  );
}