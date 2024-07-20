import React from 'react';
import { Box, IconButton, List, ListItem, Text, useColorModeValue, VStack, Divider, Spacer } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { StockData } from './services/api';
import StockSearch from './StockSearch';

interface StockSidebarProps {
    stocks: StockData[];
    selectedStock: StockData | null;
    onSelect: (stock: StockData) => void;
    onRemove: (index: number) => void;
    onAddStock: (symbol: StockData) => void;
    sidebarWidth: string; // Add sidebarWidth prop
}

const StockSidebar: React.FC<StockSidebarProps> = ({ stocks, selectedStock, onSelect, onRemove, onAddStock, sidebarWidth }) => {
    return (
        <Box
            width={sidebarWidth}
            bg={useColorModeValue('gray.100', 'gray.700')}
            p={4}
            height="100vh"
            overflowY="auto"
            position="fixed"
            borderRightWidth={1}
            borderColor={useColorModeValue('gray.200', 'gray.600')}
        >
            <Text fontSize="2xl" fontWeight="bold" mb={4}>
                Stock List
            </Text>

            <Box mb={4}>
                <StockSearch onAddStock={onAddStock} buttonWidth={sidebarWidth} />
            </Box>

            <Divider my={4} />

            <List spacing={3}>
                {stocks.map((stock, index) => (
                    <ListItem
                        key={stock.symbol}
                        p={3}
                        borderRadius="md"
                        bg={selectedStock?.symbol === stock.symbol ? 'gray.200' : 'transparent'}
                        _hover={{ bg: 'gray.300', cursor: 'pointer' }}
                        display="flex"
                        alignItems="center"
                        onClick={() => onSelect(stock)}
                    >
                        <VStack align="start" spacing={1} flex="1">
                            <Text fontWeight="bold">{stock.symbol}</Text>
                            <Text fontSize="sm" color="gray.600">{stock.name}</Text>
                        </VStack>
                        <Spacer />
                        <IconButton
                            aria-label="Remove stock"
                            icon={<CloseIcon />}
                            colorScheme="red"
                            variant="ghost"
                            size="sm"
                            onClick={(event) => {
                                event.stopPropagation();
                                onRemove(index);
                            }}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default StockSidebar;
