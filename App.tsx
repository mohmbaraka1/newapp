import { Route, Switch } from "wouter";
import Home from "./Home";
import Auth from "./Auth";
import Dashboard from "./Dashboard";
import { useAuthContext } from "./AuthContext";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

function PrivateRoute({ component: Component }: { component: React.ComponentType }) {
  const { isLoggedIn, loading } = useAuthContext();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      setLocation("/login");
    }
  }, [isLoggedIn, loading]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  if (!isLoggedIn) return null;

  return <Component />;
}

export default function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Auth} />
      <Route path="/register" component={Auth} />
      <Route path="/dashboard">
        {() => <PrivateRoute component={Dashboard} />}
      </Route>
      <Route>
        <div className="min-h-screen flex items-center justify-center text-foreground">
          <div className="text-center">
            <div className="text-6xl mb-4">404</div>
            <p className="text-muted-foreground">الصفحة غير موجودة</p>
          </div>
        </div>
      </Route>
    </Switch>
  );
}