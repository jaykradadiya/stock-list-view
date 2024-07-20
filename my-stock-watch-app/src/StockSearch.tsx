import React, {useState} from 'react';
import {
    TextField,
    Autocomplete,
    CircularProgress,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent
} from '@mui/material';
import {fetchData, StockData} from './services/api';

interface Props {
    onAddStock: (stock: string) => void;
}


const StockSearch: React.FC<Props> = ({onAddStock}) => {
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState<StockData[]>([]);
    const [selectedOption, setSelectedOption] = useState<StockData | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false); // State for dialog visibility

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        searchStocks(event.target.value);
    };

    const searchStocks = async (query: string) => {
        if (query.trim() === '') {
            setOptions([]);
            return;
        }

        setLoading(true);
        try {
            const response = await fetchData(query);
            setOptions(response);
        } catch (error) {
            console.error('Error fetching stocks:', error);
            setOptions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddStock = () => {
        if (selectedOption) {
            onAddStock(selectedOption);
            setInputValue('');
            setSelectedOption(null);
            setOptions([]);
            setDialogOpen(false); // Close dialog after adding stock
        }
    };

    return (
        <Box>
            <Button variant="outlined" color="primary" onClick={() => setDialogOpen(true)}>
                Add Stock
            </Button>

            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Add Stock</DialogTitle>
                <DialogContent>
                    <Box className="p-4 bg-white rounded-lg shadow-lg">
                        <Autocomplete
                            id="stock-search"
                            options={options}
                            getOptionLabel={(option) => option?.name}
                            value={selectedOption}
                            onChange={(event, newValue) => {
                                setSelectedOption(newValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Search Stock"
                                    variant="outlined"
                                    onChange={handleInputChange}
                                    value={inputValue}
                                    fullWidth
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {loading ? <CircularProgress color="inherit" size={20}/> : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                        />

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddStock}
                            disabled={!selectedOption}
                            className="mt-3"
                            fullWidth
                        >
                            Add Stock
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default StockSearch;
