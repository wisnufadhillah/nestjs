export type JwtPayload = {
  sub: number;
  email: string;
};

export type CurrentUser = {
  id: number;
  email: string;
};
