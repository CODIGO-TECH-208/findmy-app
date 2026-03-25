import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import notFoundIllustration from "@/assets/not_found_illustration_png_1774455184133.png";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="relative mx-auto w-64 h-64 md:w-80 md:h-80">
          <img 
            src={notFoundIllustration} 
            alt="Page not found illustration" 
            className="w-full h-full object-contain"
          />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Lost your way?
          </h1>
          <p className="text-lg text-muted-foreground max-w-xs mx-auto">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button asChild variant="default" size="lg" className="rounded-full px-8 h-12 gap-2 w-full sm:w-auto">
            <Link to="/"><Home className="h-4 w-4" /> Go Home</Link>
          </Button>
          <Button onClick={() => window.history.back()} variant="outline" size="lg" className="rounded-full px-8 h-12 gap-2 w-full sm:w-auto">
            <ArrowLeft className="h-4 w-4" /> Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
