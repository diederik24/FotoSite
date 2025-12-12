import Image from 'next/image';

interface ProductImageProps {
  src?: string;
  alt: string;
}

export default function ProductImage({ src, alt }: ProductImageProps) {
  return (
    <div className="product-image">
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={600}
          height={600}
          className="w-full h-full object-contain block"
          priority
          loading="eager"
          fetchPriority="high"
        />
      ) : (
        <div className="product-image-placeholder">🌿</div>
      )}
    </div>
  );
}

