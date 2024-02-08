import axios from "axios";
import { Row } from "../Models/RowModel";
 // Replace with the correct path to your Row model

export async function getSubscriptions(): Promise<Row[]> {
  try {
    const response = await axios.get('http://localhost:5115/api/Subscription/GetSubscriptionsAsync');
    return response.data;
  } catch (error) {
    console.error('Error fetching subscription data:', error);
    throw error;
  }
}

export async function getSubscriptionsByPlan(planId: string): Promise<Row[]> {
  try {
    const response = await axios.get(`http://localhost:5115/api/subscription/GetSubscriptionsByPlanAsync/${planId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching subscriptions by planId:', error);
    throw error;
  }
}

export async function getSubscriptionsByPlanId(planId: string, page: number, pageSize: number): Promise<Row[]> {
  try {
    const response = await axios.get(`http://localhost:5115/api/subscription/GetSubscriptionsByPlanIdAsync/${planId}?page=${page}&pageSize=${pageSize}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching subscriptions by planId:', error);
    throw error;
  }
}

export async function GetSubscriptionsByPagination(
  page: number,
  limit: number
): Promise<{ data: Row[]; totalPages: number }> {
  try {
    const response = await axios.get(
      `http://localhost:5115/api/subscription/GetSubscriptionsByPagination/${page}/${limit}`
    );

    // Assuming the API response structure:
    // {
    //   data: Row[],
    //   totalPages: number
    // }
    return response.data;
  } catch (error) {
    console.error('Error fetching subscriptions with pagination:', error);
    throw error;
  }
}
