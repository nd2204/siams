import { Router } from "express";

export function deviceRouter(): Router {
  const router = Router();

  router.post("/", async (req, res) => {
    /* TODO: Add new device */
  })

  router.get("/:id", async (req, res) => {
    /* TODO: Get device from id */
  });

  router.put("/:id", async (req, res) => {
    /* TODO: Update device with id */
  });

  router.delete("/:id", async (req, res) => {
    /* TODO: Remove device with id */
  });

  return router;
}
