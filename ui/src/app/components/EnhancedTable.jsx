"use client"

import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';

function createData(name, term1, gpa1, term2, gpa2, term3, gpa3, a, b, c, d, f, rating, difficulty, takeAgain, numReviews) {
  return {
    name, term1, gpa1, term2, gpa2, term3, gpa3, a, b, c, d, f, rating, difficulty, takeAgain, numReviews
  };
}

const rows = [
  createData('Bret Lockhart', 'SPRING 2022', 2.95, 'SPRING 2023', 2.93, 'N/A', 'N/A', 38.41, 30.07, 22.98, 4.69, 3.85, 4.1, 4.4, 69.1, 193),
  createData('Robert Rahm', 'SPRING 2023', 2.64, 'N/A', 'N/A', 'N/A', 'N/A', 27.36, 29.48, 28.9, 8.48, 5.78, 3, 3.5, 70.6, 104),
  createData('Todd Schrader', 'SPRING 2022', 3.15, 'SPRING 2023', 2.94, 'SUMMER 2022', 2.33, 37.32, 28.48, 19.09, 7.65, 7.46, 5, 3.3, 95.6, 257),
  createData('Amy Austin', 'SPRING 2019', 3.07, 'SPRING 2022', 2.81, 'SPRING 2023', 2.65, 36.48, 28.06, 23.08, 7.97, 4.41, 5, 4, 97.1, 178),
];

const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Name',
  },
  {
    id: 'term1',
    numeric: false,
    disablePadding: false,
    label: 'Term 1',
  },
  {
    id: 'gpa1',
    numeric: true,
    disablePadding: false,
    label: 'GPA 1',
  },
  {
    id: 'term2',
    numeric: false,
    disablePadding: false,
    label: 'Term 2',
  },
  {
    id: 'gpa2',
    numeric: true,
    disablePadding: false,
    label: 'GPA 2',
  },
  {
    id: 'term3',
    numeric: false,
    disablePadding: false,
    label: 'Term 3',
  },
  {
    id: 'gpa3',
    numeric: true,
    disablePadding: false,
    label: 'GPA 3',
  },
  {
    id: 'a',
    numeric: true,
    disablePadding: false,
    label: 'A%',
  },
  {
    id: 'b',
    numeric: true,
    disablePadding: false,
    label: 'B%',
  },
  {
    id: 'c',
    numeric: true,
    disablePadding: false,
    label: 'C%',
  },
  {
    id: 'd',
    numeric: true,
    disablePadding: false,
    label: 'D%',
  },
  {
    id: 'f',
    numeric: true,
    disablePadding: false,
    label: 'F%',
  },
  {
    id: 'rating',
    numeric: true,
    disablePadding: false,
    label: 'Rating',
  },
  {
    id: 'difficulty',
    numeric: true,
    disablePadding: false,
    label: 'Difficulty',
  },
  {
    id: 'takeAgain',
    numeric: true,
    disablePadding: false,
    label: 'Take Again (%)',
  },
  {
    id: 'numReviews',
    numeric: true,
    disablePadding: false,
    label: 'Num Reviews',
  },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const EnhancedTableHead = (props) => {
  const { order, orderBy, onRequestSort } = props;

  const createSortHandler = (property) => (event) => {
    const nonSortableColumns = ['term1', 'term2', 'term3'];
    if (nonSortableColumns.includes(property)) {
      // Disable sorting for specific columns
      return;
    }
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

function EnhancedTable() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('id');
  const [rowsPerPage, setRowsPerPage] = React.useState(rows.length);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size='medium'
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    sx={{ cursor: 'pointer' }}
                  >
                    {headCells.map((cell) => (
                      <TableCell key={cell.id} align={cell.numeric ? 'right' : 'left'}>
                        {row[cell.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default EnhancedTable;
