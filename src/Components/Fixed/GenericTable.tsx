import React from 'react';

interface TableProps {
	data: { [key: string]: any }[];
	columns: string[];
}

const TableComponent: React.FC<TableProps> = ({ data, columns }) => {
	return (
		<div className="custom-card">
			<table className='custom-table'>
				<thead>
					<tr>
						{columns.map((column) => (
							<th key={column}>{column}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.map((item, index) => (
						<tr key={index}>
							{columns.map((column) => (
								<td key={column}>{item[column]}</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default TableComponent;
