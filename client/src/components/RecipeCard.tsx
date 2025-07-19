import { Recipe } from '@/types/recipe';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Clock, Users, ChefHat } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  onFavoriteToggle: (id: number) => void;
  onView: (id: number) => void;
}

export function RecipeCard({ recipe, onFavoriteToggle, onView }: RecipeCardProps) {
  const handleFavoriteClick = () => {
    onFavoriteToggle(recipe.id);
  };

  const handleViewClick = () => {
    onView(recipe.id);
  };

  return (
    <Card className="h-full hover:scale-[1.02] transition-all duration-300 overflow-hidden group">
      {recipe.image_url && (
        <div className="h-48 overflow-hidden relative">
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {recipe.title}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavoriteClick}
            className="shrink-0 ml-2 hover:scale-110 transition-transform"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                recipe.is_favorite ? 'fill-red-500 text-red-500' : 'hover:text-red-500'
              }`}
            />
          </Button>
        </div>
        {recipe.description && (
          <CardDescription className="line-clamp-2">
            {recipe.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          {recipe.prep_time && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/50 dark:bg-white/10">
              <Clock className="h-3 w-3" />
              <span>{recipe.prep_time}m prep</span>
            </div>
          )}
          {recipe.cook_time && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/50 dark:bg-white/10">
              <ChefHat className="h-3 w-3" />
              <span>{recipe.cook_time}m cook</span>
            </div>
          )}
          {recipe.servings && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/50 dark:bg-white/10">
              <Users className="h-3 w-3" />
              <span>{recipe.servings} servings</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {recipe.category && (
              <span className="px-3 py-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-primary border border-primary/20 rounded-full text-xs font-medium">
                {recipe.category}
              </span>
            )}
            {recipe.difficulty && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                recipe.difficulty === 'Easy' ? 'bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400' :
                recipe.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:text-yellow-400' :
                'bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400'
              }`}>
                {recipe.difficulty}
              </span>
            )}
          </div>
          <Button 
            size="sm" 
            onClick={handleViewClick}
            className="hover:scale-105 transition-transform"
          >
            View Recipe
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}