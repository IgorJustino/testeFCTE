"use client"

import { ArrowLeft, Heart, MessageCircle, Share2, MapPin, Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { notFound } from "next/navigation"
import { useEffect, useState } from "react"

interface Product {
  id: number
  title: string
  price: number
  category: string
  condition: string
  location: string
  description: string
  seller_name: string
  seller_username: string
  created_at: string
  views: number
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [productId, setProductId] = useState<string>("")

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params
      setProductId(resolvedParams.id)
    }
    resolveParams()
  }, [params])

  useEffect(() => {
    if (!productId) return

    const loadProduct = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8004/api/products/${productId}/`)
        
        if (!response.ok) {
          notFound()
          return
        }
        
        const product = await response.json()
        setProduct(product)
      } catch (error) {
        console.error('Erro ao carregar produto:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [productId])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Carregando produto...</div>
      </div>
    )
  }

  if (!product) {
    notFound()
    return null
  }
  return (
    <div className="flex flex-col">
      {/* Back Button */}
      <div className="bg-muted border-b">
        <div className="container mx-auto px-4 py-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/marketplace">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Marketplace
            </Link>
          </Button>
        </div>
      </div>

      {/* Product Details */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                <img
                  src="/placeholder.svg?height=400&width=400"
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {/* Placeholder para futuras imagens */}
                {[1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <img
                      src="/placeholder.svg?height=150&width=150"
                      alt={`${product.title} - imagem ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="mb-3">
                  {product.category}
                </Badge>
                <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
                <p className="text-4xl font-bold text-primary">R$ {product.price.toFixed(2)}</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{product.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Publicado em {new Date(product.created_at).toLocaleDateString("pt-BR")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold">Condição:</span>
                  <span className="text-muted-foreground">{product.condition}</span>
                </div>
              </div>

              <Separator />

              <div>
                <h2 className="font-semibold mb-2">Descrição</h2>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              <Separator />

              {/* Seller Info */}
              <div className="bg-muted rounded-lg p-4 space-y-4">
                <h3 className="font-semibold">Vendedor</h3>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder.svg" alt={product.seller_name} />
                    <AvatarFallback>{product.seller_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{product.seller_name}</p>
                    <p className="text-sm text-muted-foreground">
                      @{product.seller_username} • {product.views} visualizações
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button asChild className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground" size="lg">
                  <Link href="/mensagens">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Entrar em Contato
                  </Link>
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
