import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Utensils, Heart, Plus, LogIn, Info, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { UserMenu } from '@/components/UserMenu';
import { AuthDialog } from '@/components/AuthDialog';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Footer } from '@/components/Footer';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  const { auth } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCreateRecipe = () => {
    if (!auth.isAuthenticated) {
      setShowAuthDialog(true);
    } else {
      onPageChange('create');
    }
    setIsMobileMenuOpen(false);
  };

  const handlePageChange = (page: string) => {
    onPageChange(page);
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    {
      key: 'recipes',
      label: 'All Recipes',
      icon: <Utensils className="h-4 w-4" />,
      show: true
    },
    {
      key: 'favorites',
      label: 'Favorites',
      icon: <Heart className="h-4 w-4" />,
      show: auth.isAuthenticated
    },
    {
      key: 'about',
      label: 'About',
      icon: <Info className="h-4 w-4" />,
      show: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex flex-col">
      <header className="border-b border-white/20 bg-white/10 dark:bg-black/10 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => handlePageChange('recipes')}
            >
              <Utensils className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Recipe Manager
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex gap-2 items-center">
              {navigationItems.filter(item => item.show).map(item => (
                <Button
                  key={item.key}
                  variant={currentPage === item.key ? 'default' : 'ghost'}
                  onClick={() => handlePageChange(item.key)}
                  className="backdrop-blur-sm"
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Button>
              ))}
              
              <Button
                variant={currentPage === 'create' ? 'default' : 'ghost'}
                onClick={handleCreateRecipe}
                className="backdrop-blur-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Recipe
              </Button>
              
              <div className="flex items-center gap-2 ml-2">
                <ThemeToggle />
                {auth.isAuthenticated ? (
                  <UserMenu />
                ) : (
                  <Button 
                    onClick={() => setShowAuthDialog(true)}
                    className="backdrop-blur-sm"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                )}
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pt-4 border-t border-white/20">
              <nav className="flex flex-col space-y-2">
                {navigationItems.filter(item => item.show).map(item => (
                  <Button
                    key={item.key}
                    variant={currentPage === item.key ? 'default' : 'ghost'}
                    onClick={() => handlePageChange(item.key)}
                    className="justify-start backdrop-blur-sm"
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </Button>
                ))}
                
                <Button
                  variant={currentPage === 'create' ? 'default' : 'ghost'}
                  onClick={handleCreateRecipe}
                  className="justify-start backdrop-blur-sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Recipe
                </Button>
                
                {!auth.isAuthenticated && (
                  <Button 
                    onClick={() => {
                      setShowAuthDialog(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="justify-start backdrop-blur-sm"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 flex-1">
        {children}
      </main>
      
      <Footer />
      
      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog} 
      />
    </div>
  );
}