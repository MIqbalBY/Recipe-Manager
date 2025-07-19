import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Utensils, Heart, Users, Shield, Zap, Globe } from 'lucide-react';

export function AboutPage() {
  const features = [
    {
      icon: <Utensils className="h-6 w-6" />,
      title: 'Recipe Management',
      description: 'Create, edit, and organize your favorite recipes with ease.'
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: 'Favorites System',
      description: 'Save your most loved recipes for quick access anytime.'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'User Authentication',
      description: 'Secure login with support for Google OAuth integration.'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Private & Public',
      description: 'Keep recipes private or share them with the community.'
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Fast Search',
      description: 'Quickly find recipes by title, ingredients, or category.'
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: 'Responsive Design',
      description: 'Beautiful experience on both desktop and mobile devices.'
    }
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          About Recipe Manager
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Your personal culinary companion for discovering, creating, and sharing amazing recipes.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Our Mission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Recipe Manager is designed to make cooking more enjoyable and organized. Whether you're a 
            professional chef or a home cooking enthusiast, our platform provides all the tools you need 
            to store, organize, and share your culinary creations.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            We believe that great recipes should be preserved, shared, and celebrated. Our intuitive 
            interface makes it easy to capture every detail of your favorite dishes, from preparation 
            time to cooking instructions, ensuring that no delicious memory is ever lost.
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:scale-105 transition-transform duration-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Technology Stack</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Frontend</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• React 18 with TypeScript</li>
                <li>• Tailwind CSS for styling</li>
                <li>• Vite for fast development</li>
                <li>• Shadcn/ui component library</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Backend</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Node.js with Express</li>
                <li>• SQLite database</li>
                <li>• Kysely query builder</li>
                <li>• JWT authentication</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Get Started</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Ready to start your culinary journey? Create an account to begin organizing your recipes, 
            or browse our collection of community recipes for inspiration. With Recipe Manager, 
            every meal becomes an opportunity to create something special.
          </p>
          <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">Easy to Use</span>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">Secure</span>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">Fast</span>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">Responsive</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}