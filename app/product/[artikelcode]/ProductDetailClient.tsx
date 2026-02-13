'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/lib/CartContext';
import { useFavorites } from '@/lib/FavoritesContext';
import { useLanguage } from '@/lib/LanguageContext';
import { Heart, ArrowLeft, Plus, Minus, ShoppingBag, Package, Ruler, X, Download } from 'lucide-react';
import type { Product } from '@/lib/types';

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const { t } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);

  const price = product.prijs || 0;
  const favoriteStatus = isFavorite(product.artikelcode);
  const maxQuantity = product.voorraad !== undefined && product.voorraad !== null ? product.voorraad : undefined;

  // Stock indicator logic
  const getStockIndicator = () => {
    if (product.voorraad === undefined || product.voorraad === null) {
      return null;
    }

    if (product.voorraad === 0) {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-200 rounded-full relative overflow-hidden stock-indicator stock-indicator-red">
          <div className="absolute inset-0 bg-gradient-radial from-red-400/30 via-red-500/20 to-transparent opacity-60"></div>
          <div className="w-2 h-2 bg-red-500 rounded-full relative z-10 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
          <span className="text-xs font-medium text-red-700 relative z-10">Niet op voorraad</span>
        </div>
      );
    }

    if (product.voorraad <= 10) {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-200 rounded-full relative overflow-hidden stock-indicator stock-indicator-red">
          <div className="absolute inset-0 bg-gradient-radial from-red-400/30 via-red-500/20 to-transparent opacity-60"></div>
          <div className="w-2 h-2 bg-red-500 rounded-full relative z-10 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
          <span className="text-xs font-medium text-red-700 relative z-10">Low Stock</span>
        </div>
      );
    }

    if (product.voorraad <= 50) {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 border border-orange-200 rounded-full relative overflow-hidden stock-indicator stock-indicator-orange">
          <div className="absolute inset-0 bg-gradient-radial from-orange-400/30 via-orange-500/20 to-transparent opacity-60"></div>
          <div className="relative z-10 flex items-center justify-center w-4 h-4">
            <div className="absolute w-4 h-4 rounded-full border-2 border-yellow-400"></div>
            <div className="absolute w-3 h-3 rounded-full border-2 border-orange-500"></div>
            <div className="absolute w-2 h-2 rounded-full bg-orange-600 shadow-[0_0_6px_rgba(249,115,22,0.6)]"></div>
          </div>
          <span className="text-xs font-medium text-orange-700 relative z-10">Limited Stock</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full relative overflow-hidden stock-indicator stock-indicator-green">
        <div className="absolute inset-0 bg-gradient-radial from-green-400/30 via-green-500/20 to-transparent opacity-60"></div>
        <div className="w-2 h-2 bg-green-500 rounded-full relative z-10 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
        <span className="text-xs font-medium text-green-700 relative z-10">Op voorraad</span>
      </div>
    );
  };

  const handleAddToCart = () => {
    if (quantity > 0) {
      addToCart(product, quantity);
      setShowAddToCartModal(true);
      setTimeout(() => setShowAddToCartModal(false), 2000);
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    if (maxQuantity && newQuantity > maxQuantity) {
      return;
    }
    setQuantity(newQuantity);
  };

  const handleFavoriteClick = () => {
    if (favoriteStatus) {
      removeFromFavorites(product.artikelcode);
    } else {
      addToFavorites(product);
    }
  };

  const handleDownloadImage = async () => {
    if (!product.afbeelding) {
      console.error('Geen afbeelding beschikbaar');
      return;
    }

    try {
      console.log('Start download van:', product.afbeelding);

      // Maak een canvas om de afbeeldingen te combineren
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { 
        willReadFrequently: false,
        alpha: true 
      });

      if (!ctx) {
        throw new Error('Canvas context niet beschikbaar');
      }

      // Zet image smoothing uit voor scherpe afbeeldingen
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Laad de product afbeelding direct vanuit de URL
      // Gebruik document.createElement om conflicten met Next.js Image te voorkomen
      const productImg = document.createElement('img');
      productImg.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        productImg.onload = () => {
          console.log('Product afbeelding geladen:', productImg.width, 'x', productImg.height);
          resolve(null);
        };
        productImg.onerror = (error) => {
          console.error('Fout bij laden product afbeelding:', error);
          reject(new Error('Fout bij laden product afbeelding'));
        };
        // Gebruik de originele URL direct
        productImg.src = product.afbeelding;
      });

      // Stel canvas grootte in (groter canvas met witte ruimte)
      // De afbeelding op de pagina is 486x486px, dus we maken een groter canvas
      const displaySize = 486; // Grootte zoals getoond op de pagina
      const canvasSize = 600; // Groter canvas voor witte ruimte
      canvas.width = canvasSize;
      canvas.height = canvasSize;

      // Vul canvas met witte achtergrond
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Bereken schaal om de afbeelding binnen 486x486 te passen (behoud aspect ratio)
      const maxDisplaySize = displaySize;
      const scale = Math.min(
        maxDisplaySize / productImg.width,
        maxDisplaySize / productImg.height
      );
      const scaledWidth = productImg.width * scale;
      const scaledHeight = productImg.height * scale;

      // Centreer de afbeelding op het canvas
      const imageX = (canvasSize - scaledWidth) / 2;
      const imageY = (canvasSize - scaledHeight) / 2;

      // Teken de product afbeelding gecentreerd
      ctx.drawImage(productImg, imageX, imageY, scaledWidth, scaledHeight);

      // Laad het logo
      const logoImg = document.createElement('img');
      logoImg.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        logoImg.onload = () => {
          console.log('Logo geladen:', logoImg.width, 'x', logoImg.height);
          resolve(null);
        };
        logoImg.onerror = (error) => {
          console.error('Fout bij laden logo:', error);
          reject(new Error('Fout bij laden logo'));
        };
        logoImg.src = '/Logo Links BOven .png';
      });

      // Bereken logo grootte (groter logo - ongeveer 18% van de canvas hoogte)
      const logoHeight = canvasSize * 0.18;
      const logoWidth = (logoImg.width / logoImg.height) * logoHeight;

      // Bereken positie rechtsonder met padding
      const paddingRight = 12;
      const paddingBottom = 12;
      const logoX = canvasSize - logoWidth - paddingRight;
      const logoY = canvasSize - logoHeight - paddingBottom;

      // Render logo op hogere resolutie voor scherpte
      // Maak een tijdelijk canvas voor het logo op 2x resolutie
      const logoCanvas = document.createElement('canvas');
      const logoCtx = logoCanvas.getContext('2d');
      
      if (logoCtx) {
        // 2x resolutie voor scherpte
        const scaleFactor = 2;
        logoCanvas.width = logoWidth * scaleFactor;
        logoCanvas.height = logoHeight * scaleFactor;
        
        // Hoge kwaliteit smoothing voor logo
        logoCtx.imageSmoothingEnabled = true;
        logoCtx.imageSmoothingQuality = 'high';
        
        // Teken logo op hogere resolutie
        logoCtx.drawImage(logoImg, 0, 0, logoCanvas.width, logoCanvas.height);
        
        // Teken het logo canvas terug op het hoofdcanvas met hoge kwaliteit
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(logoCanvas, logoX, logoY, logoWidth, logoHeight);
      } else {
        // Fallback: teken direct met hoge kwaliteit smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
      }

      // Converteer canvas naar blob en download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${product.artikelcode || 'product'}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          console.log('Download voltooid');
        } else {
          console.error('Fout bij converteren canvas naar blob');
        }
      }, 'image/png');
    } catch (error) {
      console.error('Fout bij downloaden:', error);
      alert('Er is een fout opgetreden bij het downloaden van de afbeelding. Controleer de console voor details.');
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Terug</span>
        </button>

        {/* Product content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image section */}
          <div className="relative">
            <div 
              className="relative w-full aspect-square bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:border-[#3bb13b] transition-colors"
              onClick={() => product.afbeelding && setSelectedImage(product.afbeelding)}
            >
              {product.afbeelding ? (
                <>
                  <Image
                    src={product.afbeelding}
                    alt={product.artikelomschrijving || product.artikelcode}
                    width={600}
                    height={600}
                    className="w-full h-full object-contain"
                    priority
                    unoptimized
                  />
                  {/* Download knop rechtsboven */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleDownloadImage();
                    }}
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-colors z-20 pointer-events-auto"
                    aria-label="Download afbeelding"
                    title="Download afbeelding met logo"
                    type="button"
                  >
                    <Download size={20} className="text-gray-700" />
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <ShoppingBag size={64} className="text-gray-400" />
                </div>
              )}
            </div>
            {/* Category and favorite */}
            <div className="flex items-center justify-between mt-4">
              {product.categorie && (
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                  {product.categorie}
                </span>
              )}
              <button
                onClick={handleFavoriteClick}
                className={`p-2 rounded-full transition-colors ${
                  favoriteStatus 
                    ? 'bg-[#e91e63] text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                aria-label={favoriteStatus ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten'}
              >
                <Heart size={20} fill={favoriteStatus ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>

          {/* Product info section */}
          <div className="flex flex-col">
            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              {product.wetenschappelijkeNaam || product.artikelomschrijving || product.artikelcode}
            </h1>

            {/* Subtitle */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-sm text-gray-500 font-mono">{product.artikelcode}</span>
              {product.wetenschappelijkeNaam && product.wetenschappelijkeNaam !== product.artikelomschrijving && (
                <span className="text-sm text-gray-600">{product.artikelomschrijving}</span>
              )}
            </div>

            {/* Price and stock */}
            <div className="flex items-center gap-4 mb-6">
              {price > 0 ? (
                <div className="text-3xl font-bold text-gray-900">€ {price.toFixed(2)}</div>
              ) : (
                <div className="text-xl text-gray-500 italic">Prijs op aanvraag</div>
              )}
              {getStockIndicator()}
            </div>

            {/* Product specs */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="space-y-3">
                {product.potmaat && (
                  <div className="flex items-center gap-2">
                    <Package size={18} className="text-gray-500" />
                    <span className="text-sm text-gray-700">
                      <span className="font-medium">Potmaat:</span> {product.potmaat}
                    </span>
                  </div>
                )}
                {product.verpakkingsinhoud && (
                  <div className="flex items-center gap-2">
                    <Ruler size={18} className="text-gray-500" />
                    <span className="text-sm text-gray-700">
                      <span className="font-medium">Verpakkingsinhoud:</span> {product.verpakkingsinhoud}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quantity selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aantal
              </label>
              <div className="flex items-center gap-3 max-w-xs">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={quantity <= 1}
                  aria-label="Verminder"
                >
                  <Minus size={20} />
                </button>
                <div className="flex items-center gap-1 flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-white">
                  <input
                    type="number"
                    min="1"
                    max={maxQuantity}
                    value={quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      const finalValue = maxQuantity ? Math.min(value, maxQuantity) : value;
                      setQuantity(Math.max(1, finalValue));
                    }}
                    onFocus={(e) => e.target.select()}
                    onClick={(e) => e.target.select()}
                    className="product-detail-quantity-input flex-1 text-center font-semibold text-lg focus:outline-none border-none bg-transparent p-0"
                  />
                  {product.verpakkingsinhoud && (
                    <span className="text-lg font-semibold text-gray-700">
                      x{product.verpakkingsinhoud}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={maxQuantity !== undefined && quantity >= maxQuantity}
                  aria-label="Verhoog"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* Add to cart button */}
            <button
              onClick={handleAddToCart}
              disabled={
                (product.voorraad !== undefined && product.voorraad !== null && product.voorraad === 0) ||
                product.beschikbaar === false
              }
              className="w-full px-6 py-4 bg-[#3bb13b] text-white text-lg font-semibold rounded-lg hover:bg-[#34a034] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300 flex items-center justify-center gap-2 mb-4"
            >
              <Plus size={20} />
              Toevoegen aan winkelwagen
            </button>

            {/* Total price */}
            {price > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotaal:</span>
                  <span className="text-xl font-bold text-[#3bb13b]">
                    € {(price * quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Bulk pricing */}
            {price > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <span className="text-sm text-gray-700">
                    36x1 {t('bulk.shelf')} € {price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => {
                      const bulkQuantity = 36;
                      setQuantity(bulkQuantity);
                      addToCart(product, bulkQuantity);
                      setShowAddToCartModal(true);
                      setTimeout(() => setShowAddToCartModal(false), 2000);
                    }}
                    className="w-8 h-8 flex items-center justify-center bg-[#3bb13b] text-white rounded-full hover:bg-[#34a034] transition-colors"
                    aria-label="Voeg 36x toe aan winkelwagen"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <span className="text-sm text-gray-700">
                    216x1 {t('bulk.trolley')} € {price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => {
                      const bulkQuantity = 216;
                      setQuantity(bulkQuantity);
                      addToCart(product, bulkQuantity);
                      setShowAddToCartModal(true);
                      setTimeout(() => setShowAddToCartModal(false), 2000);
                    }}
                    className="w-8 h-8 flex items-center justify-center bg-[#3bb13b] text-white rounded-full hover:bg-[#34a034] transition-colors"
                    aria-label="Voeg 216x toe aan winkelwagen"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-lg w-full mx-auto" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 text-white bg-[#3bb13b] hover:bg-[#34a034] rounded-full p-2 transition-colors z-10 shadow-lg"
              aria-label="Sluiten"
            >
              <X size={20} />
            </button>
            <div className="bg-white rounded-lg overflow-hidden shadow-xl p-3 relative aspect-square">
              <Image
                src={selectedImage}
                alt={product.artikelomschrijving || product.artikelcode}
                width={600}
                height={600}
                className="w-full h-full object-contain"
                unoptimized
              />
              <div className="absolute bottom-0 left-0 right-0 flex justify-end pr-3 pb-3">
                <Image
                  src="/Logo Links BOven .png"
                  alt="Straver Pflanzen Export"
                  width={300}
                  height={90}
                  className="h-16 w-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add to cart success modal */}
      {showAddToCartModal && (
        <div className="fixed bottom-4 right-4 bg-[#3bb13b] text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3 animate-slide-up">
          <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Plus size={16} />
          </div>
          <span className="font-medium">Toegevoegd aan winkelwagen!</span>
        </div>
      )}
    </>
  );
}
