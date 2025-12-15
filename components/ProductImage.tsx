import LazyImage from './LazyImage';

interface ProductImageProps {
  src?: string;
  alt: string;
}

export default function ProductImage({ src, alt }: ProductImageProps) {
  return (
    <div className="product-image">
      {src ? (
        <LazyImage
          src={src}
          alt={alt}
          width={600}
          height={600}
          className="w-full h-full"
          priority={true}
        />
      ) : (
        <div className="product-image-placeholder w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
          <span>Geen afbeelding</span>
        </div>
      )}
    </div>
  );
}

