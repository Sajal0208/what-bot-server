import prisma from "../db";
const bcrypt = require("bcryptjs");
require("dotenv").config();
import { getToken } from "../utils/token";

type TRegisterUserData = {
  email: string;
  name: string;
  password: string;
  mobile: string;
};

type TLoginUserData = {
  email: string;
  password: string;
};

type TUpdateUserData = {
  email?: string;
  name?: string;
  mobile?: string;
  token?: string;
  isAuthenticated?: boolean;
};

const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  } catch (e) {
    return null;
  }
};

const getUserById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  return user;
};

const updateUserById = async (id: number, data: TUpdateUserData) => {
  try {
    const user = getUserById(id);
    if (!user) {
      throw new Error("User does not exist");
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        ...data,
      },
    });

    return updatedUser;
  } catch (e: any) {
    throw new Error(e.message);
  }
};

const registerUser = async (data: TRegisterUserData) => {
  const { email, name, password, mobile } = data;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const maxAge = 2 * 60 * 60;
  const token = getToken(email, maxAge);

  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        mobile,
        token,
      },
    });
    return { newUser, token, maxAge };
  } catch (e: any) {
    throw new Error(e.message);
  }
};

const loginUser = async (data: TLoginUserData) => {
  const { email, password } = data;
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("User does not exist");
  }
  const validPassword = await bcrypt.compare(data.password, user.password);
  const maxAge = 2 * 60 * 60;
  const token = getToken(email, maxAge);
  const updatedUser = await updateUserById(user.id, { token });
  return {
    user: updatedUser,
    validPassword,
    token,
    maxAge,
  };
};

export { getUserByEmail, getUserById, registerUser, loginUser, updateUserById };
