import { useState, useEffect } from 'react';
import { useRecipes } from '@/hooks/useRecipes';
import { RecipeCard } from '@/components/RecipeCard';
import { SearchFilters } from '@/components/SearchFilters';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Heart, Utensils } from 'lucide-react';

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
      const response = await fetch('/api/categories');
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
      await fetch(`/api/recipes/${id}/favorite`, {
        method: 'PATCH'
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
        <div className="text-lg">Loading recipes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-red-500 mb-2">Error: {error}</div>
            <Button onClick={refetch}>Try again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {showFavorites ? (
            <>
              <Heart className="h-6 w-6 text-red-500" />
              <h1 className="text-2xl font-bold">Favorite Recipes</h1>
            </>
          ) : (
            <>
              <Utensils className="h-6 w-6" />
              <h1 className="text-2xl font-bold">All Recipes</h1>
            </>
          )}
        </div>
        <Button onClick={onCreateRecipe}>
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
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Utensils className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {showFavorites ? 'No favorite recipes yet' : 'No recipes found'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {showFavorites 
                  ? 'Start adding recipes to your favorites to see them here.'
                  : 'Try adjusting your search or create your first recipe.'
                }
              </p>
              {!showFavorites && (
                <Button onClick={onCreateRecipe}>
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