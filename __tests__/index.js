const dotenv = require("dotenv");
dotenv.config();

const request = require("supertest");
const url = `http://localhost:${process.env.PORT || 1337}`;

describe("POST Ticket", () => {
  const newTicket = {
    id: 1,
    title: "Title",
    description: "Description",
    status: "Open",
    priority: "Low",
    category: "Category",
    incident: "Incident",
    location: "Here",
  };

  it("Should return status 401", async () => {
    const response = await request(url).post("/api/tickets").send(newTicket);
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Unauthorized");
  });
});
