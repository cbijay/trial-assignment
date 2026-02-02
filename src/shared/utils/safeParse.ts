export const safeParse = <T>(data: unknown): T | null => {
  try {
    if (data === null || data === undefined) {
      return null;
    }

    if (typeof data === 'string') {
      try {
        return JSON.parse(data) as T;
      } catch {
        return data as T;
      }
    }

    if (typeof data === 'object') {
      return data as T;
    }

    return data as T;
  } catch (error) {
    console.error('Error parsing data:', error);
    return null;
  }
};

export const safeStringify = (data: unknown): string => {
  try {
    if (typeof data === 'string') {
      return data;
    }
    return JSON.stringify(data);
  } catch (error) {
    console.error('Error stringifying data:', error);
    return String(data);
  }
};

export const isValidJSON = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};
