import React from 'react';
import { Box, IconButton, Text } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

interface Stock {
    symbol: string;
}

interface Props {
    stock: Stock;
    onSelect: () => void;
    onRemove: () => void;
    selected: boolean;
}

const StockItem: React.FC<Props> = React.memo(({ stock, onSelect, onRemove, selected }) => {
    const handleSelect = () => {
        onSelect();
    };

    const handleRemove = (event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent the Box's onClick event from firing
        onRemove();
    };

    return (
        <Box
            as="li"
            onClick={handleSelect}
            mb={2}
            p={2}
            borderWidth={1}
            borderRadius="md"
            bg={selected ? 'gray.100' : 'white'}
            boxShadow="md"
            _hover={{ boxShadow: 'lg', cursor: 'pointer' }}
            transition="all 0.3s ease-in-out"
            position="relative"
            aria-selected={selected} // Accessibility improvement
        >
            <Text fontSize="lg" color="gray.800" pr={10}>
                {stock.symbol}
            </Text>

            <IconButton
                aria-label={`Remove ${stock.symbol}`}
                icon={<CloseIcon />}
                colorScheme="red"
                variant="ghost"
                onClick={handleRemove}
                position="absolute"
                right={2}
                top={2}
            />
        </Box>
    );
});

export default StockItem;
