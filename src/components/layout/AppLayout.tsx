import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Link } from 'react-router-dom';
import {
  Shield,
  Settings,
  Home,
  BookOpen,
  Inbox,
  Beer,
  GraduationCap,
  Crown,
  DollarSign,
  FileText,
  ClipboardList,
  HeartHandshake,
  Gauge,
  MoreVertical,
  LogOut,
  User,
  Bell,
  Triangle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { user, fullName, isMember, isCommissionMember, signOut } = useAuth();
  const { unreadCount } = useUnreadMessages();

  const firstName = fullName?.split(' ')[0] || user?.email?.split('@')[0] || 'Usuário';
  const isActive = (path: string) => location.pathname === path;

  // Menu Items
  const publicNavItems = [
    { href: '/', label: 'Início', icon: Home },
    { href: '/about', label: 'Sobre Nós', icon: BookOpen },
    { href: '/activities', label: 'Atividades', icon: Shield },
    { href: '/events', label: 'Eventos', icon: Bell },
    { href: '/contact', label: 'Contato', icon: MoreVertical },
  ];

  const memberNavItems = [
    { href: '/members/messages', label: 'Caixa Postal', icon: Inbox, badge: unreadCount },
    { href: '/members/agenda', label: "Copo D'água", icon: Beer },
    { href: '/members/study-time', label: 'Tempo de Estudos', icon: GraduationCap },
    { href: '/education', label: 'Acervos', icon: BookOpen },
    { href: '/members/worshipful-masters', label: 'Quadro de Veneráveis', icon: Crown },
  ];

  const commissionPortalItems = [
    { href: '/commission/crud', label: 'Cadastros', icon: Settings },
    { href: '/commission/messages', label: 'Mensagens', icon: Bell },
    { href: '/commission/study-time', label: 'Tempo de Estudos', icon: GraduationCap },
  ];

  const commissionDiretivoItems = [
    { href: '/commission/finance', label: 'Tesouraria', icon: DollarSign },
    { href: '/commission/chancellery', label: 'Chancelaria', icon: FileText },
    { href: '/commission/secretary', label: 'Secretaria', icon: ClipboardList },
    { href: '/commission/hospitalaria', label: 'Hospitalaria', icon: HeartHandshake },
    { href: '/commission/management', label: 'Gestão Veneravel', icon: Gauge },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
              <Triangle className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-primary">Amor da Pátria</span>
              <span className="text-xs text-muted-foreground">Loja Maçônica</span>
            </div>
          </Link>
        </SidebarHeader>

        <SidebarContent className="px-2">
          <SidebarMenu>
            {/* Public Navigation */}
            <div className="mb-4">
              <div className="text-xs font-semibold text-muted-foreground mb-2 px-2">Menu</div>
              {publicNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    className={isActive(item.href) ? 'bg-accent' : ''}
                  >
                    <Link to={item.href} className="flex gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </div>

            {/* Member Navigation */}
            {isMember && (
              <div className="mb-4">
                <Collapsible defaultOpen className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="data-[state=open]:bg-accent">
                        <Shield className="h-4 w-4" />
                        <span>Área dos Irmãos</span>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {memberNavItems.map((item) => (
                          <SidebarMenuSubItem key={item.href}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActive(item.href)}
                              className={isActive(item.href) ? 'bg-accent' : ''}
                            >
                              <Link to={item.href} className="flex gap-2 justify-between">
                                <div className="flex gap-2">
                                  <item.icon className="h-4 w-4" />
                                  <span>{item.label}</span>
                                </div>
                                {item.badge && item.badge > 0 && (
                                  <Badge variant="destructive" className="text-xs">
                                    {item.badge}
                                  </Badge>
                                )}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              </div>
            )}

            {/* Commission Navigation */}
            {isCommissionMember && (
              <div className="mb-4">
                <Collapsible defaultOpen className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="data-[state=open]:bg-accent">
                        <Settings className="h-4 w-4" />
                        <span>Área Restrita</span>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {/* Portal Section */}
                        <div className="px-2 py-2">
                          <div className="text-xs font-semibold text-muted-foreground mb-2">Portal</div>
                        </div>
                        {commissionPortalItems.map((item) => (
                          <SidebarMenuSubItem key={item.href}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActive(item.href)}
                              className={isActive(item.href) ? 'bg-accent' : ''}
                            >
                              <Link to={item.href} className="flex gap-2">
                                <item.icon className="h-4 w-4" />
                                <span>{item.label}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}

                        {/* Corpo Diretivo Section */}
                        <div className="px-2 py-2 mt-2 border-t">
                          <div className="text-xs font-semibold text-muted-foreground mb-2">Corpo Diretivo</div>
                        </div>
                        {commissionDiretivoItems.map((item) => (
                          <SidebarMenuSubItem key={item.href}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActive(item.href)}
                              className={isActive(item.href) ? 'bg-accent' : ''}
                            >
                              <Link to={item.href} className="flex gap-2">
                                <item.icon className="h-4 w-4" />
                                <span>{item.label}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              </div>
            )}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex items-center justify-between gap-2 px-2 py-2">
                <ThemeToggle />
                {user && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <User className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <div className="px-2 py-1.5 text-xs font-semibold">{firstName}</div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="flex gap-2">
                          <User className="h-4 w-4" />
                          <span>Perfil</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={signOut} className="text-destructive">
                        <LogOut className="h-4 w-4 mr-2" />
                        <span>Sair</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex-1" />
        </header>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

AppLayout.displayName = 'AppLayout';
