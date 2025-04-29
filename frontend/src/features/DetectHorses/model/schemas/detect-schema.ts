import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES_IMAGE = ["image/png", "image/jpg", "image/jpeg"];

export const DetectSchema = z.object({
  file: z
    .instanceof(File, { message: "Загрузите изображение" })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "Максимальный размер изображения не должен превышать 5МБ",
    })
    .refine((file) => ACCEPTED_TYPES_IMAGE.includes(file.type), {
      message:
        "Данный тип изображения не поддерживается! Поддерживаемые типы: PNG, JPG и JPEG",
    }),
});

export type DetectSchemaType = z.infer<typeof DetectSchema>;
