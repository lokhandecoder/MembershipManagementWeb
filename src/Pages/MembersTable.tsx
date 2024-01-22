import React, { useEffect, useState } from 'react'
import LayoutComponent from '../Components/Fixed/LayoutComponent'
import GenericTable from '../Components/Fixed/GenericTable'
import { LogginID } from '../API_CONFIG';
import { GetAllMembers, GetMemberByID } from '../Services/MembersServices';

const MembersForm: React.FC = () => {

  const [data, setData] = useState([]);

  // useEffect(() => { fetch('http://localhost:8082/api/subscription/getSubscriptionsasync/').then((response) => response.json()).then((data) => setData(data)).catch((error) => console.error('Error fetching Data: ', error)); }, []);

  // useEffect(() => { fetch('http://localhost:8083/api/members/').then((response) => response.json()).then((data) => setData(data)).catch((error) => console.error('Error fetching Data: ', error)); }, []);

  useEffect(() => {
    const fetchMember = async () => {
      const data = await GetAllMembers();
      setData(data);
      console.log(data);
    };
    fetchMember();
  }, []);

  return (
    <LayoutComponent>
      <GenericTable data={data}></GenericTable>
    </LayoutComponent>
  )
}

export default MembersForm