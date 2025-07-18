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
    <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
      {recipe.image_url && (
        <div className="h-48 overflow-hidden">
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2">{recipe.title}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavoriteClick}
            className="shrink-0 ml-2"
          >
            <Heart
              className={`h-4 w-4 ${
                recipe.is_favorite ? 'fill-red-500 text-red-500' : ''
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
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{recipe.prep_time}m prep</span>
            </div>
          )}
          {recipe.cook_time && (
            <div className="flex items-center gap-1">
              <ChefHat className="h-3 w-3" />
              <span>{recipe.cook_time}m cook</span>
            </div>
          )}
          {recipe.servings && (
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{recipe.servings} servings</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {recipe.category && (
              <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs">
                {recipe.category}
              </span>
            )}
            {recipe.difficulty && (
              <span className={`px-2 py-1 rounded-md text-xs ${
                recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {recipe.difficulty}
              </span>
            )}
          </div>
          <Button size="sm" onClick={handleViewClick}>
            View Recipe
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}