import { 
  users, 
  type User, 
  type InsertUser,
  serviceMaterials,
  type ServiceMaterial,
  type InsertServiceMaterial
} from "@shared/schema";

// Icon components will be mapped on the client side
const materialTypes = [
  { 
    name: "Service Banner", 
    description: "Main promotional image",
    icon: "ImageIcon"
  },
  { 
    name: "Order of Service", 
    description: "Service flow document",
    icon: "FileText"
  },
  { 
    name: "Song list", 
    description: "Worship set for service",
    icon: "Music"
  },
  { 
    name: "Opening Prayer", 
    description: "Prayer script for service opening",
    icon: "BookOpen"
  },
  { 
    name: "Promo videos", 
    description: "Video content for service",
    icon: "Video"
  },
  { 
    name: "Confessions", 
    description: "Confession scripts",
    icon: "Speech"
  },
  { 
    name: "Offering scripture", 
    description: "Bible verses for offering",
    icon: "Heart"
  },
  { 
    name: "Exhortation", 
    description: "Encouragement messages",
    icon: "MessageSquare"
  },
  { 
    name: "Vibey music", 
    description: "Background music tracks",
    icon: "Music"
  },
  { 
    name: "Announcements", 
    description: "Church-wide announcements",
    icon: "Megaphone"
  },
  { 
    name: "Pictures", 
    description: "Service photography",
    icon: "Image"
  }
];

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Service Material operations
  getAllServiceMaterials(): Promise<ServiceMaterial[]>;
  getServiceMaterialById(id: number): Promise<ServiceMaterial | undefined>;
  createServiceMaterial(material: InsertServiceMaterial): Promise<ServiceMaterial>;
  updateServiceMaterial(id: number, updates: Partial<ServiceMaterial>): Promise<ServiceMaterial>;
  deleteServiceMaterial(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private serviceMaterials: Map<number, ServiceMaterial>;
  private userCurrentId: number;
  private materialCurrentId: number;

  constructor() {
    this.users = new Map();
    this.serviceMaterials = new Map();
    this.userCurrentId = 1;
    this.materialCurrentId = 1;
    
    // Initialize with sample service materials
    this.initializeServiceMaterials();
  }
  
  private initializeServiceMaterials() {
    const statuses = ["up-to-date", "not-up-to-date", "not-up-to-date", "not-up-to-date"];
    const editors = [
      { name: "Magloire Numbi", avatarUrl: "https://ui-avatars.com/api/?name=Magloire+Numbi&background=0D8ABC&color=fff" },
      { name: "Michelle Makudo", avatarUrl: "https://ui-avatars.com/api/?name=Michelle+Makudo&background=4DB276&color=fff" },
      { name: "Tinyiko Baloyi", avatarUrl: "https://ui-avatars.com/api/?name=Tinyiko+Baloyi&background=BA4D4D&color=fff" }
    ];
    
    materialTypes.forEach((type, index) => {
      const status = statuses[index % statuses.length];
      const editor = editors[index % editors.length];
      const updatedDaysAgo = Math.floor(Math.random() * 7) + 1;
      const updatedDate = new Date();
      updatedDate.setDate(updatedDate.getDate() - updatedDaysAgo);
      
      this.serviceMaterials.set(index + 1, {
        id: index + 1,
        name: type.name,
        description: type.description,
        category: type.name.toLowerCase().replace(/\s+/g, '-'),
        status: status,
        icon: type.icon,
        fileName: status === "up-to-date" ? `${type.name.toLowerCase().replace(/\s+/g, '_')}.pdf` : null,
        fileSize: status === "up-to-date" ? Math.floor(Math.random() * 5000000) + 500000 : 0,
        mimeType: status === "up-to-date" ? "application/pdf" : null,
        fileData: null,
        editor: editor,
        createdAt: new Date(2023, 0, 1).toISOString(),
        updatedAt: updatedDate.toISOString()
      });
      
      this.materialCurrentId = index + 2;
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Service Material methods
  async getAllServiceMaterials(): Promise<ServiceMaterial[]> {
    return Array.from(this.serviceMaterials.values());
  }
  
  async getServiceMaterialById(id: number): Promise<ServiceMaterial | undefined> {
    return this.serviceMaterials.get(id);
  }
  
  async createServiceMaterial(material: InsertServiceMaterial): Promise<ServiceMaterial> {
    const id = this.materialCurrentId++;
    const now = new Date().toISOString();
    
    const editor = {
      name: "Magloire Numbi",
      avatarUrl: "https://ui-avatars.com/api/?name=Magloire+Numbi&background=0D8ABC&color=fff"
    };
    
    // Find icon based on category or default to "File"
    const matchingType = materialTypes.find(t => 
      t.name.toLowerCase().includes(material.category) || 
      material.category.includes(t.name.toLowerCase())
    );
    const icon = matchingType?.icon || "File";
    
    const newMaterial: ServiceMaterial = {
      id,
      name: material.name,
      description: material.description || null,
      category: material.category,
      status: material.status || "not-up-to-date",
      icon,
      fileName: material.fileName || null,
      fileSize: material.fileSize || null,
      mimeType: material.mimeType || null,
      fileData: material.fileData || null,
      editor,
      createdAt: now,
      updatedAt: now
    };
    
    this.serviceMaterials.set(id, newMaterial);
    return newMaterial;
  }
  
  async updateServiceMaterial(id: number, updates: Partial<ServiceMaterial>): Promise<ServiceMaterial> {
    const material = this.serviceMaterials.get(id);
    
    if (!material) {
      throw new Error(`Service material with id ${id} not found`);
    }
    
    const updatedMaterial = {
      ...material,
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    this.serviceMaterials.set(id, updatedMaterial);
    return updatedMaterial;
  }
  
  async deleteServiceMaterial(id: number): Promise<boolean> {
    return this.serviceMaterials.delete(id);
  }
}

export const storage = new MemStorage();
