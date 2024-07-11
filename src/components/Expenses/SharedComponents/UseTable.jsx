// react library
import React, { useContext, useState } from "react";
// reactstrap components
// import { Card, CardBody, CardTitle, Col, Row } from "reactstrap";


// Custom components
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import {
    Box, Button, Flex, Text, ChakraProvider, FormControl, Input, FormLabel, FormErrorMessage,
    SimpleGrid, Grid, Select, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper,
    Td, Tbody, Tr, Table, Thead, Th, NumberDecrementStepper, Icon, useToast
} from "@chakra-ui/react";
// Icons
import { AiFillCheckCircle } from "react-icons/ai";

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

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const UseTable = React.memo(
    ({
        edit, columns, newInfo, setNewInfo, validateFormNow, setFormActive
    }) => {

        //states globales
        const { options } = useContext(UserContext);

        //Declarar el Toast de notificaciones
        const toast = useToast()

        useEffect(() => {

            // console.log(columns)
        }, [columns])




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


            if (type == "select") {
                console.log(e.target.value, id, type)
                setTemporalRow({
                    ...temporalRow, [id]: { value: e.target.children[e.target.selectedIndex].value, label: e.target.children[e.target.selectedIndex].label }
                })
            } else if (type == "date") {
                setTemporalRow(temporalRow => { return { ...temporalRow, [id]: e } })
            } else {
                console.log(e, id, type)

                setTemporalRow(temporalRow => { return { ...temporalRow, [id]: e.target.value } })
            }


            return;

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
            // Función para verificar campos vacíos
            const checkForEmptyFields = (formData) => {
                for (let key of Object.keys(formData)) {
                    if (formData[key].toString(1).trim() === "" && key !== "actions") {
                        return true; // Retorna true si encuentra algún campo vacío
                    }
                }
                return false; // Retorna false si no encuentra ningún campo vacío
            };


            console.log("NEWINFO", newInfo)
            console.log("TEMPORAL", temporalRow)

            if (!checkForEmptyFields(temporalRow)) {
                setNewInfo({
                    ...newInfo,
                    ['modalItems']: [
                        ...newInfo.modalItems,
                        temporalRow
                    ]
                })

                console.log("COLUMN", columns)

                columns.map(column => {

                    setTemporalRow(temporalRow => { return { ...temporalRow, [column.value]: '' } })

                })
            } else {
                toast({
                    title: 'Atención',
                    description: `Hay campos vacíos, por favor revisar.`,
                    status: 'warning',
                    duration: 4000,
                    isClosable: true,
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

        const generateOptions = (col) => {

            let productsExisting = newInfo.modalItems.map(product => (parseInt(product?.product?.value)));
            console.log(productsExisting)

            return options[col.value]?.filter(product => !productsExisting.includes(product.value)).map(option => (
                <option key={option.value} value={option.value} label={option.label}>{option.label}</option>
            ))
        }

        useEffect(() => {
            console.log("options", options)
        }, [options])

        useEffect(() => {

            console.log(newInfo)
        }, [newInfo])

        useEffect(() => {

            console.log("temporalRow", temporalRow)
        }, [temporalRow])


        const getLabel = (row, col) => {
            let label = '';

            //Es fecha
            if (isDate(row[col.value])) {

                const dateObject = new Date(row[col.value].toString());

                // Obtener las partes de la fecha
                const year = dateObject.getFullYear();
                const month = ("0" + (dateObject.getMonth() + 1)).slice(-2); // Los meses van de 0 a 11
                const day = ("0" + dateObject.getDate()).slice(-2);
                const hours = ("0" + dateObject.getHours()).slice(-2);
                const minutes = ("0" + dateObject.getMinutes()).slice(-2);
                const seconds = ("0" + dateObject.getSeconds()).slice(-2);

                // Construir la cadena en el formato deseado
                // const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                const formattedDate = `${year}-${month}-${day} `;

                label = formattedDate;

            } else if (row[col.value]?.value != undefined) {
                label = row[col.value].label
            } else {
                label = row[col.value].toString()
            }
            return label

        }

        function isDate(valor) {
            const string = valor.toString();
            return string.startsWith("Mon") || string.startsWith("Tue") || string.startsWith("Wed") || string.startsWith("Thu") || string.startsWith("Fri") || string.startsWith("Sat") || string.startsWith("Sun")
        }

        const getTotalInfo = () => {
            let total = 0;
            newInfo.modalItems.map(item => {
                console.log(item)
                total = total + parseInt(item.amount)
            })
            return total;
        }

        return (


            <>
                <Flex direction='column' pt={{ base: "120px", md: "75px" }}>
                    <Card my='22px' overflowX={{ sm: "scroll", xl: "hidden" }} pb='0px'>
                        {/* Cards Master Data */}

                        <CardHeader p='0px 0px 15px 0px'>


                            <Flex justify='space-between' w='100%' align='center' h='13%'>
                                <Flex direction='column' maxW='60%' align='center'>

                                    <Text color='#fff' fontSize='lg' fontWeight='bold'>
                                        Gestión de Gastos
                                    </Text>
                                    <Flex align='center'>
                                        <Icon
                                            as={AiFillCheckCircle}
                                            color='green.500'
                                            w='15px'
                                            h='15px'
                                            me='5px'
                                        />
                                        <Text fontSize='sm' color='gray.400' fontWeight='normal'>
                                            <Text fontWeight='bold' as='span' color='gray.400'>
                                                ₡ {getTotalInfo()}
                                            </Text>{" "}
                                            colones
                                        </Text>
                                    </Flex>
                                </Flex>


                                <Flex direction='column' maxW='100%' align='center'>


                                    <Button leftIcon={<HiArrowUturnLeft />}
                                        variant='brand'
                                        fontSize='15px'
                                        type='submit'
                                        w='100%'
                                        maxW='350px'
                                        h='45'
                                        mb='0px'
                                        mt='0px'
                                        bgColor={"black"}
                                        //   colorScheme='red'
                                        size="sm"
                                        onClick={() => setFormActive('')}
                                    >
                                        Volver
                                    </Button>
                                </Flex>

                            </Flex>
                        </CardHeader>

                        <CardBody>

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

                                    </Tr>
                                </Thead>
                                <Tbody>

                                    {/* Despliegue de información */}
                                    {
                                        newInfo?.modalItems?.map((row, rowIndex) => (
                                            <Tr >
                                                {

                                                    columns.map((col, colIndex) => (
                                                        <Td
                                                            border={false ? "none" : null}
                                                            borderBottomColor='#56577A'
                                                            minW='150px'>

                                                            {col.type != 'button' ?
                                                                <Text fontSize='sm' color='#fff' fontWeight='' pb='.5rem'>
                                                                    {/* {row[col.value]?.value != undefined ? row[col.value].label : row[col.value]} */}
                                                                    {/* { row[col.value]} */}
                                                                    {getLabel(row, col)}

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

                                    {/* Despliegue de información */}
                                    {/* <Tr my='.8rem' ps='0px'>
                                        <Td
                                            border={true ? "none" : null}
                                            borderBottomColor='#56577A'
                                            minW='150px'>
                                            <Flex direction='column'>
                                                <Text fontSize='sm' color='#fff' fontWeight='normal'>
                                                    {domain}
                                                </Text> 
                                                <Text fontSize='sm' color='gray.400' fontWeight='normal'>
                                                    "hola"
                                                </Text>
                                            </Flex>
                                        </Td>
                                        <Td
                                            border={true ? "none" : null}
                                            borderBottomColor='#56577A'
                                            minW='150px'>
                                            <Flex direction='column'>
                                                <Text fontSize='sm' color='#fff' fontWeight='normal'>
                                                    {domain}
                                                </Text> 
                                                <Text fontSize='sm' color='gray.400' fontWeight='normal'>
                                                    "hola"
                                                </Text>
                                            </Flex>
                                        </Td>
                                    </Tr> */}

                                    {/* Para agregar filas */}

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



                                                                                            generateOptions(col)

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
                                                                                        w='150px'
                                                                                        borderRadius='10px'>
                                                                                        <NumberInput
                                                                                            w={{ base: "100%", md: "300px" }}
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

                                                                                : col.type == "date" ?
                                                                                    <FormControl>
                                                                                        {/* <FormLabel ms='4px' fontSize='sm' fontWeight='normal' color='white'>
                                                {date.label}
                                            </FormLabel> */}
                                                                                        <GradientBorder mb='24px' w='150px' borderRadius='20px'>
                                                                                            <Input
                                                                                                as={DatePicker} // Use the DatePicker component as an input
                                                                                                // selected={selectedDates[date.id]}
                                                                                                selected={temporalRow[col.value] ? temporalRow[col.value] : ''}
                                                                                                onChange={e => handleInfoRow(e, col.value, col.type)}
                                                                                                dateFormat="yyyy-MM-dd"
                                                                                                // placeholder={date.placeholder}   
                                                                                                color='white'
                                                                                                bg='rgb(19,21,54)'
                                                                                                border='transparent'
                                                                                                borderRadius='20px'
                                                                                                fontSize='sm'
                                                                                                size='lg'
                                                                                                w={{ base: "100%", md: "145px" }}
                                                                                                maxW='100%'
                                                                                                h='46px'
                                                                                                placeholder={`Buscar...`}
                                                                                            />
                                                                                        </GradientBorder>
                                                                                    </FormControl>
                                                                                    :

                                                                                    <FormControl
                                                                                        isInvalid={false}
                                                                                    // onSubmit={handleSubmit}
                                                                                    >

                                                                                        <GradientBorder
                                                                                            mb='24px'
                                                                                            w='150px'
                                                                                            borderRadius='5px'>
                                                                                            <Input
                                                                                                color='white'
                                                                                                bg='rgb(19,21,54)'
                                                                                                border='transparent'
                                                                                                borderRadius='5px'
                                                                                                fontSize='sm'
                                                                                                size='lg'
                                                                                                w={{ base: "100%", md: "150px" }}
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

                        </CardBody>


                    </Card>
                </Flex>


            </>

        );
    }
);