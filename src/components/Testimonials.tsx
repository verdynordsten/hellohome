import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

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
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">What Our Guests Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real experiences from guests who have felt the comfort of Hai Home Apartment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, idx) => (
            <Card key={idx} className="hover:shadow-card-hover transition-all duration-300">
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
