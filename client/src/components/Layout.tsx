import { Button } from '@/components/ui/button';
import { Utensils, Heart, Plus } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Utensils className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Recipe Manager</h1>
            </div>
            <nav className="flex gap-2">
              <Button
                variant={currentPage === 'recipes' ? 'default' : 'ghost'}
                onClick={() => onPageChange('recipes')}
              >
                <Utensils className="h-4 w-4 mr-2" />
                All Recipes
              </Button>
              <Button
                variant={currentPage === 'favorites' ? 'default' : 'ghost'}
                onClick={() => onPageChange('favorites')}
              >
                <Heart className="h-4 w-4 mr-2" />
                Favorites
              </Button>
              <Button
                variant={currentPage === 'create' ? 'default' : 'ghost'}
                onClick={() => onPageChange('create')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Recipe
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}