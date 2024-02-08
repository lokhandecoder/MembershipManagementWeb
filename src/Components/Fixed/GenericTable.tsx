import React from 'react';
// import "../../Resources/Styles/GenericTable.css"
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton } from '@mui/material';

interface TableProps {
  data: { [key: string]: any }[];
  onActionClick: (item : any ) => void;
  onEditClick: (item : any ) => void;
}

const TableComponent: React.FC<TableProps> = ({ data, onActionClick,onEditClick }) => {

	const columns = data.length > 0 ? Object.keys(data[0]) : []

  

  return (
    <Card elevation={3}>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column}>{column}</TableCell>
              ))}
              <TableCell>Action</TableCell>
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
                  {/* Action button */}
                  <IconButton onClick={(e) => { e.stopPropagation(); onEditClick(item); }}  >
                    <EditIcon/>
                  </IconButton>
                  <IconButton onClick={(e) => { e.stopPropagation(); onActionClick(item.id); }}  color="secondary">
                    <DeleteIcon/>
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
