import React, { useState, useEffect } from 'react';
import LayoutComponent from '../Components/Fixed/LayoutComponent';
import GenericTable from '../Components/Fixed/GenericTableAtn';
import { Plan } from '../Models/PlanModel';
import { getPlans } from '../Services/PlanService';
import { error } from 'console';
import { getSubscriptions } from '../Services/SubscriptionService';
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
  const [memberOptions, setMembersOptions] = useState<Member[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');

  useEffect(() => {

      getSubscriptions()
      .then((apiDataFromApi: Row[]) => {
        const columns: Column[] = Object.keys(apiDataFromApi[0]).map(key => ({ id: key, label: key }));
        setApiData({ columns, rows: apiDataFromApi });
      })
      .catch(error => {
        console.error('Error fetching subscription data:', error);
      });

      getPlans()
      .then((planDataFromApi: Plan[]) => {
        setPlanOptions(planDataFromApi);
      })
      .catch(error => {
        console.error('Error fetching plan data:', error);
      })




  }, []);


  const filteredRows = selectedPlanId
  ? apiData.rows.filter(row => row.planId === selectedPlanId)
  : apiData.rows;
  return (
    <LayoutComponent>
      {/* Render your dropdown here using the planOptions state */}
      {/* <select onChange={(e) => setSelectedPlanId(e.target.value)}>
        <option value="">Select a plan</option>
        {planOptions.map((plan, index) => (
          <option key={index} value={plan.id}>
            {plan.planName}
          </option>
          
        ))}
      </select> */}
      <select onChange={(e) => setSelectedPlanId(e.target.value)}>
        <option value="">Select a member</option>
        {planOptions.map((plan, index) => (
          <option key={index} value={plan.id}>
            {plan.planName}
          </option>
          
        ))}
      </select>

      {/* Render the table with filtered rows */}
      <GenericTable data={{ columns: apiData.columns, rows: filteredRows }} />
    </LayoutComponent>
  );
};

export default Subscription;

