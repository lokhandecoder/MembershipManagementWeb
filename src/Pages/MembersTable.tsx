import React, { useEffect, useState } from 'react'
import LayoutComponent from '../Components/Fixed/LayoutComponent'
import GenericTable from '../Components/Fixed/GenericTable'

const MembersForm: React.FC = () => {

  // const data = [
  //   { ID: 1, Name: 'John', Job: 'Developer', Branch: 'Technical' },
  //   { ID: 2, Name: 'Jane', Job: 'Designer', Branch: 'Technical' },
  //   { ID: 3, Name: 'Doe', Job: 'Manager', Branch: 'Technical' },
  // ];

  const [data, setData] = useState([]);

  // useEffect(() => { fetch('http://localhost:8082/api/subscription/getSubscriptionsasync/').then((response) => response.json()).then((data) => setData(data)).catch((error) => console.error('Error fetching Data: ', error)); }, []);

  useEffect(() => { fetch('http://localhost:8083/api/user/').then((response) => response.json()).then((data) => setData(data)).catch((error) => console.error('Error fetching Data: ', error)); }, []);

  return (
    <LayoutComponent>
      <GenericTable data={data}></GenericTable>
    </LayoutComponent>
  )
}

export default MembersForm