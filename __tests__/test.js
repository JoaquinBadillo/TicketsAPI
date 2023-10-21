const dotenv = require("dotenv");
dotenv.config();

const request = require("supertest");
const url = `http://localhost:${process.env.PORT || 1337}`;

describe("PUT Ticket", () => {
    const modTicket = {
        id: "652f199ce94f17685744947c",
        title: "Título",
        description: "Descripción super larga",
        status: "Cerrado",
        priority: "Baja",
        category: "Servicios",
        incident: "Luz",
        location: "Santa Fe",
    }

    it("Should return status 404", async () => {
        const response = await request(url).put("/api/tickets").send(modTicket);
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Recurso no encontrado");
      });

  });