import express from "express";
const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ message: "API está funcionando!" });
});

export default router;
