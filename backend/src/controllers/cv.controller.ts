import { Response } from "express";
import { AppDataSource } from "../config/db";
import { Cv } from "../entities/Cv";
import { AuthRequest } from "../types/auth.request";
import { CVData } from "../types/cv.request";

const cvRepository = AppDataSource.getRepository(Cv);

export const getMyResume = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Usuario no autenticado",
      });
    }

    const userId = req.user.id;

    const cv = await cvRepository.findOne({
      where: {
        userId,
      },
    });

    if (!cv) {
      return res.json({
        data: null,
        message: "El usuario todavía no tiene un CV",
      });
    }

    return res.json({
      data: cv.data,
    });
  } catch (error) {
    console.error("Error al obtener CV:", error);

    return res.status(500).json({
      message: "No se pudo obtener el CV",
    });
  }
};

export const saveMyResume = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Usuario no autenticado",
      });
    }

    const userId = req.user.id;

    const newCV = req.body as CVData;

    const cv = await cvRepository.findOne({
      where: {
        userId,
      },
    });

    // Si todavía no existe un CV para este usuario
    if (!cv) {
      const newCv = cvRepository.create({
        userId,
        data: newCV as unknown as Record<string, unknown>,
      });

      await cvRepository.save(newCv);

      return res.status(201).json({
        message: "CV creado correctamente",
        changed: true,
        data: newCv.data,
      });
    }

    // Comparar el CV actual con el nuevo
    const currentJSON = JSON.stringify(cv.data);
    const newJSON = JSON.stringify(newCV);

    // No hay cambios
    if (currentJSON === newJSON) {
      return res.json({
        message: "No hubo cambios",
        changed: false,
        data: cv.data,
      });
    }

    // Sí hubo cambios
    cv.data = newCV as unknown as Record<string, unknown>;

    await cvRepository.save(cv);

    return res.json({
      message: "CV actualizado correctamente",
      changed: true,
      data: cv.data,
    });
  } catch (error) {
    console.error("Error al guardar CV:", error);

    return res.status(500).json({
      message: "No se pudo guardar el CV",
    });
  }
};
