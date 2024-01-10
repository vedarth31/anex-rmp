"use client";

import React, { useState } from "react";
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
import { visuallyHidden } from '@mui/utils';

const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Professor Name',
  },
  {
    id: 'course',
    numeric: false,
    disablePadding: false,
    label: 'Course',
  },
  {
    id: 'difficulty',
    numeric: true,
    disablePadding: false,
    label: 'Difficulty',
  },
  {
    id: 'rating',
    numeric: true,
    disablePadding: false,
    label: 'Rating',
  },
  {
    id: 'wouldTakeAgain',
    numeric: true,
    disablePadding: false,
    label: 'Would Take Again (%)',
  },
  {
    id: 'gpaTerm1',
    numeric: true,
    disablePadding: false,
    label: 'GPA Term 1',
  },
  {
    id: 'gpaTerm2',
    numeric: true,
    disablePadding: false,
    label: 'GPA Term 2',
  },
  {
    id: 'gpaTerm3',
    numeric: true,
    disablePadding: false,
    label: 'GPA Term 3',
  },
  {
    id: 'aPercentage',
    numeric: true,
    disablePadding: false,
    label: 'A (%)',
  },
  {
    id: 'bPercentage',
    numeric: true,
    disablePadding: false,
    label: 'B (%)',
  },
  {
    id: 'cPercentage',
    numeric: true,
    disablePadding: false,
    label: 'C (%)',
  },
  {
    id: 'dPercentage',
    numeric: true,
    disablePadding: false,
    label: 'D (%)',
  },
  {
    id: 'fPercentage',
    numeric: true,
    disablePadding: false,
    label: 'F (%)',
  },
  {
    id: 'numRatings',
    numeric: true,
    disablePadding: false,
    label: 'Number of Ratings',
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;

  const createSortHandler = (property) => (event) => {
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
            {headCell.id === 'name' ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              <Box component="span">
                {headCell.label}
              </Box>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

function EnhancedTable({ responseData }) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const apiData = JSON.parse(responseData)
  const dynamicRows = apiData.map((courseInfo, index) => ({
    name: courseInfo.Professor?.Name || '',
    course: courseInfo.Professor?.Course || '',
    difficulty: courseInfo.Professor?.Difficulty || 0,
    rating: courseInfo.Professor?.Rating || 0,
    wouldTakeAgain: courseInfo.Professor?.['Would Take Again'] || 0,
    gpaTerm1: courseInfo.GPA?.['SPRING 2022'] || 0,
    gpaTerm2: courseInfo.GPA?.['SPRING 2023'] || 0,
    gpaTerm3: courseInfo.GPA?.['SUMMER 2022'] || 0,
    aPercentage: courseInfo.GradesPercentage?.A || 0,
    bPercentage: courseInfo.GradesPercentage?.B || 0,
    cPercentage: courseInfo.GradesPercentage?.C || 0,
    dPercentage: courseInfo.GradesPercentage?.D || 0,
    fPercentage: courseInfo.GradesPercentage?.F || 0,
    numRatings: courseInfo.Professor?.Num_Ratings || 0,
  }));

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
              {dynamicRows.map((row, index) => (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={index}
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

EnhancedTable.propTypes = {
  responseData: PropTypes.array,
};

export default EnhancedTable;
