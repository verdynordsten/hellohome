import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useEffect, useRef } from "react";

const testimonials = [
  {
    name: "Sarah M.",
    text: "Unit apartemen sangat bersih dan nyaman. Fasilitas Netflix dan WiFi cepat sangat membantu selama stay. Highly recommended!",
    rating: 5,
  },
  {
    name: "Budi S.",
    text: "Lokasi strategis, mudah akses ke mall dan pusat kota. Pelayanan ramah dan unit sesuai dengan foto. Pasti akan booking lagi!",
    rating: 5,
  },
  {
    name: "Lisa T.",
    text: "Apartemen dengan view laut sangat menakjubkan. Suasana tenang dan fasilitas kolam renang yang bagus. Worth it!!",
    rating: 5,
  },
  {
    name: "Ahmad R.",
    text: "Pengalaman menginap yang sangat menyenangkan. Staf sangat membantu dan responsif. Fasilitas lengkap dan terawat dengan baik.",
    rating: 5,
  },
  {
    name: "Maya P.",
    text: "Perfect untuk staycation bersama keluarga. Anak-anak senang dengan kolam renangnya. Suasana tenang dan nyaman.",
    rating: 5,
  },
  {
    name: "David K.",
    text: "Apartemen modern dengan desain interior yang elegan. Lokasi dekat dengan transportasi publik. Sangat puas dengan pelayanannya.",
    rating: 5,
  },
  {
    name: "Nina L.",
    text: "Kebersihan unit sangat terjaga. Peralatan dapur lengkap memudahkan kami untuk memasak. Pasti akan kembali lagi!",
    rating: 5,
  },
  {
    name: "Ricky H.",
    text: "Value for money! Dengan harga terjangkau dapat fasilitas mewah. WiFi super cepat, cocok untuk work from apartment.",
    rating: 5,
  },
];

const Testimonials = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let animationId: number;
    let position = slider.scrollWidth / 2;

    const animate = () => {
      if (slider) {
        position -= 0.3;
        if (position <= 0) {
          position = slider.scrollWidth / 2;
        }
        slider.scrollLeft = position;
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <section className="py-16 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">What Our Guests Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real experiences from guests who have felt the comfort of Hello Home Apartment
          </p>
        </div>

        <div className="relative">
          <div
            ref={sliderRef}
            className="flex gap-8 overflow-hidden scrollbar-hide"
            style={{ scrollBehavior: 'auto' }}
          >
            {/* Duplicate the testimonials array for infinite scroll effect */}
            {[...testimonials, ...testimonials].map((testimonial, idx) => (
              <div key={idx} className="flex-shrink-0 w-80">
                <Card className="hover:shadow-card-hover transition-all duration-300 h-full">
                  <CardContent className="pt-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                      ))}
                    </div>
                    <p className="text-muted-foreground italic mb-4">"{testimonial.text}"</p>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
