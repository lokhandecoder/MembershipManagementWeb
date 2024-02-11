import axios from "axios";
import { SubscriptionModel } from "../Models/SubscriptionModel";

export async function GetSubscription() {
  try{
    // const getData = await axios.get(`http://localhost:8087/api/subscription/getsubscriptionsasync`);
    const getData = await axios.get(`http://localhost:5116/api/subscription/getsubscriptionsasync`);
    console.log(getData.data)
    return getData.data;
  } catch (error){
    console.error(error);
    throw error;
  }
}

export async function GetPlans() {
  try{
    // const getData = await axios.get(`http://localhost:8087/api/plan/getplansasync`);
    const getData = await axios.get(`http://localhost:5116/api/plan/getplansasync`);
    console.log(getData.data)
    return getData.data;
  } catch (error){
    console.error(error);
    throw error;
  }
}

export async function DeleteSubscriptionById(id:string) {
  try{
    // const deleteData = await axios.delete(`http://localhost:8087/api/subscription/DeleteSubscriptionAsync/${id}`);
    const deleteData = await axios.delete(`http://localhost:5116/api/subscription/DeleteSubscriptionAsync/${id}`);
    return deleteData.data;
  } catch (error){
    console.error(error);
    throw error;
  }
}