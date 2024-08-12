import { config } from "dotenv";

export default  async () => {
    config({path: `env/${process.env.NODE_ENV}.env`}); //correspond env path to  eg. env/dev.env if dev mode and vice versa
}