import express, { Application } from "express";
import cors from "cors";
import path from "path";
import { dbConnection } from "./database/connection";
import customerRoutes from "./routes/customer.routes";
import agentRoutes from "./routes/agent.routes";
import authRoutes from "./routes/auth.routes";
import prospectRoutes from "./routes/prospect.routes";
import uploadsRoutes from "./routes/uploads.routes";
import statesRoutes from "./routes/state.routes";

class Server {
  private app: Application;
  private port: string;
  private apiPaths = {
    login: "/api/login",
    agents: "/api/agents",
    customers: "/api/customers",
    prospects: "/api/prospects",
    uploads: "/api/uploads",
    states: "/api/states",
  };

  constructor() {
    this.app = express();
    this.port = process.env.PORT || "3000";

    // Base de datos
    dbConnection();

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
    this.app.get("/", (req, res, next) =>
      res.status(200).json({ hello: "world" })
    );
    // Carpeta pública
    // this.app.use(express.static("./public"));
  }

  // Rutas
  routes(): void {
    this.app.use(this.apiPaths.login, authRoutes);
    this.app.use(this.apiPaths.agents, agentRoutes);
    this.app.use(this.apiPaths.customers, customerRoutes);
    this.app.use(this.apiPaths.prospects, prospectRoutes);
    this.app.use(this.apiPaths.uploads, uploadsRoutes);
    this.app.use(this.apiPaths.states, statesRoutes);
  }

  listen(): void {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en puerto", this.port);
    });
  }
}

export default Server;
