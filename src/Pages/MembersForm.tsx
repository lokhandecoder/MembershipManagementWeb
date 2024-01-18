import React from 'react'
import LayoutComponent from '../Components/Fixed/LayoutComponent'
import GenericTable from '../Components/Fixed/GenericTable'

function MembersForm() {

	const data = [
    { id: 1, name: 'John', job: 'Developer', branch: 'Technical' },
    { id: 2, name: 'Jane', job: 'Designer', branch: 'Technical' },
    { id: 3, name: 'Doe', job: 'Manager', branch: 'Technical' },
  ];

	const columns = ['id', 'name', 'job', 'branch'];

  return (
    <LayoutComponent>
				<GenericTable data={data} columns={columns}></GenericTable>
    </LayoutComponent>
  )
}

export default MembersForm