const port = process.env.PORT ? Number(process.env.PORT) : 3333;

if (Number.isNaN(port)) {
  throw new Error("Env var PORT precisa ser um número válido");
}

export const env = {
  port,
};
