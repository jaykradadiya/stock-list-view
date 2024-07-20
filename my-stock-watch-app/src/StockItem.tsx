import React from 'react';
import { ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface Props {
  stock: string;
  onSelect: () => void;
  onRemove: () => void;
  selected: boolean;
}
const StockItem: React.FC<Props> = ({ stock, onSelect, onRemove, selected }) => {
    const handleSelect = () => {
      onSelect();
    };
  
    const handleRemove = () => {
      onRemove();
    };
  
    return (
      <ListItem
        className={`border rounded-lg bg-white shadow-md hover:shadow-lg transition duration-300 ease-in-out ${selected ? 'bg-gray-100' : ''}`}
        onClick={handleSelect}
      >
        <ListItemText primary={stock.symbol} className="text-lg text-gray-800" />
  
        <ListItemSecondaryAction>
          <IconButton edge="end" onClick={handleRemove} className="text-red-500 hover:text-red-700">
            <CloseIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  };

export default StockItem;
