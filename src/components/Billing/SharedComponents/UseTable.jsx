// react library
import React, { useContext, useState } from "react";
// reactstrap components
import { Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import {
    Box, Button, Flex, Icon, Text, ChakraProvider, FormControl, Input, FormLabel, FormErrorMessage, SimpleGrid, Grid, Select, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper,
    Td, Tbody, Tr, Table, Thead, Th, NumberDecrementStepper
} from "@chakra-ui/react";

import IconBox from 'components/Icons/IconBox';

import { BsClipboardPlusFill, BsFillSendPlusFill, BsFillSendFill } from "react-icons/bs";


import { CartIcon, DocumentIcon, GlobeIcon, RocketIcon, StatsIcon, WalletIcon, FulgerIcon, CreditIcon, IconEdit } from 'components/Icons/Icons.js';
import GradientBorder from "components/GradientBorder/GradientBorder";

import { FaUser } from "react-icons/fa";

import theme from "theme/themeAuth.js";
import { useEffect } from "react";


import { RiSave3Fill } from "react-icons/ri";
import { HiArrowUturnLeft } from "react-icons/hi2";

//Import de componente contexto, para establecer variables globales
import { UserContext } from 'helpers/UserContext';


export const UseTable = React.memo(
    ({
        edit, columns, newInfo, setNewInfo, validateFormNow
    }) => {

        //states globales
        const { options } = useContext(UserContext);

        useEffect(() => {

            // console.log(columns)
        }, [columns])


        useEffect(() => {

            // console.log(newInfo)
        }, [newInfo])

        useEffect(() => {
            // setNewInfo({
            //     ...newInfo,
            //     ['modalItems']: [
            //         ...newInfo.modalItems,
            //         { actions: 'Button', quantity: 0, product: 0, unitaryPrice: 0, totaly: 0 }
            //     ]
            // })
        }, [])


        const handleInfoRow = (e, id, type) => {
            // console.log(e.target.value, id, type)

            // setTemporalRow(temporalRow => { return { ...temporalRow, [id]: e.target.value } })


            if (type == 'select') {


                /*Excepciones */

                if (id == 'product') {
                    // debugger;
                    let unitaryPriceA = options[id].filter(option => option.value === parseInt(e.target.value))[0]?.unitaryPrice

                    let totalyA = unitaryPriceA * temporalRow.quantity

                    // setTemporalRow({
                    //     ...temporalRow, ['unitaryPrice']: unitaryPrice
                    // })

                    setTemporalRow({
                        ...temporalRow,
                        [e.target.id]: { value: e.target.children[e.target.selectedIndex].value, label: e.target.children[e.target.selectedIndex].label },
                        ['unitaryPrice']: unitaryPriceA,
                        ['totaly']: totalyA

                    })
                } else {
                    setTemporalRow({
                        ...temporalRow, [e.target.id]: { value: e.target.children[e.target.selectedIndex].value, label: e.target.children[e.target.selectedIndex].label }
                    })
                }
            } else if (type == 'number') {

                let stockExistQuantity = 0

                if (temporalRow.product != '') {
                    //Extrae la cantidad de productos en stock
                    stockExistQuantity = options?.product?.filter(product => product.value == parseInt(temporalRow.product.value))[0]?.stock

                }

                //Valida si la cantidad es mayor o menor 
                if (stockExistQuantity >= e.target.value && temporalRow.product != '') {


                    let totalyA = temporalRow.unitaryPrice * e.target.value


                    setTemporalRow({
                        ...temporalRow, [id]:
                            e.target.value,
                        ['totaly']: totalyA
                    })

                }

            } else { //No es select

                let totalyA = temporalRow.unitaryPrice * e.target.value


                setTemporalRow({
                    ...temporalRow, [e.target.id]:
                        e.target.value,
                    ['totaly']: totalyA
                })
            }

        };


        const handleAddNewRow = () => {
            if (temporalRow.totaly != '') {


                setNewInfo({
                    ...newInfo,
                    ['modalItems']: [
                        ...newInfo.modalItems,
                        temporalRow
                    ]
                })

                columns.map(column => {

                    setTemporalRow(temporalRow => { return { ...temporalRow, [column.value]: '' } })

                })
            }
        }




        const [temporalRow, setTemporalRow] = useState({});

        useEffect(() => {

            columns.map(column => {

                setTemporalRow(temporalRow => { return { ...temporalRow, [column.value]: '' } })

            })


        }, [])

        useEffect(() => {
            // console.log(temporalRow)
        }, [temporalRow])


        const handleOnDeleteItem = (indexRow) => {



            const temporalItems = newInfo.modalItems.filter((item, index) => index != indexRow)

            setNewInfo({
                ...newInfo,
                ['modalItems']: [...temporalItems
                ]
            })

        }

        const getTotal = () => {
            let total = 0;

            newInfo.modalItems.map(e => {
                total += parseInt(e.totaly);
            })

            return `₡${total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        }



        useEffect(() => {
            // console.log(options)
        }, [options])

        useEffect(() => {
            // console.log(newInfo)
        }, [newInfo])


        const methodTest = (col) => {

            // console.log(newInfo.modalItems)
            // console.log(options)

            let productsExisting = newInfo.modalItems.map(product => (parseInt(product.product.value)));
            // console.log(productsExisting)


            return options[col.value]?.filter(product => !productsExisting.includes(product.value)).map(option => (
                <option key={option.value} value={option.value} label={option.label}>{option.label}</option>
            ))
        }

        return (


<>
usetable

            <Flex flexDirection='column' pt={{ base: '10px', md: '0px' }}>
                <Grid templateColumns={{ sm: "1fr", lg: "100% 100%" }}>
                    {/* Cards Master Data */}


                    <>

                        {/* {billingData.map((row) => { */}
                        {/* return ( */}
                        <SimpleGrid columns={{ sm: 1, md: columns, xl: columns }} spacingX='2px' spacingY='20px'>

                            <Flex direction='column' pt={{ base: "12px", md: "0px" }}>
                                {/* Projects Table */}

                                <Table variant='simple' color='#fff'>
                                    <Thead>
                                        <Tr my='.8rem' ps='0px'>

                                            {

                                                columns.map((col, colIndex) => (

                                                    <Th
                                                        ps='0px'
                                                        color='gray.400'
                                                        fontFamily='Plus Jakarta Display'
                                                        borderBottomColor='#56577A'>
                                                        {col.label}
                                                    </Th>

                                                ))}
                                            {/*                                                
                                                            <Th
                                                                color='gray.400'
                                                                fontFamily='Plus Jakarta Display'
                                                                borderBottomColor='#56577A'>
                                                                Acciones
                                                            </Th>
                                                            <Th borderBottomColor='#56577A'></Th> */}
                                        </Tr>
                                    </Thead>
                                    <Tbody>


                                        {newInfo?.modalItems?.map((row, rowIndex) => (
                                            <Tr>
                                                {

                                                    columns.map((col, colIndex) => (
                                                        <Td borderBottomColor='#56577A' border={true ? "none" : null}>

                                                            {col.type != 'button' ?
                                                                <Text fontSize='sm' color='#fff' fontWeight='' pb='.5rem'>
                                                                    {row[col.value]?.value != undefined ? row[col.value].label : row[col.value]}
                                                                </Text>
                                                                :
                                                                <>

                                                                    {/* <Button size="sm" leftIcon={<BsClipboardPlusFill />} colorScheme='blue' variant='solid'
                                                                        onClick={() => { setPreChargeInfoModal(row); setModalVisible(true); }}
                                                                    >
                                                                        Editar
                                                                    </Button> */}
                                                                    {
                                                                        edit &&


                                                                        <Button size="sm" leftIcon={<BsClipboardPlusFill />} colorScheme='red' variant='solid' ml={4}
                                                                            onClick={() => handleOnDeleteItem(rowIndex)}
                                                                        >
                                                                            Eliminar
                                                                        </Button>
                                                                    }
                                                                </>
                                                            }

                                                        </Td>
                                                    ))
                                                }


                                            </Tr>
                                        ))}












                                        {/* AQUIIIIIIIII */}

                                        {edit == true &&


                                            <Tr>
                                                {

                                                    columns.map((col, colIndex) => (
                                                        <Td borderBottomColor='#56577A' border={true ? "none" : null}>

                                                            {col.type == 'button' ?
                                                                <>

                                                                    <Button size="sm" leftIcon={<BsClipboardPlusFill />} colorScheme='green' variant='solid'
                                                                        onClick={() => handleAddNewRow()}
                                                                    >
                                                                        Agregar
                                                                    </Button>

                                                                    {/* <Button size="sm" leftIcon={<BsClipboardPlusFill />} colorScheme='red' variant='solid' ml={4}
                                                                    onClick={() => handleOnDeleteModalItem(row)}
                                                                >
                                                                    Eliminar
                                                                </Button>  */}

                                                                </>
                                                                :



                                                                <>

                                                                    {col.editable == true ?

                                                                        (
                                                                            col.type == 'select' ?
                                                                                <FormControl
                                                                                    isInvalid={false}
                                                                                // onSubmit={handleSubmit}
                                                                                >
                                                                                    <GradientBorder
                                                                                        mb='24px'
                                                                                        w='200px'
                                                                                        borderRadius='20px'>

                                                                                        <Select
                                                                                            placeholder={"Ingrese el " + col.label}
                                                                                            id={col.value}

                                                                                            color='gray'
                                                                                            colorOptions='Black'
                                                                                            bg='rgb(19,21,54)'
                                                                                            border='transparent'
                                                                                            borderRadius='20px'
                                                                                            fontSize='sm'
                                                                                            size='lg'
                                                                                            w={{ base: "100%", md: "200px" }}
                                                                                            maxW='100%'
                                                                                            h='46px'
                                                                                            onChange={e => handleInfoRow(e, col.value, col.type)}
                                                                                            value={temporalRow[col.value]?.value ? temporalRow[col.value]?.value : ''}


                                                                                            _focus={{ bg: 'black' }} // Establecer el color de fondo cuando el componente está enfocado

                                                                                        >
                                                                                            {



                                                                                                methodTest(col)

                                                                                            }

                                                                                        </Select>

                                                                                    </GradientBorder>
                                                                                    <FormErrorMessage>Campo vacío</FormErrorMessage>

                                                                                </FormControl>
                                                                                : col.type == 'number' ?

                                                                                    <FormControl
                                                                                        isInvalid={false}
                                                                                    // onSubmit={handleSubmit}
                                                                                    >

                                                                                        <GradientBorder
                                                                                            mb='24px'
                                                                                            w='70px'
                                                                                            borderRadius='10px'>
                                                                                            <NumberInput
                                                                                                w={{ base: "100%", md: "70px" }}
                                                                                                maxW='100%'
                                                                                                h='46px'
                                                                                                borderRadius='10px'
                                                                                                color='white'
                                                                                                bg='rgb(19,21,54)'
                                                                                                border='transparent'
                                                                                                fontSize='sm'
                                                                                                size='lg'
                                                                                                defaultValue={0}
                                                                                                min={1}
                                                                                                max={3}
                                                                                                // value={'3'}
                                                                                                value={temporalRow[col.value] != undefined ? temporalRow[col.value] : ''}



                                                                                            >

                                                                                                <NumberInputField
                                                                                                    w={{ base: "100%", md: "346px" }}
                                                                                                    maxW='100%'
                                                                                                    h='46px'
                                                                                                    color='white'
                                                                                                    border='transparent'
                                                                                                    fontSize='sm'
                                                                                                    size='lg'
                                                                                                    borderRadius='9px'
                                                                                                    onChange={e => handleInfoRow(e, col.value, col.type)}

                                                                                                    id={col.value}
                                                                                                // type={field.typeField}
                                                                                                // placeholder={field.placeholder}
                                                                                                // onChange={e => handleNewInfo(e, field.type)}
                                                                                                />
                                                                                                {/* <NumberInputStepper
                                                                                                                                                                                            onChange={e => handleInfoRow(e, col.value, col.type)}

                                                                                            >
                                                                                                <NumberIncrementStepper />
                                                                                                <NumberDecrementStepper />
                                                                                            </NumberInputStepper> */}

                                                                                            </NumberInput>
                                                                                        </GradientBorder>
                                                                                        <FormErrorMessage>Campo vacío</FormErrorMessage>

                                                                                    </FormControl>

                                                                                    :

                                                                                    <FormControl
                                                                                        isInvalid={false}
                                                                                    // onSubmit={handleSubmit}
                                                                                    >

                                                                                        <GradientBorder
                                                                                            mb='24px'
                                                                                            w='46px'
                                                                                            borderRadius='5px'>
                                                                                            <Input
                                                                                                color='white'
                                                                                                bg='rgb(19,21,54)'
                                                                                                border='transparent'
                                                                                                borderRadius='5px'
                                                                                                fontSize='sm'
                                                                                                size='lg'
                                                                                                w={{ base: "100%", md: "46px" }}
                                                                                                maxW='100%'
                                                                                                h='46px'
                                                                                                value={temporalRow[col.value] != undefined ? temporalRow[col.value] : ''}
                                                                                                id={col.value}
                                                                                                // type={field.typeField}
                                                                                                // placeholder={field.placeholder}
                                                                                                onChange={e => handleInfoRow(e, col.value, col.type)}
                                                                                            />
                                                                                        </GradientBorder>
                                                                                        <FormErrorMessage>Campo vacío</FormErrorMessage>

                                                                                    </FormControl>
                                                                        )
                                                                        :
                                                                        <Text fontSize='sm' color='#fff' fontWeight='' pb='.5rem'>
                                                                            {temporalRow[col.value]}
                                                                        </Text>

                                                                    }
                                                                </>
                                                            }

                                                        </Td>
                                                    ))
                                                }


                                            </Tr>

                                        }




                                    </Tbody>

                                </Table>
                                <div>
                                    <hr

                                        width='740px'
                                        color='#ffff'
                                    />
                                </div>

                                <Table variant='simple' color='#fff'>

                                    <Td borderBottomColor='#56577A' border={true ? "none" : null}>

                                        <Text fontSize='md' color='#fff' fontWeight='' pb='.5rem'>
                                            Total:  {getTotal()}
                                        </Text>


                                    </Td>
                                </Table>
                            </Flex>

                        </SimpleGrid>


                        {/* ); */}
                    </>



                </Grid>
            </Flex>
</>

        );
    }
);