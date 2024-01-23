import axios from "axios";
import { Plan } from "../Models/PlanModel";

export async function getPlans(): Promise<Plan[]> {
  try {
    const response = await axios.get('http://localhost:8082/api/plan/GetPlansAsync');
    return response.data;
  } catch (error) {
    console.error('Error fetching plan data:', error);
    throw error;
  }
}
