import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import { Route, Router, Switch } from "wouter";

// Get base path from Vite config
const basePath = import.meta.env.BASE_URL || "/";

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router base={basePath}>
        <Switch>
          <Route path="/" component={Home} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </TooltipProvider>
  );
}

export default App;
