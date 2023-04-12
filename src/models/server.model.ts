import express, { Application } from "express";
import cors from "cors";
import path from "path";
import { dbConenection } from "../../database/config";
import customerRoutes from "./routes/customer.routes";

class Server {
  private app: Application;
  private port: string;
  private apiPaths = {
    customers: "/api/customers",
  };

  constructor() {
    this.app = express();
    this.port = process.env.PORT || "3000";

    // Base de datos
    dbConenection();

    // Métodos Iniciales
    // this.dbConenection();
    this.middlewares();

    // Definir las rutas
    this.routes();
  }

  middlewares() {
    //CORS
    this.app.use(cors());

    // Lectura del body
    this.app.use(express.json());
    // this.app.use(express.urlencoded({ extended: false }));

    // Carpeta pública
    // this.app.use(express.static("./public"));
  }

  // Rutas
  routes(): void {
    this.app.use(this.apiPaths.customers, customerRoutes);
  }

  listen(): void {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en puerto", this.port);
    });
  }
}

export default Server;
