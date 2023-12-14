import supertest from "supertest";
import type { Application } from "express";

export async function login(
  st: typeof supertest,
  app: Application
): Promise<string> {
  const response = await st(app).post("/login").send({
    email: "admin@admin",
    password: "admin",
  });
  return response.body.token;
}
