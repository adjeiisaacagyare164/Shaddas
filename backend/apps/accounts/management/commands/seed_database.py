from django.core.management.base import BaseCommand
from apps.accounts.models import User
from apps.shop.models import Shop
from apps.products.models import Category, Product
from apps.website.models import HomepageContent

class Command(BaseCommand):
    help = 'Seeds initial shop data, categories, sample products, CMS content and owner account'

    def handle(self, *args, **options):
        self.stdout.write('Seeding Shaddas database...')

        # 1. Create or get Owner User
        owner, created = User.objects.get_or_create(
            email='owner@shadas.com',
            defaults={
                'name': 'Shadas Store Owner',
                'role': 'owner',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            owner.set_password('owner123')
            owner.save()
            self.stdout.write(self.style.SUCCESS('Created owner account: owner@shadas.com / password: owner123'))
        else:
            self.stdout.write('Owner account already exists.')

        # 2. Create or update Shop
        shop, shop_created = Shop.objects.get_or_create(
            id='00000000-0000-0000-0000-000000000001',
            defaults={
                'owner': owner,
                'name': 'Shaddas',
                'description': 'Discover our curated collection of luxury fashion, statement footwear, and timeless accessories. We deliver directly to you anywhere in Ghana.',
                'whatsapp_number': '+233 53 558 9099',
                'phone': '+233 53 558 9099',
                'email': 'orders@shadas.com',
                'location': 'East Legon, Accra - Ghana',
                'instagram': '@shadas.gh',
                'facebook': 'shadas.ghana',
                'currency': 'GH₵',
                'currency_code': 'GHS'
            }
        )
        if not shop_created:
            shop.name = 'Shaddas'
            shop.whatsapp_number = '+233 53 558 9099'
            shop.save()
        self.stdout.write(self.style.SUCCESS(f'Shop configured: {shop.name} (WhatsApp: {shop.whatsapp_number})'))

        # 3. Create Categories
        categories_data = [
            {
                'name': 'Footwear & Sneakers',
                'description': 'Premium sneakers, loafers, and everyday casual footwear.',
                'image': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80'
            },
            {
                'name': 'Luxury Handbags & Totes',
                'description': 'Handcrafted leather bags, designer clutches, and everyday totes.',
                'image': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80'
            },
            {
                'name': 'Apparel & Statement Fits',
                'description': 'Contemporary street wear, elegant dresses, and tailored staples.',
                'image': 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80'
            },
            {
                'name': 'Watches & Timepieces',
                'description': 'Classic chronographs, minimalist dials, and luxury wristwear.',
                'image': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'
            },
            {
                'name': 'Jewelry & Accessories',
                'description': 'Gold-tone chains, pendants, sunglasses, and signature styling pieces.',
                'image': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80'
            }
        ]

        category_map = {}
        for cat_info in categories_data:
            cat, _ = Category.objects.get_or_create(
                name=cat_info['name'],
                defaults={
                    'description': cat_info['description'],
                    'image': cat_info['image']
                }
            )
            category_map[cat_info['name']] = cat
        self.stdout.write(self.style.SUCCESS(f'Categories seeded: {len(category_map)} categories'))

        # 4. Create Sample Products
        products_data = [
            {
                'category': 'Footwear & Sneakers',
                'name': 'Shaddas Air Elite Crimson Runners',
                'price': 680.00,
                'description': 'Crafted with premium mesh, high-rebound cushioning, and bold crimson accent detailing. Engineered for all-day comfort and striking urban style.',
                'images': [
                    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'
                ],
                'availability': True,
                'status': 'published',
                'is_featured': True
            },
            {
                'category': 'Footwear & Sneakers',
                'name': 'Classic Ivory Low-Top Sneakers',
                'price': 520.00,
                'description': 'Clean, minimalist Italian leather low-tops with creamy off-white sole. A timeless essential for casual and semi-formal wear.',
                'images': [
                    'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=800&q=80'
                ],
                'availability': True,
                'status': 'published',
                'is_featured': True
            },
            {
                'category': 'Luxury Handbags & Totes',
                'name': 'Scarlet Leather Structured Shoulder Bag',
                'price': 890.00,
                'description': 'Exquisite grained Italian leather in a rich scarlet hue. Features gold-toned magnetic clasp, detachable strap, and velvet-lined compartments.',
                'images': [
                    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80'
                ],
                'availability': True,
                'status': 'published',
                'is_featured': True
            },
            {
                'category': 'Luxury Handbags & Totes',
                'name': 'Cream & Tan Canvas Travel Tote',
                'price': 450.00,
                'description': 'Heavyweight organic cotton canvas reinforced with vegetable-tanned leather handles. Ideal for weekend getaways and daily errands.',
                'images': [
                    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'
                ],
                'availability': True,
                'status': 'published',
                'is_featured': False
            },
            {
                'category': 'Apparel & Statement Fits',
                'name': 'Heritage Crimson Oversized Hoodie',
                'price': 390.00,
                'description': 'Heavy 450 GSM French terry cotton in deep ruby red. Ribbed cuffs, structured hood, and minimal tone-on-tone embroidery.',
                'images': [
                    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80'
                ],
                'availability': True,
                'status': 'published',
                'is_featured': True
            },
            {
                'category': 'Apparel & Statement Fits',
                'name': 'Ivory Linen Relaxed Button-Up Shirt',
                'price': 320.00,
                'description': 'Pure lightweight breathable linen in soft cream. Relaxed camp collar silhouette tailored for warm sunny days and breezy evenings.',
                'images': [
                    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'
                ],
                'availability': True,
                'status': 'published',
                'is_featured': False
            },
            {
                'category': 'Watches & Timepieces',
                'name': 'Shaddas Chrono Noir & Rose Gold Dial',
                'price': 1150.00,
                'description': 'Japanese quartz movement with scratch-resistant sapphire crystal glass. Rose gold bevel with a cream dial and genuine leather wristband.',
                'images': [
                    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80'
                ],
                'availability': True,
                'status': 'published',
                'is_featured': True
            },
            {
                'category': 'Jewelry & Accessories',
                'name': '18k Gold Plated Layered Chain Set',
                'price': 280.00,
                'description': 'Non-tarnish hypoallergenic stainless steel layered with 18k gold plating. Water-resistant and crafted to retain its shine permanently.',
                'images': [
                    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1611591475155-4286fa7c2e7f?auto=format&fit=crop&w=800&q=80'
                ],
                'availability': True,
                'status': 'published',
                'is_featured': False
            },
            {
                'category': 'Jewelry & Accessories',
                'name': 'Retro Tortoise Square Sunglasses',
                'price': 220.00,
                'description': 'UV400 polarized gradient lenses set within premium hand-polished acetate frames. Comes with protective leather hard case.',
                'images': [
                    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80'
                ],
                'availability': True,
                'status': 'published',
                'is_featured': False
            }
        ]

        for p_data in products_data:
            cat = category_map.get(p_data['category'])
            prod, _ = Product.objects.get_or_create(
                name=p_data['name'],
                defaults={
                    'category': cat,
                    'price': p_data['price'],
                    'description': p_data['description'],
                    'images': p_data['images'],
                    'availability': p_data['availability'],
                    'status': p_data['status'],
                    'is_featured': p_data['is_featured']
                }
            )
        self.stdout.write(self.style.SUCCESS(f'Products seeded: {len(products_data)} products'))

        # 5. Create Homepage Content
        HomepageContent.objects.get_or_create(
            id='00000000-0000-0000-0000-000000000002',
            defaults={
                'hero_badge': 'New Season Collection 2026',
                'hero_title': 'Luxury & Everyday Essentials Curated for Ghana',
                'hero_description': 'Experience effortless direct shopping. Browse our curated fashion, luxury bags, and footwear — send your order straight to our WhatsApp in one click.',
                'hero_image': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
                'hero_button_text': 'Shop New Arrivals',
                'about_title': 'Welcome to Shaddas',
                'about_description': 'At Shaddas, we believe shopping should be personal, transparent, and seamless. We hand-select premium items and bring them to your doorstep across Accra and throughout Ghana. When you place an order, you connect directly with us on WhatsApp for fast confirmations and prompt dispatch.',
                'about_image': 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80',
                'about_points': [
                    'Direct WhatsApp ordering with the shop owner',
                    'Fast and reliable dispatch across all regions of Ghana',
                    '100% verified quality and authentic craftsmanship',
                    'Flexible customer service and tailored recommendations'
                ]
            }
        )
        self.stdout.write(self.style.SUCCESS('Homepage CMS content seeded successfully.'))
        self.stdout.write(self.style.SUCCESS('Seeding complete!'))
