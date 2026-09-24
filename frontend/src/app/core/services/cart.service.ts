import { Injectable, signal, computed, inject } from '@angular/core';
import { CartItem, CustomerOrderInfo } from '../models/cart.model';
import { Product } from '../models/product.model';
import { ShopService } from './shop.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private shopService = inject(ShopService);
  private toast = inject(ToastService);
  private readonly CART_KEY = 'shadas_cart_v1';

  items = signal<CartItem[]>([]);

  // Computed signals
  totalItemsCount = computed(() => {
    return this.items().reduce((sum, item) => sum + item.quantity, 0);
  });

  subtotal = computed(() => {
    return this.items().reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
  });

  total = computed(() => {
    return this.subtotal();
  });

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {
    const saved = localStorage.getItem(this.CART_KEY);
    if (saved) {
      try {
        this.items.set(JSON.parse(saved));
      } catch (e) {
        this.items.set([]);
      }
    }
  }

  private saveCart(): void {
    localStorage.setItem(this.CART_KEY, JSON.stringify(this.items()));
  }

  addToCart(product: Product, quantity: number = 1): void {
    if (!product.availability) {
      this.toast.warning(`${product.name} is currently out of stock.`);
      return;
    }

    this.items.update(currentItems => {
      const existingIndex = currentItems.findIndex(i => i.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...currentItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        return [...currentItems, { product, quantity }];
      }
    });

    this.saveCart();
    this.toast.success(`Added ${quantity}x "${product.name}" to your order.`);
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    this.items.update(currentItems => {
      return currentItems.map(item => {
        if (item.product.id === productId) {
          return { ...item, quantity };
        }
        return item;
      });
    });

    this.saveCart();
  }

  removeFromCart(productId: string): void {
    this.items.update(currentItems => currentItems.filter(i => i.product.id !== productId));
    this.saveCart();
    this.toast.info('Item removed from your order.');
  }

  clearCart(): void {
    this.items.set([]);
    localStorage.removeItem(this.CART_KEY);
  }

  // Format phone number to WhatsApp international standard (e.g. +233 53 558 9099 -> 233535589099)
  sanitizeWhatsAppNumber(rawNumber: string): string {
    return rawNumber.replace(/[^0-9]/g, '');
  }

  // Generate WhatsApp order message for the complete Cart
  sendCartOrderViaWhatsApp(customer: CustomerOrderInfo): boolean {
    if (this.items().length === 0) {
      this.toast.error('Your order cart is empty.');
      return false;
    }

    if (!customer.name.trim() || !customer.phone.trim() || !customer.location.trim()) {
      this.toast.error('Please fill in your Name, Phone Number, and Delivery Location.');
      return false;
    }

    const shop = this.shopService.shopInfo();
    const cleanNumber = this.sanitizeWhatsAppNumber(shop.whatsapp_number || '+233535589099');

    // Build the order message lines
    let itemsText = '';
    this.items().forEach(item => {
      const itemTotal = (Number(item.product.price) * item.quantity).toFixed(2);
      itemsText += `${item.product.name} × ${item.quantity} — GH₵${itemTotal}\n`;
    });

    const noteSection = customer.note && customer.note.trim() ? customer.note.trim() : 'None';

    const message = 
`Hello, I would like to place an order.

Order:
${itemsText.trim()}

Total: GH₵${this.total().toFixed(2)}

Customer:
Name: ${customer.name.trim()}
Phone: ${customer.phone.trim()}
Location: ${customer.location.trim()}

Additional Note:
${noteSection}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

    // Open WhatsApp in new tab/window
    window.open(whatsappUrl, '_blank');
    return true;
  }

  // Generate direct single-product WhatsApp order message
  sendSingleProductViaWhatsApp(product: Product, quantity: number = 1): void {
    const shop = this.shopService.shopInfo();
    const cleanNumber = this.sanitizeWhatsAppNumber(shop.whatsapp_number || '+233535589099');
    const totalPrice = (Number(product.price) * quantity).toFixed(2);

    const message = 
`Hello, I would like to place an order for this item.

Product: ${product.name}
Quantity: ${quantity}
Total Price: GH₵${totalPrice}

Please confirm availability and delivery details. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  }
}
