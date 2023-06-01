import morgan from "morgan";
import express, { Application } from "express";
import cors from "cors";
import { dbConnection } from "./database/connection";
import customerRoutes from "./routes/customer.routes";
import agentRoutes from "./routes/agent.routes";
import authRoutes from "./routes/auth.routes";
import prospectRoutes from "./routes/prospect.routes";
import uploadsRoutes from "./routes/uploads.routes";
import statesRoutes from "./routes/state.routes";
import policyRoutes from "./routes/policy.routes";

import config from "./config/config";
import path from "path";

const environment = config[process.env.ENVIRONMENT || "development"];
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
    policy: "/api/policy",
  };

  constructor() {
    this.app = express();
    this.port = process.env.PORT || "3000";

    // Base de datos
    dbConnection();

    // Métodos Iniciales
    this.middlewares();

    // Definir las rutas
    this.routes();
  }

  middlewares() {
    //CORS
    this.app.use(cors());

    this.app.use(morgan("combined", {}));
    // Lectura del body
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.get("/", (req, res, next) =>
      res.status(200).json({ msg: "PHP Agency" })
    );

    // Carpeta pública
    this.app.use("/uploads", express.static(path.resolve("uploads")));
  }

  // Rutas
  routes(): void {
    this.app.use(this.apiPaths.login, authRoutes);
    this.app.use(this.apiPaths.agents, agentRoutes);
    this.app.use(this.apiPaths.customers, customerRoutes);
    this.app.use(this.apiPaths.prospects, prospectRoutes);
    this.app.use(this.apiPaths.uploads, uploadsRoutes);
    this.app.use(this.apiPaths.states, statesRoutes);
    this.app.use(this.apiPaths.policy, policyRoutes);
  }

  listen(): void {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en puerto", this.port);
    });
  }
}

export default Server;
