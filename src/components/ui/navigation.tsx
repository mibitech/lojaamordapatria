import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { User, LogOut, Shield, Book, Users, Calendar, Crown, Menu, X, Triangle, GraduationCap, Settings, FileText, DollarSign, ClipboardList, Briefcase, BookOpen, Inbox, Lightbulb, Beer, MessageSquare, Bell, HeartHandshake, Gauge } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
export const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    fullName,
    isMember,
    isCommissionMember,
    signOut,
    loading
  } = useAuth();
  const {
    unreadCount
  } = useUnreadMessages();
  const [isOpen, setIsOpen] = useState(false);
  const hasAnyRole = isMember || isCommissionMember;

  // Extrair primeiro nome
  const firstName = fullName?.split(' ')[0] || user?.email?.split('@')[0] || 'Usuário';
  const isActive = (path: string) => location.pathname === path;
  const publicNavItems = [{
    href: '/',
    label: 'Início'
  }, {
    href: '/about',
    label: 'Sobre Nós'
  }, {
    href: '/activities',
    label: 'Atividades'
  }, {
    href: '/events',
    label: 'Eventos'
  }, {
    href: '/contact',
    label: 'Contato'
  }];
  const memberNavItems = [{
    href: '/members/messages',
    label: 'Caixa Postal',
    icon: Inbox
  }, {
    href: '/members/agenda',
    label: 'Copo D\'água',
    icon: Beer
  }, {
    href: '/members/study-time',
    label: 'Tempo de Estudos',
    icon: GraduationCap
  }, {
    href: '/education',
    label: 'Acervos',
    icon: BookOpen
  }, {
    href: '/members/worshipful-masters',
    label: 'Quadro de Veneráveis',
    icon: Crown
  }];
  const commissionPortalItems = [{
    href: '/commission/crud',
    label: 'Cadastros',
    icon: Settings
  }, {
    href: '/commission/messages',
    label: 'Mensagens',
    icon: MessageSquare
  }, {
    href: '/commission/study-time',
    label: 'Tempo de Estudos',
    icon: GraduationCap
  }];

  const commissionDiretivoItems = [{
    href: '/commission/finance',
    label: 'Tesouraria',
    icon: DollarSign
  }, {
    href: '/commission/chancellery',
    label: 'Chancelaria',
    icon: FileText
  }, {
    href: '/commission/secretary',
    label: 'Secretaria',
    icon: ClipboardList
  }, {
    href: '/commission/hospitalaria',
    label: 'Hospitalaria',
    icon: HeartHandshake
  }, {
    href: '/commission/management',
    label: 'Gestão Veneravel',
    icon: Gauge
  }];

  // Don't render anything while loading
  if (loading) {
    return <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b border-border shadow-soft">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
                <Triangle className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-primary">Loja Maçonica</span>
                <span className="text-sm text-muted-foreground">Amor da Pátria</span>
              </div>
            </Link>
          </div>
        </div>
      </nav>;
  }
  return <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
              <Triangle className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-bold text-xl text-primary">Amor da Pátria </span>
              <span className="text-sm text-muted-foreground">Loja Maçonica</span>
            </div>
            <div className="flex sm:hidden flex-col items-center">
              <span className="font-bold text-lg text-primary">Loja Maçonica</span>
              <span className="text-xs text-muted-foreground">Amor da Pátria</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {publicNavItems.map(item => <Link key={item.href} to={item.href}>
                <Button variant={isActive(item.href) ? "default" : "ghost"} size="sm" className="transition-smooth">
                  {item.label}
                </Button>
              </Link>)}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center space-x-2">
            <ThemeToggle />
            {user ? <>
                {/* Member Navigation - Only show when user is a member */}
                {isMember && <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Shield className="w-4 h-4 mr-1" />
                        Área dos Irmãos
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-background border shadow-lg">
                      {memberNavItems.map(item => <DropdownMenuItem key={item.href} onClick={() => navigate(item.href)}>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              <item.icon className="w-4 h-4 mr-2" />
                              {item.label}
                            </div>
                            {item.href === '/members/messages' && unreadCount > 0 && <div className="flex items-center gap-1">
                                <Bell className="w-4 h-4" />
                                <span className="bg-destructive text-destructive-foreground text-xs rounded-full px-2 py-0.5">
                                  {unreadCount}
                                </span>
                              </div>}
                          </div>
                        </DropdownMenuItem>)}
                    </DropdownMenuContent>
                  </DropdownMenu>}

                 {/* Commission Navigation - Only show when user is a commission member */}
                  {isCommissionMember && <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4 mr-1" />
                          Área Restrita
                        </Button>
                      </DropdownMenuTrigger>
                     <DropdownMenuContent align="end" className="w-48 bg-background border shadow-lg">
                       <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Portal</div>
                       {commissionPortalItems.map(item => <DropdownMenuItem key={item.href} onClick={() => navigate(item.href)}>
                           <div className="flex items-center">
                             <item.icon className="w-4 h-4 mr-2" />
                             {item.label}
                           </div>
                         </DropdownMenuItem>)}
                       <DropdownMenuSeparator />
                       <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Corpo Diretivo</div>
                       {commissionDiretivoItems.map(item => <DropdownMenuItem key={item.href} onClick={() => navigate(item.href)}>
                           <div className="flex items-center">
                             <item.icon className="w-4 h-4 mr-2" />
                             {item.label}
                           </div>
                         </DropdownMenuItem>)}
                     </DropdownMenuContent>
                   </DropdownMenu>}

                {/* User Menu */}
                {hasAnyRole ? <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <User className="w-4 h-4 mr-1" />
                        {firstName}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-background border shadow-lg">
                      <DropdownMenuItem onClick={() => navigate('/profile')}>
                        <User className="w-4 h-4 mr-2" />
                        Perfil
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={signOut}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Sair
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu> : <Button variant="ghost" size="sm" onClick={signOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </Button>}
              </> : <Link to="/auth">
                <Button size="sm" className="bg-gradient-primary hover:opacity-90 transition-smooth">
                  Entrar
                </Button>
              </Link>}
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden flex items-center gap-1">
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-background overflow-y-auto max-h-screen">
                <SheetHeader>
                  <SheetTitle className="text-left">Menu</SheetTitle>
                  <SheetDescription className="text-left">
                    Navegue pelas seções do site
                  </SheetDescription>
                </SheetHeader>
                
                <div className="mt-6 space-y-4">
                  {/* Public Navigation */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-muted-foreground">Navegação</h3>
                    {publicNavItems.map(item => <Link key={item.href} to={item.href} onClick={() => setIsOpen(false)}>
                        <Button variant={isActive(item.href) ? "default" : "ghost"} className="w-full justify-start">
                          {item.label}
                        </Button>
                      </Link>)}
                  </div>

                  {/* Member Navigation - Only show when user is a member */}
                  {isMember && <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-muted-foreground">Área dos Irmãos</h3>
                      {memberNavItems.map(item => <Link key={item.href} to={item.href} onClick={() => setIsOpen(false)}>
                          <Button variant={isActive(item.href) ? "default" : "ghost"} className="w-full justify-between">
                            <div className="flex items-center">
                              <item.icon className="w-4 h-4 mr-2" />
                              {item.label}
                            </div>
                            {item.href === '/members/messages' && unreadCount > 0 && <div className="flex items-center gap-1">
                                <Bell className="w-4 h-4" />
                                <span className="bg-destructive text-destructive-foreground text-xs rounded-full px-2 py-0.5">
                                  {unreadCount}
                                </span>
                              </div>}
                          </Button>
                        </Link>)}
                    </div>}

                   {/* Commission Navigation - Only show when user is a commission member */}
                    {isCommissionMember && <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-muted-foreground">Área Restrita — Portal</h3>
                        {commissionPortalItems.map(item => <Link key={item.href} to={item.href} onClick={() => setIsOpen(false)}>
                           <Button variant={isActive(item.href) ? "default" : "ghost"} className="w-full justify-start">
                             <item.icon className="w-4 h-4 mr-2" />
                             {item.label}
                           </Button>
                         </Link>)}
                        <div className="border-t border-border my-2" />
                        <h3 className="text-sm font-semibold text-muted-foreground">Corpo Diretivo</h3>
                        {commissionDiretivoItems.map(item => <Link key={item.href} to={item.href} onClick={() => setIsOpen(false)}>
                           <Button variant={isActive(item.href) ? "default" : "ghost"} className="w-full justify-start">
                             <item.icon className="w-4 h-4 mr-2" />
                             {item.label}
                           </Button>
                         </Link>)}
                     </div>}

                   {/* Auth Section */}
                  <div className="space-y-2 pt-4 border-t">
                    {user ? <>
                        {hasAnyRole && <>
                            <h3 className="text-sm font-semibold text-muted-foreground">Conta</h3>
                            <Link to="/profile" onClick={() => setIsOpen(false)}>
                              <Button variant="ghost" className="w-full justify-start">
                                <User className="w-4 h-4 mr-2" />
                                Perfil
                              </Button>
                            </Link>
                          </>}
                        <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive" onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}>
                          <LogOut className="w-4 h-4 mr-2" />
                          Sair
                        </Button>
                      </> : <Link to="/auth" onClick={() => setIsOpen(false)}>
                        <Button className="w-full bg-gradient-primary hover:opacity-90">
                          Entrar
                        </Button>
                      </Link>}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>;
};