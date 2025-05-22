import { /*useState,*/ /*useEffect,*/ useRef } from "react"; // Comment out useState
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation"; // Import the hook

type GalleryItem = {
  id: string;
  category: string;
  title: string;
  description: string;
  imageUrl: string;
};

// Using Unsplash placeholder URLs temporarily
const galleryItems: GalleryItem[] = [
  {
    id: "1",
    category: "receiving-the-word",
    title: "Receiving the Word",
    description: "Powerful sermons and teaching sessions from our leadership.",
    imageUrl: "https://i.imgur.com/6uBEh9m.jpeg"
  },
  {
    id: "2",
    category: "impartation",
    title: "Impartation Service",
    description: "Special prayer and anointing services with impactful testimonies.",
    imageUrl: "https://i.imgur.com/0NrkyxA.jpeg"
  },
  {
    id: "3",
    category: "panel-discussion",
    title: "Panel Discussions",
    description: "Thought-provoking conversations on faith and community engagement.",
    imageUrl: "https://i.postimg.cc/Vkg6XC4t/Panel-discussions.jpg"
  },
  {
    id: "4",
    category: "prayer",
    title: "Prayer Services",
    description: "Collection of prayer services and special moments of intercession.",
    imageUrl: "https://i.postimg.cc/TYXYS94m/Prayers.jpg"
  },
  {
    id: "5",
    category: "special-conferences",
    title: "Special Conferences",
    description: "Events and conferences with guest speakers and specialized teachings.",
    imageUrl: "https://i.postimg.cc/5tjxvkXc/Special-conferences.png"
  },
  {
    id: "6",
    category: "worship",
    title: "Praise & Worship",
    description: "Powerful moments of collective worship and musical expression.",
    imageUrl: "https://i.postimg.cc/YC0cyLMY/0Z4A9906.png"
  },
];

function Gallery() {
  // const [activeCategory, setActiveCategory] = useState("all"); // Remove this line
  const sectionRef = useScrollAnimation<HTMLElement>(); // Initialize the hook
  
  // Remove the existing useEffect for animateOnScroll
  /*
  useEffect(() => {
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      
      if (!animateRef.current) {
        animateRef.current = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          });
        }, { threshold: 0.1 });
      }
      
      elements.forEach(element => {
        animateRef.current?.observe(element);
      });
    };
    
    animateOnScroll();
    
    return () => {
      animateRef.current?.disconnect();
    };
  }, []);
  */

  // const filteredItems = activeCategory === "all" 
  //  ? galleryItems 
  //  : galleryItems.filter(item => item.category === activeCategory);
  // Display all items directly
  const filteredItems = galleryItems;

  // const categories = [ // Remove this entire array
  //   { id: "all", label: "All" },
  //   { id: "receiving-the-word", label: "Receiving the Word" },
  //   { id: "impartation", label: "Impartation" },
  //   { id: "panel-discussion", label: "Panel Discussion" },
  //   { id: "prayer", label: "Prayer" },
  //   { id: "special-conferences", label: "Special Conferences" },
  //   { id: "worship", label: "Worship" },
  // ];

  return (
    <section 
      ref={sectionRef} // Apply the ref
      className="py-20 bg-secondary animate-on-scroll" // Add animate-on-scroll
      id="gallery"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full mb-4">
            Media Gallery
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            Ministry Moments
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Browse through our collection of services, events, and special moments captured in our ministry.
          </p>
        </div>
        
        {/* Category filters - Remove this entire JSX block 
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category.id)}
              className="rounded-full"
            >
              {category.label}
            </Button>
          ))}
        </div>
        */}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="gallery-item bg-card rounded-xl shadow-md overflow-hidden border hover:shadow-lg transition-all duration-300" /* removed data-category={item.category} as it's no longer needed */ >
              <div className="relative h-52 overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
                  <span className="text-white font-medium text-sm capitalize">
                    {item.title}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Gallery;
