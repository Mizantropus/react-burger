export type TIngredientType = 'bun' | 'main' | 'sauce';

export type TIngredient = {
  _id: string;
  name: string;
  type: TIngredientType;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
  __v: number;
  constructorId?: string;
};

export type TIngredientCountMap = Record<string, number>;

export type TUser = {
  email: string;
  name: string;
  password?: string;
};

export type TAuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type TLoginData = {
  email: string;
  password: string;
};

export type TRegisterData = TLoginData & {
  name: string;
};

export type TResetPasswordData = {
  password: string;
  token: string;
};

export type TReqToResetPasswordData = {
  email: string;
};

export type TResponseBody<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
};

export type TResponseWithExtras<
  T = unknown,
  Extra extends Record<string, unknown> = Record<string, unknown>,
> = TResponseBody<T> & Extra;

export type TOrderResponse = {
  order: {
    number: number;
  };
};

export type TUpdateUserDataInput = Partial<TUser>;

export type TUpdateResult = {
  success: boolean;
  user: TUser;
  message?: string;
};

export type TLoginResult = {
  success: boolean;
  user: TUser;
  message?: string;
};

export type TAuthApiResponse = TResponseWithExtras<{ user: TUser }, TAuthTokens>;

export type TIngredientGroups = {
  Булки: TIngredient[];
  Начинки: TIngredient[];
  Соусы: TIngredient[];
};
