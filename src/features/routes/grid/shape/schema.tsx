import { z } from "zod";

export const routeSchema = z.object({
  id: z.string(),
  routeName: z.string(),
  routeDetail: z.string(),
  deliveredDate: z.string(),
  mooverName: z.string(),
  status: z.string(),
});

export type Route = z.infer<typeof routeSchema>;
