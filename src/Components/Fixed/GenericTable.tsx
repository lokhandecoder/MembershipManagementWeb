import React from 'react';
// import "../../Resources/Styles/GenericTable.css"
import { Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface TableProps {
  data: { [key: string]: any }[];
  onEdit: (index: number) => void; 
  onDelete: (index: number) => void; 
}

const TableComponent: React.FC<TableProps> = ({ data, onEdit, onDelete }) => {

	const columns = data.length > 0 ? Object.keys(data[0]) : []

  return (
    <Card elevation={3}>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column}><b>{column.toUpperCase()}</b></TableCell>
              ))}
              <TableCell><b>ACTION</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column}>
                    {typeof item[column] === 'boolean' ? item[column].toString() : item[column]}
                  </TableCell>
                ))}
                <TableCell>
                  <IconButton color="primary" onClick={() => onEdit && onEdit(index)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => onDelete && onDelete(index)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default TableComponent;
