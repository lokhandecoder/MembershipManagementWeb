import axios from "axios";

export async function GetSubscriptionsCount() {
  try{
    // const getData = await axios.get(`http://localhost:8087/api/getalldetails/GetSubscriptionsCountAsync`);
    const getData = await axios.get(`http://localhost:5117/api/getalldetails/GetSubscriptionsCountAsync`);
    // console.log(getData.data)
    return getData.data;
  } catch (error){
    console.error(error);
    throw error;
  }
}

export async function GetMembersCount() {
  try{
    // const getData = await axios.get(`http://localhost:8087/api/getalldetails/GetSubscriptionsCountAsync`);
    const getData = await axios.get(`http://localhost:5117/api/getalldetails/GetMembersCountAsync`);
    // console.log(getData.data)
    return getData.data;
  } catch (error){
    console.error(error);
    throw error;
  }
}

export async function GetUsersCount() {
  try{
    // const getData = await axios.get(`http://localhost:8087/api/getalldetails/GetSubscriptionsCountAsync`);
    const getData = await axios.get(`http://localhost:5117/api/getalldetails/GetUsersCountAsync`);
    // console.log(getData.data)
    return getData.data;
  } catch (error){
    console.error(error);
    throw error;
  }
}

export async function GetSubscriptionsBasedonTime() {
  try{
    // const getData = await axios.get(`http://localhost:8087/api/getalldetails/GetSubscriptionsBasedonTimeAsync`);
    const getData = await axios.get(`http://localhost:5117/api/getalldetails/GetSubscriptionsBasedonTimeAsync`);
    // console.log(getData.data)
    return getData.data;
  } catch (error){
    console.error(error);
    throw error;
  }
}

export async function GetSubscriptionsAmount() {
  try{
    // const getData = await axios.get(`http://localhost:8087/api/getalldetails/GetSubscriptionsAmountAsync`);
    const getData = await axios.get(`http://localhost:5117/api/getalldetails/GetSubscriptionsAmountAsync`);
    // console.log(getData.data)
    return getData.data;
  } catch (error){
    console.error(error);
    throw error;
  }
}

export async function GetSubscriptionsDiscount() {
  try{
    // const getData = await axios.get(`http://localhost:8087/api/getalldetails/GetSubscriptionsDiscountAsync`);
    const getData = await axios.get(`http://localhost:5117/api/getalldetails/GetSubscriptionsDiscountAsync`);
    // console.log(getData.data)
    return getData.data;
  } catch (error){
    console.error(error);
    throw error;
  }
}

export async function GetSubscriptionStatus() {
  try{
    // const getData = await axios.get(`http://localhost:8087/api/getalldetails/GetSubscriptionStatus`);
    const getData = await axios.get(`http://localhost:5117/api/getalldetails/GetSubscriptionStatus`);
    // console.log(getData.data)
    return getData.data;
  } catch (error){
    console.error(error);
    throw error;
  }
}