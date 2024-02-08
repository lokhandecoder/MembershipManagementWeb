import axios from 'axios';
import React from 'react'

export async function CreateUser() {
  try {
    const createuser = await axios.post(`http://localhost:5115/api/user`);
    return createuser.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
