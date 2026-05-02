import express from "express";
import authRouter from "./modules/auth/auth.router";
import inventoryRouter from "./modules/inventory/inventory.router";
import salesRouter from "./modules/sales/sales.router";
import customersRouter from "./modules/customers/customers.router";
import tailorRouter from "./modules/tailor/tailor.router";
import expensesRouter from "./modules/expenses/expenses.router";
import reportsRouter from "./modules/reports/reports.router";
import usersRouter from "./modules/users/users.router";
import settingsRouter from "./modules/settings/settings.router";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  app.use((_req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", process.env.CORS_ORIGIN ?? "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Authorization,Content-Type");
    if (_req.method === "OPTIONS") {
      res.sendStatus(204);
      return;
    }
    next();
  });

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", store: "İL & AY – Pərdə & Jalüz" });
  });

  app.get("/api", (_req, res) => {
    res.json({
      success: true,
      data: {
        name: "İL & AY POS API",
        version: "2.0",
        modules: ["auth", "inventory", "sales", "customers", "tailor", "expenses", "reports", "users", "settings"]
      }
    });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/inventory", inventoryRouter);
  app.use("/api/sales", salesRouter);
  app.use("/api/customers", customersRouter);
  app.use("/api/tailor", tailorRouter);
  app.use("/api/expenses", expensesRouter);
  app.use("/api/reports", reportsRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/settings", settingsRouter);

  app.use((_req, res) => {
    res.status(404).json({ success: false, error: "Endpoint tapılmadı" });
  });

  return app;
}
