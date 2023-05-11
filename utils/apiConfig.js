const baseURL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT;

export const addUser = `${baseURL}/enter-user`;
export const getUser = `${baseURL}/user-socket`;
