import { Router } from "express";
import { check } from "express-validator";
import { customerController } from "../../controllers/customer.controller";

class CustomersRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    const router = Router();
    this.router.get("/", customerController.getCustomer);

    this.router.post("/", customerController.createCustomer);
  }
}

const customerRoutes = new CustomersRoutes();
export default customerRoutes.router;
