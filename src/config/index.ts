import * as dev from "./dev";

const getConfig = (config?: string) => {
  switch (config?.toLowerCase?.()) {
    default:
      return dev;
  }
};
const config = getConfig(import.meta.env.VITE_ENV);

export default config;
