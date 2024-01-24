import axios from "axios";
import { Plan } from "../Models/PlanModel";

export async function getPlans(): Promise<Plan[]> {
  try {
    const response = await axios.get('http://localhost:5115/api/plan/getplansasync');
    return response.data;
  } catch (error) {
    console.error('Error fetching plan data:', error);
    throw error;
  }
}
