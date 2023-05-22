import fs from "fs";
import AgentModel from "../models/agent.model";
import CustomerModel from "../models/customer.model";

const deleteImagen = async (path: string) => {
  if (fs.existsSync(path)) {
    // Borrar la imagen anterior
    fs.unlinkSync(path);
  }
};

const updateImage = async (id: string, type: string, name: string) => {
  let pathViejo = "";
  const idImagen = String(id);

  switch (type) {
    case "agents":
      const agent = await AgentModel.findById(id);

      if (!agent) {
        return false;
      }

      pathViejo = `./src/public/agents/${agent.img}`;

      await deleteImagen(pathViejo);

      agent.img = name;
      await agent.save();

      return true;
      break;

    case "customers":
      const customer = await CustomerModel.findById(id);

      if (!customer) {
        return false;
      }

      pathViejo = `./src/public/customers/${customer.img}`;
      await deleteImagen(pathViejo);

      customer.img = name;
      await customer.save();

      return true;
      break;
  }
};

export default updateImage;
