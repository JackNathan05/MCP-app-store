import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Mail, Lock, UserPlus, LogIn, google } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading } = useSupabaseAuth();

  React.useEffect(() => {
    if (!loading && user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    let errorMsg;

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) errorMsg = error.message;
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) errorMsg = error.message;
    }

    if (errorMsg) {
      toast({
        title: "Auth error",
        description: errorMsg,
        variant: "destructive"
      });
    } else {
      toast({
        title: isSignUp ? "Signed up!" : "Logged in!",
        description: isSignUp ? "Check your email for confirmation if required." : "Welcome back!",
      });
    }
    setBusy(false);
  };

  const handleGoogle = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      toast({
        title: "Google sign in failed",
        description: error.message,
        variant: "destructive"
      });
    }
    setBusy(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-background px-4">
      <div className="w-full max-w-md border rounded-xl p-8 bg-card shadow-md space-y-6">
        <h2 className="text-2xl font-bold mb-2 text-center">{isSignUp ? "Create an Account" : "Login"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Email"
              type="email"
              disabled={busy}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <Input
              placeholder="Password"
              type="password"
              disabled={busy}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={isSignUp ? "new-password" : "current-password"}
            />
          </div>
          <Button type="submit" className="w-full mt-2" disabled={busy}>
            {busy ? <Loader2 className="animate-spin h-4 w-4" /> : isSignUp ? <><UserPlus className="mr-2 h-4"/> Sign Up</> : <><LogIn className="mr-2 h-4"/>Login</>}
          </Button>
        </form>
        <div className="flex items-center gap-3">
          <div className="h-px bg-border flex-1" />
          <span className="text-xs font-medium text-muted-foreground">or</span>
          <div className="h-px bg-border flex-1" />
        </div>
        <Button
          variant="outline"
          className="w-full flex items-center gap-2"
          onClick={handleGoogle}
          disabled={busy}
        >
          <google className="h-5 w-5" /> Continue with Google
        </Button>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
          </span>
          <button
            className="font-medium underline ml-2 text-primary"
            type="button"
            onClick={() => setIsSignUp((s) => !s)}
            disabled={busy}
          >
            {isSignUp ? "Login" : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
