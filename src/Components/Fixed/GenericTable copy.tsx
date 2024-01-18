import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface Column {
  id: string;
  label: string;
}

interface Row {
  [key: string]: string | number;
}

interface GenericTableProps {
  data: {
    columns: Column[];
    rows: Row[];
  };
}

const GenericTable: React.FC<GenericTableProps> = ({ data }) => {
  if (!data || !data.columns || !data.rows || data.columns.length === 0 || data.rows.length === 0) {
    return <div>No data available</div>;
  }

  const { columns, rows } = data;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id}>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column) => (
                <TableCell key={column.id}>
                  {row[column.id]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GenericTable;
