import { z } from 'zod';

const dateFormatRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

export const QuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(150).optional(),
  offset: z.coerce.number().int().optional(),
  beforeDate: z
    .string()
    .regex(dateFormatRegex, {
      message:
        'Invalid date format. Date should be provided in format YYYY-MM-DDTHH:mm:ss.sssZ',
    })
    .optional(),
  afterDate: z
    .string()
    .regex(dateFormatRegex, {
      message:
        'Invalid date format. Date should be provided in format YYYY-MM-DDTHH:mm:ss.sssZ',
    })
    .optional(),
  status: z.enum(['in_progress', 'finished']).optional(),
  includeEditLink: z.boolean().optional(),
  sort: z.enum(['asc', 'desc']).optional(),
  filters: z.string().optional(),
});

export const FilterClauseSchema = z.object({
  id: z.string(),
  condition: z.enum(['equals', 'does_not_equal', 'greater_than', 'less_than']),
  value: z.union([z.string(), z.number()]),
});

export const ResponseFiltersSchema = z.array(FilterClauseSchema);
export type ResponseFiltersType = z.infer<typeof ResponseFiltersSchema>;
export type QuerySchemaType = z.infer<typeof QuerySchema>;
