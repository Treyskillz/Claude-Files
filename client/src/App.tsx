import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import { AppShell } from "./components/AppShell";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Account from "./pages/Account";
import AdminDashboard from "./pages/AdminDashboard";
import Generator from "./pages/Generator";
import Home from "./pages/Home";
import Instructions from "./pages/Instructions";
import Library from "./pages/Library";
import Marketplace from "./pages/Marketplace";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import Success from "./pages/Success";
import Upload from "./pages/Upload";

function Router() {
  return (
    <AppShell>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/generator" component={Generator} />
        <Route path="/instructions" component={Instructions} />
        <Route path="/library" component={Library} />
        <Route path="/upload" component={Upload} />
        <Route path="/marketplace" component={Marketplace} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/account" component={Account} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/success" component={Success} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </AppShell>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
