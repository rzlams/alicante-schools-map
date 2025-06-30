import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all schools
  app.get("/api/schools", async (req, res) => {
    try {
      const schools = await storage.getAllSchools();
      res.json(schools);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch schools" });
    }
  });

  // Update school
  app.patch("/api/schools/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateSchema = z.object({
        isVisited: z.boolean().optional(),
        hasQuota: z.boolean().optional(),
        comments: z.string().optional(),
      });

      const updates = updateSchema.parse(req.body);
      const updatedSchool = await storage.updateSchool(id, updates);

      if (!updatedSchool) {
        return res.status(404).json({ message: "School not found" });
      }

      res.json(updatedSchool);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update school" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
