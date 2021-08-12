export const isObject = (obj: any) => {
  return obj && typeof obj === 'object';
};

export const isArray = (obj: any) => {
  return obj && Array.isArray(obj);
};

export const isString = (obj: any) => {
  return obj && typeof obj === 'string';
};

export const isNumber = (obj: any) => {
  return obj && typeof obj === 'number';
};

export const isBoolean = (obj: any) => {
  return obj && typeof obj === 'boolean';
};

export const isFormData = (obj: any) => {
  return obj && obj instanceof FormData;
};
