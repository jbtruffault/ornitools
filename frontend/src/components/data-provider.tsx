"use client";

import type { DataProvider } from "@refinedev/core";
import apiClient from "@/tanstack/features/client";

const dataProvider: DataProvider = {
  // required methods
  getList: async ({ resource, pagination, sorters, filters }) => {
    const params: Record<string, string | number | undefined> = {
      ...(pagination?.current && pagination?.pageSize
        ? { page: pagination.current, pageSize: pagination.pageSize }
        : {}),
      ...(sorters?.length
        ? { sort: sorters.map((sort) => `${sort.field}:${sort.order}`).join(",") }
        : {}),
    };

    if (filters){
      filters.forEach((filter) => {
        switch (filter.operator) {
          case "eq":
            params[filter.field] = filter.value;
            break;
          case "ne":
            params[`${filter.field}__ne`] = filter.value;
            break;
          case "lt":
            params[`${filter.field}__lt`] = filter.value;
            break;
          case "lte":
            params[`${filter.field}__lte`] = filter.value;
            break;
          case "gt":
            params[`${filter.field}__gt`] = filter.value;
            break;
          case "gte":
            params[`${filter.field}__gte`] = filter.value;
            break;
          case "in":
            params[`${filter.field}__in`] = filter.value.join(",");
            break;
          case "contains":
            params[`${filter.field}__contains`] = filter.value;
            break;
          case "startswith":
            params[`${filter.field}__startswith`] = filter.value;
            break;
          case "endswith":
            params[`${filter.field}__endswith`] = filter.value;
            break;
          default:
            console.warn(`Unsupported filter operator: ${filter.operator}`);
        }
      });
    }

    const response = await apiClient.get(`/${resource}`, { params });

    return {
      data: response.data,
      total: response.data.length,
    };
  },

  getOne: async ({ resource, id }) => {
    const response = await apiClient.get(`/${resource}/${id}`);
    return {
      data: response.data,
    };
  },

  create: async ({ resource, variables }) => {
    const response = await apiClient.post(`/${resource}`, variables);
    return {
      data: response.data,
    };
  },

  update: async ({ resource, id, variables }) => {
    const response = await apiClient.put(`/${resource}/${id}/`, variables);
    return {
      data: response.data,
    };
  },

  deleteOne: async ({ resource, id }) => {
    const response = await apiClient.delete(`/${resource}/${id}`);
    return {
      data: response.data,
    };
  },

  getApiUrl: () => apiClient.defaults.baseURL || "",

  // optional methods
  getMany: async ({ resource, ids }) => {
    const response = await apiClient.get(`/${resource}`, {
      params: {
        id: ids // Assuming API can handle multiple ids via query parameter
      },
    });
    return {
      data: response.data,
    };
  },

  createMany: async ({ resource, variables }) => {
    const response = await apiClient.post(`/${resource}/bulk`, variables);
    return {
      data: response.data,
    };
  },

  deleteMany: async ({ resource, ids }) => {
    const response = await apiClient.delete(`/${resource}/bulk`, {
      data: { ids } // Assuming bulk delete accepts ids in the request body
    });
    return {
      data: response.data,
    };
  },

  updateMany: async ({ resource, ids, variables }) => {
    const response = await apiClient.put(`/${resource}/bulk`, {
      ids, // Assuming bulk update accepts ids and variables
      ...variables
    });
    return {
      data: response.data,
    };
  },

  custom: async ({ url, method, filters, sorters, payload, query, headers }) => {
    const response = await apiClient({
      url,
      method,
      params: {
        ...query,
        ...filters,
        ...sorters
      },
      data: payload,
      headers,
    });
    return {
      data: response.data,
    };
  },
};

export { dataProvider };