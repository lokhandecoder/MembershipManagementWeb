import axios from "axios";
import { Member } from "../Models/MemberModel";

export async function GetMemberByID(id: string): Promise<Member | undefined> {
  try {
    const getData = await axios.get(`http://localhost:8083/api/members/${id}`);
    console.log("getData", getData.data);
    return getData.data;
  } catch (error) {
    console.error(error);
    // Return undefined or any default value you want to provide
    return undefined;
  }
}
