import React from 'react';
import "../../Resources/Styles/GenericTable.css"
import { Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface TableProps {
  data: { [key: string]: any }[];
}

const TableComponent: React.FC<TableProps> = ({ data }) => {

	const columns = data.length > 0 ? Object.keys(data[0]) : []

  return (
    <Card elevation={3} className="custom-card">
      <TableContainer component={Paper}>
        <Table className="custom-table" aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column}>{column}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column}>{item[column]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default TableComponent;
