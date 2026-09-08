import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';

const Auth: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [cim, setCim] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, user, isMember, isCommissionMember, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      // If user has roles, redirect to home
      if (isMember || isCommissionMember) {
        navigate('/');
      } else {
        // If user has no roles, redirect to pending approval
        navigate('/pending-approval');
      }
    }
  }, [user, isMember, isCommissionMember, loading, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(cim, password);
      if (error) {
        const errorMessage =
          error.message === 'Invalid login credentials'
            ? 'CIM ou senha incorretos'
            : error.message;

        toast({
          title: 'Erro no login',
          description: errorMessage,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Login realizado com sucesso!',
          description: 'Bem-vindo de volta, Irmão.',
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: 'Erro inesperado',
        description: 'Tente novamente em alguns instantes.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-2xl">⬜</span>
          </div>
          <CardTitle className="text-2xl font-bold text-primary">Área Restrita</CardTitle>
          <CardDescription>
            Acesso exclusivo para membros da Ordem
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cim">CIM</Label>
              <Input
                id="cim"
                type="text"
                inputMode="numeric"
                placeholder="000000"
                value={cim}
                onChange={(e) => setCim(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="font-mono tracking-widest"
                autoFocus
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signin-password">Senha</Label>
              <div className="relative">
                <Input
                  id="signin-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-gradient-primary" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Entrar
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Esqueceu sua senha? Procure a Secretaria da Loja.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
