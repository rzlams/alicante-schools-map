import { schools, users, type School, type InsertSchool, type User, type InsertUser } from "@shared/schema";
import schoolsData from "../attached_assets/colegios_1751247856681.json";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllSchools(): Promise<School[]>;
  updateSchool(id: number, updates: Partial<School>): Promise<School | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private schools: Map<number, School>;
  private currentUserId: number;
  private currentSchoolId: number;

  constructor() {
    this.users = new Map();
    this.schools = new Map();
    this.currentUserId = 1;
    this.currentSchoolId = 1;
    
    // Initialize schools from JSON data
    this.initializeSchools();
  }

  private initializeSchools() {
    schoolsData.forEach((schoolData) => {
      const school: School = {
        id: this.currentSchoolId++,
        name: schoolData.name,
        address: schoolData.address,
        phone: schoolData.phone,
        email: schoolData.email,
        isVisited: false,
        hasQuota: false,
        comments: "",
      };
      this.schools.set(school.id, school);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllSchools(): Promise<School[]> {
    return Array.from(this.schools.values());
  }

  async updateSchool(id: number, updates: Partial<School>): Promise<School | undefined> {
    const school = this.schools.get(id);
    if (!school) {
      return undefined;
    }
    
    const updatedSchool = { ...school, ...updates };
    this.schools.set(id, updatedSchool);
    return updatedSchool;
  }
}

export const storage = new MemStorage();
