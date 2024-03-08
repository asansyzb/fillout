import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { QuerySchemaType, ResponseFiltersType } from './schema';
import { ApiResponse } from './response';

@Injectable()
export class AppService {
  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.API_KEY;
  }

  async getHello(
    formId: string,
    query: Omit<QuerySchemaType, 'filters'>,
    filters: ResponseFiltersType | undefined,
  ): Promise<ApiResponse> {
    const limit = query.limit ? query.limit : 250;
    const offset = query.offset ? query.offset : 0;
    const url = new URL(
      `https://api.fillout.com/v1/api/forms/${formId}/submissions?${this.formSearchParams(query)}`,
    ).toString();

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });

      const data: ApiResponse = response.data;

      if (!filters || !filters.length) {
        return response.data;
      }

      const filteredResponses = data.responses.filter((response) =>
        filters.every((filter) => {
          const question = response.questions.find((q) => q.id === filter.id);

          if (!question) {
            return false;
          }

          switch (filter.condition) {
            case 'equals': {
              return question.value === filter.value;
            }
            case 'does_not_equal': {
              return question.value !== filter.value;
            }
            case 'greater_than': {
              return question.value > filter.value;
            }
            case 'less_than': {
              return question.value < filter.value;
            }
            default: {
              return false;
            }
          }
        }),
      );

      const responses = filteredResponses.slice(offset, limit + offset);
      const totalResponses = filteredResponses.length;
      const pageCount = Math.ceil(filteredResponses.length / limit);

      return {
        responses,
        totalResponses,
        pageCount,
      };
    } catch (error) {
      console.log('error', error);
      throw new Error('Error fetching responses from Fillout.com');
    }
  }

  private formSearchParams({
    afterDate,
    beforeDate,
    status,
    includeEditLink,
    sort,
  }: Omit<QuerySchemaType, 'filters' | 'limit' | 'offset'>): string {
    const searchParams: Record<string, string> = {};

    if (sort) {
      searchParams.sort = sort;
    }
    if (afterDate) {
      searchParams.afterDate = afterDate;
    }
    if (beforeDate) {
      searchParams.beforeDate = beforeDate;
    }
    if (status) {
      searchParams.status = status;
    }
    if (includeEditLink) {
      searchParams.includeEditLink = includeEditLink.toString();
    }

    return new URLSearchParams(searchParams).toString();
  }
}
