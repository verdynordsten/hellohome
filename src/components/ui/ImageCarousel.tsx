import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
}

const ImageCarousel = ({ images, alt, className }: ImageCarouselProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const imageList = images.length > 0
    ? images
    : ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"];
  
  // Auto-slide functionality
  useEffect(() => {
    if (imageList.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % imageList.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [imageList.length]);
  
  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % imageList.length);
  };
  
  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };
  
  const goToImage = (index: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex(index);
  };

  return (
    <div className={cn("relative w-full h-full", className)}>
      <div className="relative w-full h-full">
        {imageList.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${alt} - Image ${index + 1}`}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out",
              currentImageIndex === index ? "opacity-100" : "opacity-0"
            )}
          />
        ))}
      </div>
      
      {imageList.length > 1 && (
        <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              prevImage();
            }}
            className="pointer-events-auto bg-black/70 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/90 transition-colors shadow-lg"
            aria-label="Previous image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              nextImage();
            }}
            className="pointer-events-auto bg-black/70 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/90 transition-colors shadow-lg"
            aria-label="Next image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      )}
      
      {imageList.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20 pointer-events-none">
          {imageList.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToImage(index);
              }}
              className={cn(
                "h-2 rounded-full transition-all duration-300 pointer-events-auto",
                index === currentImageIndex
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/70 w-2"
              )}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;