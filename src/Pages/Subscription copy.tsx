import React, { useState, useEffect } from 'react';
import LayoutComponent from '../Components/Fixed/LayoutComponent';
import GenericTable from '../Components/Fixed/GenericTableAtn';
import { Plan } from '../Models/PlanModel';
import { getPlans } from '../Services/PlanService';
import { error } from 'console';
import { getSubscriptions, getSubscriptionsByPlanId } from '../Services/SubscriptionService';
import { GetMembersAsync } from '../Services/MembersServices';
import { Member } from '../Models/MemberModel';

interface Column {
  id: string;
  label: string;
}

interface Row {
  [key: string]: string | number;
}



const Subscription: React.FC = () => {
  const [apiData, setApiData] = useState<{ columns: Column[]; rows: Row[] }>({ columns: [], rows: [] });
  const [planOptions, setPlanOptions] = useState<Plan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');

  useEffect(() => {

      getPlans()
      .then((planDataFromApi: Plan[]) => {
        setPlanOptions(planDataFromApi);
      })
      .catch(error => {
        console.error('Error fetching plan data:', error);
      })

  }, []);

  const fetchSubscriptions = async (planId?: string) => {
    try {
      const response = await getSubscriptionsByPlanId(selectedPlanId); // Call the new function with planId
      const columns: Column[] = Object.keys(response[0]).map(key => ({ id: key, label: key }));
      setApiData({ columns, rows: response });
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  };

  useEffect(() => {
    fetchSubscriptions(); 
  }, []);

  const handlePlanChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlanId(event.target.value);
    await fetchSubscriptions(event.target.value); // Fetch subscriptions with selected planId
  };


  return (
    <LayoutComponent>

<select onChange={handlePlanChange} value={selectedPlanId}>
        <option value="">Select a plan</option>
        {planOptions.map((plan, index) => (
          <option key={index} value={plan.id}>
            {plan.planName}
          </option>
        ))}
      </select>

      {/* Render the table with filtered rows */}
      <GenericTable data={{ columns: apiData.columns, rows: apiData.rows }} />
    </LayoutComponent>
  );
};

export default Subscription;

