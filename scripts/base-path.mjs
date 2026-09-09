export function basePath(value = process.env.BASE_PATH || '') {
  const path = value.replace(/^\/+|\/+$/g, '');
  if (path && !/^[\w-]+(?:\/[\w-]+)*$/.test(path)) throw new Error('BASE_PATH must be a simple URL path');
  return path ? `/${path}` : '';
}
