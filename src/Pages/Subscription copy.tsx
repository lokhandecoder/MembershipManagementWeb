import React, { useState, useEffect } from 'react';
import LayoutComponent from '../Components/Fixed/LayoutComponent';
import GenericTable from '../Components/Fixed/GenericTableAtn';
import { Plan } from '../Models/PlanModel';
import { getPlans } from '../Services/PlanService';
import { error } from 'console';
import { GetSubscriptionsByPagination, getSubscriptions, getSubscriptionsByPlan, getSubscriptionsByPlanId } from '../Services/SubscriptionService';
import { GetMembersAsync } from '../Services/MembersServices';
import { Member } from '../Models/MemberModel';
import { Pagination } from '@mui/material';

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
  const [subData, setSubData] = useState<{ columns: Column[]; rows: Row[] }>({ columns: [], rows: [] });
  const [allData, setAllData] = useState<{ columns: Column[]; rows: Row[] }>({ columns: [], rows: [] });
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [page, setPage] = useState<number>()
  const [pageSize, setPageSize] = useState<number>()

  useEffect(() => {
    fetchSubscriptionsPlan();
      fetchAllSubscriptions();
      getPlans()
      .then((planDataFromApi: Plan[]) => {
        setPlanOptions(planDataFromApi);
      })
      .catch(error => {
        console.error('Error fetching plan data:', error);
      })

  }, []);

  const fetchSubscriptionsPlan = async (planId?: string) => {
    try {
      const response = await getSubscriptionsByPlan(selectedPlanId); // Call the new function with planId
      const columns: Column[] = Object.keys(response[0]).map(key => ({ id: key, label: key }));
      setAllData({ columns, rows: response });
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  };

  const fetchAllSubscriptions = async () => {
    try {
      const response = await getSubscriptions(); // Call the imported service function
      const columns: Column[] = Object.keys(response[0]).map(key => ({ id: key, label: key }));
      setSubData({ columns, rows: response }); // Update state with fetched data
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  };

  const fetchSubscriptions = async (planId: string, page: number = 1, pageSize: number = 2) => {
    try {
      const response = await getSubscriptionsByPlanId(planId, page, pageSize); // Call the new function with pagination parameters
      const columns: Column[] = Object.keys(response[0]).map(key => ({ id: key, label: key }));
      
      setApiData({ columns, rows: response });

    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  };

  console.log("All rows", allData.rows.length)
console.log(selectedPlanId);
  

 


 


  
  useEffect(() => {
    fetchSubscriptions(selectedPlanId,page, pageSize  ); 
  }, [selectedPlanId, page, pageSize]);

    const handlePlanChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedPlanId(event.target.value);
      await fetchSubscriptions(event.target.value); // Fetch subscriptions with selected planId
    };

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
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
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Pagination count={2} variant="outlined" shape="rounded" onChange={handlePageChange}/>
      </div>

    </LayoutComponent>
  );
};

export default Subscription;

