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

  // useEffect(() => { fetch('http://localhost:5115/api/followup/').then((response) => response.json()).then((data) => setData(data)).catch((error) => console.error('Error fetching Data: ', error)); }, []);

 // useEffect(() => { fetch('http://localhost:8083/api/members/').then((response) => response.json()).then((data) => setData(data)).catch((error) => console.error('Error fetching Data: ', error)); }, []);

  function handleActionClick(rowData: { [key: string]: any; }): void {
    throw new Error('Function not implemented.');
  }

  function handleEditClick(item: any): void {
    throw new Error('Function not implemented.');
  }

  return (
    <LayoutComponent>
      <GenericTable data={data} onActionClick={handleActionClick} onEditClick={handleEditClick}></GenericTable>
    </LayoutComponent>
  )
}

export default MembersForm