import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ZodValidationPipe } from './pipe';
import { QuerySchema, QuerySchemaType, ResponseFiltersSchema } from './schema';
import { ApiResponse } from './response';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/:formId/filteredResponses')
  async getHello(
    @Param('formId') formId: string,
    @Query(new ZodValidationPipe(QuerySchema)) query: QuerySchemaType,
  ): Promise<ApiResponse> {
    try {
      const filters =
        query.filters && ResponseFiltersSchema.parse(JSON.parse(query.filters));

      return this.appService.getHello(formId, query, filters);
    } catch (e) {
      throw new BadRequestException('Invalid filters');
    }
  }
}
