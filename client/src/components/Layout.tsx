import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Utensils, Heart, Plus, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { UserMenu } from '@/components/UserMenu';
import { AuthDialog } from '@/components/AuthDialog';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  const { auth } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleCreateRecipe = () => {
    if (!auth.isAuthenticated) {
      setShowAuthDialog(true);
    } else {
      onPageChange('create');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Utensils className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Recipe Manager</h1>
            </div>
            <nav className="flex gap-2 items-center">
              <Button
                variant={currentPage === 'recipes' ? 'default' : 'ghost'}
                onClick={() => onPageChange('recipes')}
              >
                <Utensils className="h-4 w-4 mr-2" />
                All Recipes
              </Button>
              {auth.isAuthenticated && (
                <Button
                  variant={currentPage === 'favorites' ? 'default' : 'ghost'}
                  onClick={() => onPageChange('favorites')}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Favorites
                </Button>
              )}
              <Button
                variant={currentPage === 'create' ? 'default' : 'ghost'}
                onClick={handleCreateRecipe}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Recipe
              </Button>
              
              {auth.isAuthenticated ? (
                <UserMenu />
              ) : (
                <Button onClick={() => setShowAuthDialog(true)}>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              )}
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      
      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog} 
      />
    </div>
  );
}