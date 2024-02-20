import axios from "axios";
import { AddSubscriptionModel, SubscriptionModel } from "../Models/SubscriptionModel";
import { OnPayModel, PaymentModel } from "../Models/PaymentModel";

export async function GetSubscription() {
  try{
    // const getData = await axios.get(`http://localhost:8087/api/subscription/getsubscriptionsasync`);
    const getData = await axios.get(`http://localhost:5116/api/subscription/getsubscriptionsasync`);
    // console.log(getData.data)
    return getData.data;
  } catch (error){
    console.error(error);
    throw error;
  }
}

export async function CreateSubscription(body: AddSubscriptionModel) {
  try{
    const addData = await axios.post(`http://localhost:5116/api/subscription/CreateSubscriptionAsync`, body);
    // const getData = await axios.get(`http://localhost:5116/api/subscription/getsubscriptionsasync`);
    // console.log(getData.data)
    return addData.data;
  } catch (error){
    console.error(error);
    throw error;
  }
}

export async function UpdateSubscription(id: string, body: AddSubscriptionModel) {
  try{
    const updateData = await axios.put(`http://localhost:5116/api/subscription/UpdateUserSubscriptionAsync/${id}`, body);
    // const getData = await axios.get(`http://localhost:5116/api/subscription/getsubscriptionsasync`);
    // console.log(getData.data)
    return updateData.data;
  } catch (error){
    console.error(error);
    throw error;
  }
}


export async function GetPlans() {
  try{
    const getData = await axios.get(`http://localhost:8087/api/plan/getplansasync`);
    // const getData = await axios.get(`http://localhost:5116/api/plan/getplansasync`);
    // console.log(getData.data)
    return getData.data;
  } catch (error){
    console.error(error);
    throw error;
  }
}

export async function DeleteSubscriptionById(id:string) {
  try{
    const deleteData = await axios.delete(`http://localhost:8087/api/subscription/DeleteSubscriptionAsync/${id}`);
    // const deleteData = await axios.delete(`http://localhost:5116/api/subscription/DeleteSubscriptionAsync/${id}`);
    return deleteData.data;
  } catch (error){
    console.error(error);
    throw error;
  }
}

export async function Payment(body: PaymentModel): Promise<PaymentModel> {
  try{
    // const deleteData = await axios.delete(`http://localhost:8087/api/subscription/DeleteSubscriptionAsync/${id}`);
    const paymentData = await axios.post(`http://localhost:5117/api/payment/`, body);
    return paymentData.data;
  } catch (error){
    console.error(error);
    throw error;
  }
}