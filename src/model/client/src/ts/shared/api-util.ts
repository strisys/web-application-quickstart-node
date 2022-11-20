export const baseApiUrl = `/api/v1.0`;

export const getApiPath = (subpath: ApiEndpointPath): string => {
  return `${baseApiUrl}/${subpath}`;
}

export type ApiEndpointPath = ('tasks' | 'query/sales' | 'query/data-viewer');