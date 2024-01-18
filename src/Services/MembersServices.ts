import axios from "axios";
import { Member } from "../Models/MemberModel";

export async function GetMemberByID(id : string): Promise<Member> {
  try {
    const getData = await axios.get(`http://localhost:8083/api/members/${id}`);

    console.log("getData", getData.data);
    return getData.data;
  } catch (error) {
    console.error(error);
    // Handle the error here, either by returning a default value or rethrowing the error
    throw error;
  }
}
