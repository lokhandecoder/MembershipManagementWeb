import axios from "axios";
import { Member } from "../Models/MemberModel";

export async function GetMemberByID(id : string): Promise<Member> {
  try {
    // const getData = await axios.get(`http://localhost:8083/api/members/${id}`);
    const getData = await axios.get(`http://localhost:5115/api/members/${id}`);
    console.log("getData", getData.data);
    return getData.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function GetAllMembers() {
  try{
    // const getData = await axios.get('http://localhost:8083/api/members');
    const getData = await axios.get('http://localhost:5115/api/members');
    console.log("GetData", getData.data);
    return getData.data;
  } catch (error){
    console.error(error);
    throw error;
  }
}

export async function GetAllGenders() {
  try{
    // const getData = await axios.get('http://localhost:8083/api/gender');
    const getData = await axios.get('http://localhost:5115/api/gender');
    console.log("GetData", getData.data);
    return getData.data;
  } catch (error){
    console.error(error);
    throw error;
  }
}

export async function GetMemberByGenderId(id:number) {
  try{
    // const getData = await axios.get('http://localhost:8083/api/gender');
    const getData = await axios.get(`http://localhost:5115/api/members/genderId/${id}`);
    console.log("GetData", getData.data);
    return getData.data;
  } catch (error){
    console.error(error);
    throw error;
  }
}