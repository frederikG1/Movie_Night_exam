import { Router } from "express";

const router = Router();

export function isLoggedIn(req, res, next) {
  if (!req.session.user) {
    res.status(401).send({ errorMessage: "You are not not logged in" });
  }
  next();
}

export default router;
