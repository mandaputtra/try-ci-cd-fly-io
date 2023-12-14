import { afterAll, describe, expect, it, vi } from "vitest";
import App from "../server";
import jsonCar from "./__MOCK__/car.json";
import path from "node:path";
import supertest from "supertest";
import { login } from "../utils/test-utils";
import { fakerID_ID as faker } from "@faker-js/faker";
import { CarsModel } from "../models/cars";
import * as utilsupload from "../utils/upload";

vi.spyOn(utilsupload, "uploadCloudinary").mockImplementation(
  async () => "uri-image.com"
);

describe("test car module", () => {
  const app = new App().app;
  let id: number = 0;
  let token: string = "";

  afterAll(async () => {
    await CarsModel.query().deleteById(id);
    vi.clearAllMocks();
  });

  it("should be able to login", async () => {
    const response = await login(supertest, app);
    expect(response).toBeTruthy();
    token = response;
  });

  it("should be able to add car", async () => {
    const st = supertest(app)
      .post("/cars")
      .attach("image", path.resolve(__dirname, "__MOCK__", "picture.png"))
      .set({
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      });
    // @ts-expect-error delete req column
    delete jsonCar.id;
    // @ts-expect-error delete req column
    delete jsonCar.image;
    jsonCar.plate = faker.person.firstName().padStart(10, "0");
    for (const key in jsonCar) {
      // @ts-expect-error any
      const value = jsonCar[key];
      if (key !== "image") {
        st.field(key, value);
      }
    }

    const response = await st;

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      message: "Car created successfully",
      id: expect.any(Number),
    });
    id = response.body.id;
  });

  it("should be able to delete car", async () => {
    const response = await supertest(app)
      .delete(`/cars/${id}`)
      .set({
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      });
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      message: "Car soft deleted successfully",
    });
  });

  it("should be able to filter cars", async () => {
    const response = await supertest(app)
      .get("/filtered-cars")
      .query({
        date: "2023-12-03",
        capacity: 2,
      })
      .set({
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      });
    expect(response.status).toBe(200);
  });
});
