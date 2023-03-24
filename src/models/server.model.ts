import express, { Application } from "express";
import cors from "cors";
import path from "path";
import { dbConenection } from "../../database/config";

class Server {
  private app: Application;
  private port: string;
  private apiPaths = {
    // usuarios: "/api/usuarios",
    // login: "/api/login",
    // ministerios: "/api/ministerios",
    // vacunas: "/api/vacunas",
    // permisos: "/api/permisos",
    // uploads: "/api/uploads",
    // busquedas: "/api/busquedas",
    // congregacion: "/api/congregacion",
    // campo: "/api/campo",
    // tipoDocumento: "/api/tipodocumento",
    // genero: "/api/genero",
    // dosis: "/api/dosis",
    // ingreso: "/api/ingreso",
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
    this.app.use(express.static("./public"));
  }

  // Rutas
  routes(): void {
    // this.app.use('/', indexRoutes);
    // this.app.use(this.apiPaths.usuarios, usuariosRoutes);
    // this.app.use(this.apiPaths.login, loginRoutes);
    // this.app.use(this.apiPaths.ministerios, ministerioRoutes);
    // this.app.use(this.apiPaths.vacunas, vacunaRoutes);
    // this.app.use(this.apiPaths.permisos, permisoRoutes);
    // this.app.use(this.apiPaths.uploads, uploadsRoutes);
    // this.app.use(this.apiPaths.busquedas, busquedasRoutes);
    // this.app.use(this.apiPaths.congregacion, congregacionRoutes);
    // this.app.use(this.apiPaths.campo, campoRoutes);
    // this.app.use(this.apiPaths.tipoDocumento, tipoDocumentoRoutes);
    // this.app.use(this.apiPaths.genero, generoRoutes);
    // this.app.use(this.apiPaths.dosis, dosisRoutes);
    // this.app.use(this.apiPaths.ingreso, ingresoRoutes);

    this.app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "../public/index.html"));
    });
  }

  listen(): void {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en puerto", this.port);
    });
  }
}

export default Server;
