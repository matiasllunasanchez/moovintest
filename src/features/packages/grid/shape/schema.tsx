import { z } from "zod";

export const packageSchema = z.object({
  id: z.string(),
  address: z.string(),
  status: z.string(),
  destinatary: z.string(),
  client: z.string(),
});

export type Package = z.infer<typeof packageSchema>;
