import axios from "axios";
import React from "react";
import { UserSignIn, UserSignup } from "../Models/UserModel";

export async function AddUser(body: UserSignup): Promise<UserSignup> {
  try {
    const adduser = await axios.post(`http://localhost:5115/api/user`, body);
    return adduser.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function UserLogin(body: UserSignIn): Promise<any> {
  try {
    const adduser = await axios.post(
      `http://localhost:5115/api/auth/login`,
      body
    );
    return adduser.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function UserById(id: any): Promise<any> {
  try {
    const getuser = await axios.get(`http://localhost:5115/api/user/${id}`);
    return getuser.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
