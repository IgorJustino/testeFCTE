"use client"

import { Package, ShoppingBag, Heart, MessageCircle, Plus, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { useEffect, useState } from "react"
import { apiClient, type Product } from "@/lib/api"
export default function DashboardPage() {
  const { user, isLoggedIn } = useAuth()
  const [myProducts, setMyProducts] = useState<Product[]>([])
  const [recentMessages, setRecentMessages] = useState<any[]>([])
  const [stats, setStats] = useState({
    activeListings: 0,
    totalSales: 0,
    favorites: 0,
    messages: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      // Load user's products
      const response = await apiClient.getProducts() as { results: Product[] }
      const userProducts = response.results.filter(
        (product: Product) => product.seller_username === user?.username
      )
      setMyProducts(userProducts)
      
      // Update stats
      setStats(prev => ({
        ...prev,
        activeListings: userProducts.length,
        totalSales: 0, // TODO: implement sales tracking
        favorites: 0, // TODO: implement favorites
        messages: 0, // TODO: implement messaging
      }))
      
      // TODO: Load real messages when messaging system is complete
      setRecentMessages([])
      
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isLoggedIn || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Restrito</h1>
          <p className="text-muted-foreground mb-4">Você precisa fazer login para acessar o dashboard.</p>
          <Button asChild>
            <Link href="/entrar">Fazer Login</Link>
          </Button>
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-8 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary-foreground">
                <AvatarImage src="/student-avatar.png" alt={user.first_name} />
                <AvatarFallback>{user.first_name?.charAt(0) || user.username.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">Olá, {user.first_name || user.username}</h1>
                <p className="text-primary-foreground/80">Bem-vindo ao seu dashboard</p>
              </div>
            </div>
            <Button asChild className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              <Link href="/dashboard/novo-produto">
                <Plus className="h-5 w-5 mr-2" />
                Novo Produto
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 px-4 bg-muted">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Anúncios Ativos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeListings}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSales}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Favoritos</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.favorites}</div>
              </CardContent>
            </Card>

            <Link href="/mensagens" className="block">
              <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Mensagens</CardTitle>
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.messages}</div>
                  {stats.messages > 0 && <Badge className="mt-1 bg-secondary">Novas</Badge>}
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 py-8 px-4">
        <div className="container mx-auto">
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList>
              <TabsTrigger value="products">Meus Produtos</TabsTrigger>
              <TabsTrigger value="messages">Mensagens</TabsTrigger>
              <TabsTrigger value="favorites">Favoritos</TabsTrigger>
              <TabsTrigger value="profile">Perfil</TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Meus Anúncios</h2>
                <Button asChild variant="outline">
                  <Link href="/dashboard/novo-produto">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Produto
                  </Link>
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProducts.map((product) => (
                  <Card key={product.id}>
                    <CardContent className="p-4 space-y-4">
                      <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                        <img
                          src={product.images?.[0] || "/placeholder.svg"}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold line-clamp-1">{product.title}</h3>
                          <Badge variant="default">
                            Ativo
                          </Badge>
                        </div>
                        <p className="text-xl font-bold text-primary">R$ {product.price.toFixed(2)}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <TrendingUp className="h-4 w-4" />
                          <span>{product.views} visualizações</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button asChild variant="outline" className="flex-1 bg-transparent" size="sm">
                          <Link href={`/marketplace/${product.id}`}>Ver</Link>
                        </Button>
                        <Button variant="outline" className="flex-1 bg-transparent" size="sm">
                          Editar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="messages" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Mensagens</h2>
                <Button asChild className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  <Link href="/mensagens">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Ver Todas
                  </Link>
                </Button>
              </div>
              <div className="space-y-4">
                {recentMessages.map((msg) => (
                  <Card key={msg.id} className={msg.unread ? "border-primary" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold">{msg.sender}</p>
                            <span className="text-sm text-muted-foreground">{msg.time}</span>
                          </div>
                          <p className="text-muted-foreground">{msg.message}</p>
                          {msg.unread && <Badge className="bg-secondary">Nova</Badge>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href="/mensagens">Ver Todas as Mensagens</Link>
              </Button>
            </TabsContent>

            <TabsContent value="favorites" className="space-y-6">
              <h2 className="text-2xl font-bold">Meus Favoritos</h2>
              <p className="text-muted-foreground">Produtos que você salvou aparecerão aqui.</p>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <h2 className="text-2xl font-bold">Meu Perfil</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>Gerencie suas informações de perfil</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome Completo</label>
                    <p className="text-muted-foreground">João Silva</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-muted-foreground">joao.silva@aluno.ufrb.edu.br</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Campus</label>
                    <p className="text-muted-foreground">Cruz das Almas</p>
                  </div>
                  <Button variant="outline">Editar Perfil</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
