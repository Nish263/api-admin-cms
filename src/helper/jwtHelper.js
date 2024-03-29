import jwt from "jsonwebtoken";
import { updateAdmin } from "../models/admin/Admin.model.js";
import {
  deleteSession,
  insertSession,
} from "../models/session/Session.model.js";

export const signAccessJwt = async (payload) => {
  const accessJWT = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
  const obj = {
    token: accessJWT,
    type: "jwt",
  };
  await insertSession(obj);
  return accessJWT;
};

export const verifyAccessJwt = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    if (error.message === "jwt expired") {
      deleteSession({ type: "jwt", token });
    }
    console.log(error.message);
    return error.message;
  }
};

export const verifyRefreshJwt = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

export const signRefreshJwt = async (payload) => {
  const refreshJWT = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });

  await updateAdmin({ email: payload.email }, { refreshJWT });
  return refreshJWT;
};

export const createJWTs = async (payload) => {
  return {
    accessJWT: await signAccessJwt(payload),
    refreshJWT: await signRefreshJwt(payload),
  };
};
