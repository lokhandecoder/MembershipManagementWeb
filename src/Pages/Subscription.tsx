import React, { useState, useEffect } from 'react';
import LayoutComponent from '../Components/Fixed/LayoutComponent';
import GenericTable from '../Components/Fixed/GenericTableAtn';


interface Column {
  id: string;
  label: string;
}

interface Row {
  [key: string]: string | number;
}


const Subscription: React.FC = () => {
  const [apiData, setApiData] = useState<{ columns: Column[]; rows: Row[] }>({ columns: [], rows: [] });

  useEffect(() => {
    // Fetch data from the API endpoint
    fetch('http://localhost:8082/api/subscription/getsubscriptionsasync')
      .then(response => response.json())
      .then((apiDataFromApi: Row[]) => {
        // Assuming apiDataFromApi is an array of objects
        const columns: Column[] = Object.keys(apiDataFromApi[0]).map(key => ({ id: key, label: key }));
        setApiData({ columns, rows: apiDataFromApi });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <LayoutComponent>  <GenericTable data={apiData} /></LayoutComponent>);

};

export default Subscription;
