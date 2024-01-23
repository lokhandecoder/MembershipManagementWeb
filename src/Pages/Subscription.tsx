import React, { useState, useEffect } from 'react';
import LayoutComponent from '../Components/Fixed/LayoutComponent';
import GenericTable from '../Components/Fixed/GenericTableAtn';
import { Plan } from '../Models/PlanModel';
import { getPlans } from '../Services/PlanService';
import { error } from 'console';
import { getSubscriptions } from '../Services/SubscriptionService';

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
    // Fetch data from the subscription API endpoint
    // fetch('http://localhost:8082/api/subscription/getsubscriptionsasync')
    //   .then(response => response.json())
    //   .then((apiDataFromApi: Row[]) => {
    //     // Assuming apiDataFromApi is an array of objects
    //     const columns: Column[] = Object.keys(apiDataFromApi[0]).map(key => ({ id: key, label: key }));
    //     setApiData({ columns, rows: apiDataFromApi });
    //   })
    //   .catch(error => {
    //     console.error('Error fetching subscription data:', error);
    //   });
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

    // // Fetch data from the plan API endpoint
    // fetch('http://localhost:8082/api/plan/GetPlansAsync')
    //   .then(response => response.json())
    //   .then((planDataFromApi: Plan[]) => {
    //     // Set planOptions directly, no need to map to a new array
    //     setPlanOptions(planDataFromApi);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching plan data:', error);
    //   });
  }, []);

  // Filter the rows based on the selected planId
  //const filteredRows = apiData.rows.filter(row => row.planId === selectedPlanId);
  const filteredRows = selectedPlanId
  ? apiData.rows.filter(row => row.planId === selectedPlanId)
  : apiData.rows;
  return (
    <LayoutComponent>
      {/* Render your dropdown here using the planOptions state */}
      <select onChange={(e) => setSelectedPlanId(e.target.value)}>
        <option value="">Select a plan</option>
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

