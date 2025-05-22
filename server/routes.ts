import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";

// Set up multer storage for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB max file size
  },
  fileFilter: (_req, file, cb) => {
    // Accept images, videos, pdfs and office documents
    const allowedExtensions = [
      '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', 
      '.mp4', '.mov', '.avi', '.wmv',
      '.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx'
    ];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedExtensions.includes(ext)) {
      return cb(null, true);
    }
    cb(new Error(`File type not allowed: ${ext}`));
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/service-materials", async (_req, res) => {
    try {
      const materials = await storage.getAllServiceMaterials();
      res.json(materials);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/service-materials/:id", async (req, res) => {
    try {
      const material = await storage.getServiceMaterialById(parseInt(req.params.id));
      if (!material) {
        return res.status(404).json({ message: "Service material not found" });
      }
      res.json(material);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/service-materials/upload", upload.array("files"), async (req, res) => {
    try {
      const { name, description, category } = req.body;
      const files = req.files as Express.Multer.File[];
      
      if (!name || !category || !files || files.length === 0) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // In a real app, we would process the files and store them
      // For this demo, we'll just simulate success
      const material = await storage.createServiceMaterial({
        name,
        description: description || "",
        category,
        status: "not-up-to-date",
        fileName: files[0].originalname,
        fileSize: files[0].size,
        mimeType: files[0].mimetype,
        fileData: files[0].buffer.toString('base64'),
      });

      res.status(201).json(material);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/service-materials/:id", upload.single("file"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { name, description, category, status } = req.body;
      const file = req.file;
      
      const existingMaterial = await storage.getServiceMaterialById(id);
      if (!existingMaterial) {
        return res.status(404).json({ message: "Service material not found" });
      }

      const updateData: any = {};
      if (name) updateData.name = name;
      if (description) updateData.description = description;
      if (category) updateData.category = category;
      if (status) updateData.status = status;
      
      if (file) {
        updateData.fileName = file.originalname;
        updateData.fileSize = file.size;
        updateData.mimeType = file.mimetype;
        updateData.fileData = file.buffer.toString('base64');
      }

      const updatedMaterial = await storage.updateServiceMaterial(id, updateData);
      res.json(updatedMaterial);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/service-materials/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = await storage.deleteServiceMaterial(id);
      
      if (!result) {
        return res.status(404).json({ message: "Service material not found" });
      }
      
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
