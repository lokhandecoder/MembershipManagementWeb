import axios from "axios";
import { Member } from "../Models/MemberModel";
import { error } from "console";

export async function GetMemberByID(id : string): Promise<Member> {
  try {
    const getData = await axios.get(`http://localhost:8083/api/members/${id}`);

    console.log("getData", getData.data);
    return getData.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function GetAllMembers() {
  try{
    const getData = await axios.get('http://localhost:8083/api/members');
    console.log("GetData", getData.data);
    return getData.data;
  } catch (error){
    console.error(error);
    throw error;
  }
}
