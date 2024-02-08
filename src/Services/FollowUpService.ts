import { promises } from "dns";

import axios from "axios";
import { FilterDto, FollowUpModel } from "../Models/FollowUpModel";

export async function GetFollowUps() {
  try {
    const getData = await fetch(`http://localhost:5115/api/followup`)
      .then(response => response.json());
    return [getData]; // Wrap the result in an array
  } catch (error) {
    console.error(error);
    throw error;
  }
}

  export async function GetFollowUpAction(){
    try{
      const getFollowUpAction = await fetch(`http://localhost:5115/api/followupAction`)
      .then(response => response.json());
      return getFollowUpAction;
    }
    catch (error) {
      console.error(error);
      throw error;
    }
  }
      export async function GetFollowUpByMemberId(id:string): Promise<FollowUpModel>{
        try {
            const getData = await axios.get(`http://localhost:8081/api/followup/GetFollowUpByFilterAsync/${id}`);
        
            console.log("getData", getData.data);
            return getData.data;
          } catch (error) {
            console.error(error);
            throw error;
          }   
}
export async function GetFollowUpById(id:string): Promise<FollowUpModel> {
  try {
    const getData = await fetch(`http://localhost:5115/api/followup/${id}`)
      .then(response => response.json());
    return getData; // Wrap the result in an array
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function GetFollowUpBasedOnFilter(body: FilterDto, page: number = 1, pageSize: number = 7) {
  try{
    const apiUrl = `http://localhost:5115/api/followup/GetFollowUpByFilterAsync?page=${page}&limit=${pageSize}`;
    console.log("filterapi",body)
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          memberId: body.memberId,
          followUpDate: body.followUpDate,
          nextFollowUpDate: body.nextFollowUpDate
        }),
      });
    return response.json();
  } catch (error){
    console.error(error);
    throw error;
  }
}
