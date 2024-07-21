import React, { useState, useCallback } from 'react';
import {
    Box,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useToast,
    useDisclosure,
    useColorModeValue,
    Flex
} from '@chakra-ui/react';
import AsyncCreatableSelect from 'react-select/async-creatable';
import debounce from 'lodash.debounce';
import { fetchData, StockData } from './services/api';

interface Props {
    onAddStock: (stock: StockData) => void;
    buttonWidth: string;
}

const StockSearch: React.FC<Props> = ({ onAddStock, buttonWidth }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [loading, setLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState<{ value: StockData; label: string } | null>(null);
    const toast = useToast();

    const debouncedLoadOptions = debounce(async (inputValue: string, callback: (options: any[]) => void) => {
        if (inputValue.trim() === '') {
            callback([]);
            return;
        }

        try {
            setLoading(true);
            const response = await fetchData(inputValue);
            const options = response.map(stock => ({
                value: stock,
                label: `${stock.symbol} - ${stock.name}` // Show both symbol and name
            }));
            callback(options);
        } catch (error) {
            console.error('Error fetching stocks:', error);
            callback([]);
            toast({
                title: 'Error fetching stocks.',
                description: "There was an error fetching stock data. Please try again later.",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    }, 500);


    const handleAddStock = () => {
        if (selectedOption) {
            onAddStock(selectedOption.value);

            toast({
                title: 'Stock added.',
                description: `${selectedOption.value.symbol} - ${selectedOption.value.name} has been added to your stocks.`,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            resetState();
            onClose();
        }
    };

    const resetState = () => {
        setSelectedOption(null);
        setLoading(false);
    };

    const handleModalClose = () => {
        console.log("close");
        resetState();
        onClose(); // Ensure this function updates the state to close the modal
    };

    return (
        <Box textAlign="center" mt={8}>
            <Button
                variant="solid"
                colorScheme="teal"
                onClick={onOpen}
                borderRadius="md"
                boxShadow="md"
                size="lg"
                _hover={{ bg: 'teal.600' }}
                _focus={{ boxShadow: 'outline' }}
                width="full"
                maxWidth={buttonWidth}
            >
                Add Stock
            </Button>
            <Modal isOpen={isOpen} onClose={handleModalClose} size="lg" isCentered>
                <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
                <ModalContent aria-labelledby="modal-title">
                    <ModalHeader id="modal-title" textAlign="center">Add Stock</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box p={4} bg={useColorModeValue('white', 'gray.800')} borderRadius="lg" boxShadow="lg">
                            <AsyncCreatableSelect
                                cacheOptions
                                defaultOptions
                                getOptionValue={(option) => option.value.symbol}
                                getOptionLabel={(option) => option.label} // Display both symbol and name
                                loadOptions={debouncedLoadOptions as any}
                                onChange={(selectedOption: any) => setSelectedOption(selectedOption)}
                                value={selectedOption}
                                placeholder="Select or create a stock"
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        boxShadow: 'sm',
                                        borderRadius: 'md',
                                        borderColor: 'gray.200',
                                        '&:hover': { borderColor: 'gray.300' }
                                    }),
                                    menu: (base) => ({
                                        ...base,
                                        boxShadow: 'lg',
                                        borderRadius: 'md',
                                    }),
                                    option: (provided, state) => ({
                                        ...provided,
                                        backgroundColor: state.isSelected ? 'gray.200' : provided.backgroundColor,
                                        color: state.isSelected ? 'black' : provided.color,
                                        padding: 10,
                                    })
                                }}
                                isLoading={loading}
                            />
                            <Flex justifyContent="center" mt={4}>
                                <Button
                                    colorScheme="teal"
                                    onClick={handleAddStock}
                                    isDisabled={!selectedOption}
                                    isFullWidth
                                    size="lg"
                                >
                                    Add Stock
                                </Button>
                            </Flex>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default StockSearch;
