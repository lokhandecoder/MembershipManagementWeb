import axios from "axios";
import { Member } from "../Models/MemberModel";

export async function GetMemberByID(id : string): Promise<Member> {
  try {
    const getData = await axios.get(`http://localhost:8083/api/members/${id}`);
    // const getData = await axios.get(`http://localhost:5115/api/members/${id}`);
    console.log("getData", getData.data);
    return getData.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function GetMembers(page: number = 1, pageSize: number = 10) {
  try{
    const getData = await axios.get(`http://localhost:8083/api/members/paginated?page=${page}&pageSize=${pageSize}`);
    // const getData = await axios.get('http://localhost:5115/api/members');
    console.log("GetData", getData.data);
    return getData.data;
  } catch (error){
    console.error(error);
    throw error;
  }
}

export async function GetAllMembers() {
  try{
    const getData = await axios.get(`http://localhost:8083/api/members/`);
    // const getData = await axios.get('http://localhost:5115/api/members');
    console.log("GetData", getData.data);
    return getData.data;
  } catch (error){
    console.error(error);
    throw error;
  }
}

export async function GetAllGenders() {
  try{
    const getData = await axios.get('http://localhost:8083/api/gender');
    // const getData = await axios.get('http://localhost:5115/api/gender');
    console.log("GetData", getData.data);
    return getData.data;
  } catch (error){
    console.error(error);
    throw error;
  }
}

export async function GetAllMemberByGenderId(id:number) {
  try{
    const getData = await axios.get(`http://localhost:8083/api/members/genderId/${id}`);
    // const getData = await axios.get(`http://localhost:5115/api/members/genderId/${id}`);
    console.log("GetData", getData.data);
    return getData.data;
  } catch (error){
    console.error(error);
    throw error;
  }
}

export async function GetMemberByGenderId(id:number, page: number = 1, pageSize: number = 10) {
  try{
    const getData = await axios.get(`http://localhost:8083/api/members/genderId/paginated/${id}?page=${page}&pageSize=${pageSize}`);
    // const getData = await axios.get(`http://localhost:5115/api/members/genderId/${id}`);
    console.log("GetData", getData.data);
    return getData.data;
  } catch (error){
    console.error(error);
    throw error;
  }
}

export async function GetMemberBasedOnFilter(body: any, page: number = 1, pageSize: number = 10) {
  try{
    const getData = await axios.get(`http://localhost:5115/api/members/genderId/paginated?page=${page}&pageSize=${pageSize}`, body)
    console.log("GetData", getData.data);
    return getData.data;
  } catch (error){
    console.error(error);
    throw error;
  }
}