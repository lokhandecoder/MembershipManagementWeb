import React, { useState, useEffect } from 'react';
import LayoutComponent from '../Components/Fixed/LayoutComponent';
import GenericTable from '../Components/Fixed/GenericTable';



interface Column {
  id: string;
  label: string;
}

interface Row {
  [key: string]: string | number;
}

// function Subscription() {
//   const [data, setData] = useState<{ columns: Column[]; rows: Row[] }>({ columns: [], rows: [] });

//   useEffect(() => {
//     // Fetch data from the API endpoint
//     fetch('http://localhost:8082/api/Subscription/GetSubscriptionsAsync')
//       .then(response => response.json())
//       .then((apiData: SubscriptionData[]) => {
//         // Assuming apiData is an array of objects
//         const columns: Column[] = Object.keys(apiData[0]).map(key => ({ id: key, label: key }));

//    // Convert SubscriptionData to Row
// const rows: Row[] = apiData.map(item => {
//   const row: Row = {};
//   columns.forEach(column => {
//     // Use type assertion here
//     row[column.id] = item[column.id] as string | number;
//   });
//   return row;
// });

//         setData({ columns, rows });
//       })
//       .catch(error => {
//         console.error('Error fetching data:', error);
//       });
//   }, []);

//   return (
//     <LayoutComponent>
//       <div>Subscription</div>
//       <br />
//       <GenericTable data={data} />
//     </LayoutComponent>
//   );
// }

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
