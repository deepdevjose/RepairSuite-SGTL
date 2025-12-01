"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ShoppingCart, Trash2, Plus, Minus, Ticket, Loader2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"

interface CartItem {
    product: any
    quantity: number
}

interface InventoryCartProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    cart: CartItem[]
    onUpdateQuantity: (productId: string, delta: number) => void
    onRemoveItem: (productId: string) => void
    onClearCart: () => void
    onCheckout: () => Promise<void>
    loading: boolean
}

export function InventoryCart({
    open,
    onOpenChange,
    cart,
    onUpdateQuantity,
    onRemoveItem,
    onClearCart,
    onCheckout,
    loading
}: InventoryCartProps) {

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-md bg-slate-900 border-l border-white/10 text-slate-100 flex flex-col">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2 text-xl text-white">
                        <ShoppingCart className="h-5 w-5 text-indigo-400" />
                        Carrito de Retiro
                    </SheetTitle>
                    <SheetDescription className="text-slate-400">
                        Revisa los materiales que vas a retirar.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 mt-6 overflow-hidden flex flex-col">
                    {cart.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-4">
                            <ShoppingCart className="h-12 w-12 opacity-20" />
                            <p>Tu carrito está vacío</p>
                            <Button variant="link" onClick={() => onOpenChange(false)} className="text-indigo-400">
                                Volver al inventario
                            </Button>
                        </div>
                    ) : (
                        <ScrollArea className="flex-1 pr-4">
                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <div key={item.product.id} className="bg-slate-800/50 rounded-lg p-3 flex gap-3 items-start border border-white/5">
                                        {/* Thumbnail placeholder or image if available */}
                                        <div className="h-16 w-16 bg-slate-800 rounded-md flex items-center justify-center shrink-0">
                                            {item.product.categoria === 'Software' ? (
                                                <Ticket className="h-8 w-8 text-indigo-500/50" />
                                            ) : (
                                                <span className="text-xs font-bold text-slate-600">{item.product.sku.substring(0, 3)}</span>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-sm text-slate-200 truncate" title={item.product.nombre}>
                                                {item.product.nombre}
                                            </h4>
                                            <p className="text-xs text-slate-500 mb-2">{item.product.sku}</p>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 bg-slate-900 rounded-md border border-slate-700 p-0.5">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 rounded-sm hover:bg-slate-800 text-slate-400"
                                                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="text-xs font-mono w-6 text-center">{item.quantity}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 rounded-sm hover:bg-slate-800 text-slate-400"
                                                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                                                        disabled={item.quantity >= (item.product.stockActual - item.product.stockReservado)}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                    onClick={() => onRemoveItem(item.product.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="mt-6 space-y-4">
                        <Separator className="bg-white/10" />
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-400">Total de artículos</span>
                            <span className="font-bold text-lg">{totalItems}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" onClick={onClearCart} className="border-slate-700 hover:bg-slate-800 text-slate-300">
                                Vaciar
                            </Button>
                            <Button onClick={onCheckout} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Ticket className="mr-2 h-4 w-4" />}
                                Generar Ticket
                            </Button>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}
