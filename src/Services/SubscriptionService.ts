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

export async function getSubscriptionsByPlanId(planId: string): Promise<Row[]> {
  try {
    const response = await axios.get(`http://localhost:5115/api/subscription/GetSubscriptionsByPlanIdAsync/${planId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching subscriptions by planId:', error);
    throw error;
  }
}
