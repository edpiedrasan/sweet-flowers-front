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

import { BsClipboardPlusFill, BsFillSendPlusFill, BsFillSendFill, BsBrushFill } from "react-icons/bs";
import { FaCopy } from "react-icons/fa";
import { MdDelete } from "react-icons/md";




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


        const handleInfoRow = (e, id, type, index) => {

            const items = newInfo.modalItems.map((item, indexItem) => {
                if (index == indexItem) {


                    if (type == "select") {

                        console.log(e.target.value, id, type)
                        return {
                            ...item, [id]: { value: e.target.children[e.target.selectedIndex].value, label: e.target.children[e.target.selectedIndex].label }
                        }
                    } else if (type == "date") {
                        return { ...item, [id]: e }
                    } else {
                        console.log(e, id, type)

                        return { ...item, [id]: e.target.value }
                    }

                } else {
                    return item
                }

            });

            // console.log("ITEMS", items)


            setNewInfo({
                ...newInfo,
                ['modalItems']: [...items
                ]
            })


        };


        // const handleAddNewRow = () => {
        //     // Función para verificar campos vacíos
        //     const checkForEmptyFields = (formData) => {
        //         for (let key of Object.keys(formData)) {
        //             if (formData[key].toString(1).trim() === "" && key !== "actions") {
        //                 return true; // Retorna true si encuentra algún campo vacío
        //             }
        //         }
        //         return false; // Retorna false si no encuentra ningún campo vacío
        //     };


        //     console.log("NEWINFO", newInfo)
        //     console.log("TEMPORAL", temporalRow)

        //     if (!checkForEmptyFields(temporalRow)) {
        //         setNewInfo({
        //             ...newInfo,
        //             ['modalItems']: [
        //                 ...newInfo.modalItems,
        //                 temporalRow
        //             ]
        //         })

        //         console.log("COLUMN", columns)

        //         columns.map(column => {

        //             setTemporalRow(temporalRow => { return { ...temporalRow, [column.value]: '' } })

        //         })
        //     } else {
        //         toast({
        //             title: 'Atención',
        //             description: `Hay campos vacíos, por favor revisar.`,
        //             status: 'warning',
        //             duration: 4000,
        //             isClosable: true,
        //         })
        //     }

        // }




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

            return `₡${total?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        }

        const generateOptions = (col) => {

            let productsExisting = newInfo.modalItems.map(product => (parseInt(product?.product?.value)));
            // console.log(productsExisting)

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

        const formatDateLabel = (date) => {
            const dateObject = new Date(date?.toString());

            console.log("DATE", dateObject)

            // Obtener las partes de la fecha
            const year = dateObject.getFullYear();
            const month = ("0" + (dateObject.getMonth() + 1)).slice(-2); // Los meses van de 0 a 11
            const day = ("0" + dateObject.getDate()).slice(-2);

            console.log("YEAR", dateObject)

            return !year? '': `${year}-${month}-${day} `;
        }


        const getLabel = (row, col) => {
            let label = '';

            //Es fecha
            if (isDate(row[col.value])) {

                const dateObject = new Date(row[col.value]?.toString());

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
                label = row[col.value]?.toString()
            }
            return label

        }

        function isDate(valor) {
            const string = valor?.toString();
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

        const getLastIndexRow = () => {
            return newInfo.modalItems.length
        }

        //Función para agregar una nueva fila en blanco 
        const addNewRow = () => {
            let newRow = {}
            columns.map(column => {
                newRow = { ...newRow, [column.value]: '' }
            })

            setNewInfo({
                ...newInfo,
                ['modalItems']: [...newInfo.modalItems, newRow]
            })

            setrowIndexEdit(getLastIndexRow)


        }


        const handleCopyRow = (indexRow) => {
            const row = newInfo.modalItems.filter((rowT, index) => (index == indexRow))[0]

            setNewInfo({
                ...newInfo,
                ['modalItems']: [...newInfo.modalItems, row]
            })

        }


        const [rowIndexEdit, setrowIndexEdit] = useState(0);

        // Function to format number with commas and points
        const formatNumber = (num) => {
            // Convert number to string
            const numStr = num?.toString();

            // Split the number into integer and decimal parts (if any)
            const parts = numStr.split('.');
            let integerPart = parts[0];
            const decimalPart = parts.length > 1 ? parts[1] : '';

            // Insert commas as thousand separators
            integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

            // Combine integer part and decimal part (if any)
            let formattedNumber = integerPart;
            if (decimalPart !== '') {
                formattedNumber += ',' + decimalPart;
            }

            return formattedNumber;
        };

        useEffect(() => {
            console.log("newInfo", newInfo)
        }, [newInfo])


        return (


            <>
                <Flex direction='column' pt={{ base: "120px", md: "75px" }}>
                    <Card my='22px' overflowX={{ sm: "scroll", xl: "hidden" }} pb='200px'>
                        {/* Cards Master Data */}

                        <CardHeader p='0px 0px 0px 0px'>


                            <Flex justify='space-between' w='100%' align='center' h='3%'>
                                <Flex direction='column' maxW='30%' align='center'>

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
                                                ₡ {getTotalInfo() ? formatNumber(getTotalInfo()) : 0}
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
                                    <Tr my='.8rem' ps='100px'>
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


                                                        <Td borderBottomColor='#56577A' border={false ? "none" : null} onClick={() => rowIndex != rowIndexEdit && setrowIndexEdit(rowIndex)}>

                                                            {rowIndex !== rowIndexEdit ?
                                                                <>

                                                                    {/* <Td
                                                                        border={false ? "none" : null}
                                                                        borderBottomColor='#56577A'
                                                                        minW='100px'
                                                                        onClick={() => setrowIndexEdit(rowIndex)}
                                                                    > */}
                                                                    <Flex direction='column'
                                                                        
                                                                    >
                                                                        {/* <Text fontSize='sm' color='#fff' fontWeight='normal'>
                                                                                sss
                                                                            </Text> */}
                                                                        <Text fontSize='sm' color='gray.400' fontWeight='normal'
                                                                        >
                                                                            {col.type == "date" ?
                                                                                formatDateLabel(newInfo.modalItems[rowIndex][col.value])

                                                                                : newInfo.modalItems[rowIndex][col.value]?.value != undefined ? //select
                                                                                    newInfo.modalItems[rowIndex][col.value]?.label + ""

                                                                                    : newInfo.modalItems[rowIndex][col.value] != undefined ?
                                                                                        (col.value == "amount" ?
                                                                                            '₡' + formatNumber(newInfo.modalItems[rowIndex][col.value] + "") :
                                                                                            newInfo.modalItems[rowIndex][col.value] + ""
                                                                                        )
                                                                                        :
                                                                                        ""

                                                                            }
                                                                            {/* {getLabel(newInfo.modalItems[rowIndex], col)} */}
                                                                        </Text>
                                                                    </Flex>

                                                                </>
                                                                :



                                                                <>

                                                                    {
                                                                        col.type == 'button' ?
                                                                            <>

                                                                                <Button size="sm"
                                                                                    // leftIcon={<FaCopy />} 
                                                                                    colorScheme='green' variant='solid'
                                                                                    onClick={() => handleCopyRow(rowIndex)}
                                                                                >
                                                                                    <FaCopy style={{ marginRight: '0px' }} />

                                                                                </Button>

                                                                                <Button
                                                                                    size="sm"
                                                                                    colorScheme='red'
                                                                                    variant='solid'
                                                                                    ml={1}
                                                                                    onClick={() => handleOnDeleteItem(rowIndex)}
                                                                                // justifyContent="center"  // Center content horizontally
                                                                                // alignItems="center"      // Center content vertically
                                                                                // display="flex"           // Ensure it behaves as a flex container
                                                                                >
                                                                                    <MdDelete style={{ marginRight: '0px' }} />
                                                                                </Button>
                                                                                <Button
                                                                                    size="sm"
                                                                                    colorScheme='blue'
                                                                                    variant='solid'
                                                                                    ml={1}
                                                                                    onClick={() => setrowIndexEdit(null)}
                                                                                // justifyContent="center"  // Center content horizontally
                                                                                // alignItems="center"      // Center content vertically
                                                                                // display="flex"           // Ensure it behaves as a flex container
                                                                                >
                                                                                    <BsBrushFill style={{ marginRight: '0px' }} />
                                                                                </Button>

                                                                            </>
                                                                            : col.type == 'select' ?
                                                                                <FormControl
                                                                                    isInvalid={false}
                                                                                    mb='0px'
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
                                                                                            onChange={e => handleInfoRow(e, col.value, col.type, rowIndex)}
                                                                                            value={newInfo.modalItems[rowIndex][col.value]?.value ? newInfo.modalItems[rowIndex][col.value]?.value : ''}


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
                                                                                                value={newInfo.modalItems[rowIndex][col.value] != undefined ? newInfo.modalItems[rowIndex][col.value] : ''}



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
                                                                                                    onChange={e => handleInfoRow(e, col.value, col.type, rowIndex)}

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
                                                                                        <FormControl
                                                                                        >
                                                                                            {/* <FormLabel ms='4px' fontSize='sm' fontWeight='normal' color='white'>
                                                {date.label}
                                            </FormLabel> */}
                                                                                            <GradientBorder mb='24px' w='150px' borderRadius='20px'>
                                                                                                <Input

                                                                                                    as={DatePicker} // Use the DatePicker component as an input
                                                                                                    // selected={selectedDates[date.id]}
                                                                                                    selected={newInfo.modalItems[rowIndex][col.value] ? newInfo.modalItems[rowIndex][col.value] : ''}
                                                                                                    onChange={e => handleInfoRow(e, col.value, col.type, rowIndex)}
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
                                                                                                    value={newInfo.modalItems[rowIndex][col.value] != undefined ? newInfo.modalItems[rowIndex][col.value] : ''}
                                                                                                    id={col.value}
                                                                                                    // type={field.typeField}
                                                                                                    // placeholder={field.placeholder}
                                                                                                    onChange={e => handleInfoRow(e, col.value, col.type, rowIndex)}
                                                                                                />
                                                                                            </GradientBorder>
                                                                                            <FormErrorMessage>Campo vacío</FormErrorMessage>

                                                                                        </FormControl>

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
                                        <></>

                                        // <Tr>
                                        //     {

                                        //         columns.map((col, colIndex) => (
                                        //             <Td borderBottomColor='#56577A' border={true ? "none" : null}>

                                        //                 {col.type == 'button' ?
                                        //                     <>



                                        //                         <Button size="sm" leftIcon={<BsClipboardPlusFill />} colorScheme='red' variant='solid' ml={4}
                                        //                             onClick={() => handleOnDeleteModalItem(row)}
                                        //                         >

                                        //                         </Button>

                                        //                     </>
                                        //                     :



                                        //                     <>
                                        //                         {/* 
                                        //                         {col.editable == true ?

                                        //                             (
                                        //                                 col.type == 'select' ?
                                        //                                     <FormControl
                                        //                                         isInvalid={false}
                                        //                                     onSubmit={handleSubmit}
                                        //                                     >
                                        //                                         <GradientBorder
                                        //                                             mb='24px'
                                        //                                             w='200px'
                                        //                                             borderRadius='20px'>

                                        //                                             <Select
                                        //                                                 placeholder={"Ingrese el " + col.label}
                                        //                                                 id={col.value}

                                        //                                                 color='gray'
                                        //                                                 colorOptions='Black'
                                        //                                                 bg='rgb(19,21,54)'
                                        //                                                 border='transparent'
                                        //                                                 borderRadius='20px'
                                        //                                                 fontSize='sm'
                                        //                                                 size='lg'
                                        //                                                 w={{ base: "100%", md: "200px" }}
                                        //                                                 maxW='100%'
                                        //                                                 h='46px'
                                        //                                                 onChange={e => handleInfoRow(e, col.value, col.type)}
                                        //                                                 value={temporalRow[col.value]?.value ? temporalRow[col.value]?.value : ''}


                                        //                                                 _focus={{ bg: 'black' }} // Establecer el color de fondo cuando el componente está enfocado

                                        //                                             >
                                        //                                                 {



                                        //                                                     generateOptions(col)

                                        //                                                 }

                                        //                                             </Select>

                                        //                                         </GradientBorder>
                                        //                                         <FormErrorMessage>Campo vacío</FormErrorMessage>

                                        //                                     </FormControl>
                                        //                                     : col.type == 'number' ?

                                        //                                         <FormControl
                                        //                                             isInvalid={false}
                                        //                                         onSubmit={handleSubmit}
                                        //                                         >

                                        //                                             <GradientBorder
                                        //                                                 mb='24px'
                                        //                                                 w='150px'
                                        //                                                 borderRadius='10px'>
                                        //                                                 <NumberInput
                                        //                                                     w={{ base: "100%", md: "300px" }}
                                        //                                                     maxW='100%'
                                        //                                                     h='46px'
                                        //                                                     borderRadius='10px'
                                        //                                                     color='white'
                                        //                                                     bg='rgb(19,21,54)'
                                        //                                                     border='transparent'
                                        //                                                     fontSize='sm'
                                        //                                                     size='lg'
                                        //                                                     defaultValue={0}
                                        //                                                     min={1}
                                        //                                                     max={3}
                                        //                                                     value={'3'}
                                        //                                                     value={temporalRow[col.value] != undefined ? temporalRow[col.value] : ''}



                                        //                                                 >

                                        //                                                     <NumberInputField
                                        //                                                         w={{ base: "100%", md: "346px" }}
                                        //                                                         maxW='100%'
                                        //                                                         h='46px'
                                        //                                                         color='white'
                                        //                                                         border='transparent'
                                        //                                                         fontSize='sm'
                                        //                                                         size='lg'
                                        //                                                         borderRadius='9px'
                                        //                                                         onChange={e => handleInfoRow(e, col.value, col.type)}

                                        //                                                         id={col.value}
                                        //                                                     type={field.typeField}
                                        //                                                     placeholder={field.placeholder}
                                        //                                                     onChange={e => handleNewInfo(e, field.type)}
                                        //                                                     />


                                        //                                                 </NumberInput>
                                        //                                             </GradientBorder>
                                        //                                             <FormErrorMessage>Campo vacío</FormErrorMessage>

                                        //                                         </FormControl>

                                        //                                         : col.type == "date" ?
                                        //                                             <FormControl>

                                        //                                                 <GradientBorder mb='24px' w='150px' borderRadius='20px'>
                                        //                                                     <Input
                                        //                                                         as={DatePicker} // Use the DatePicker component as an input
                                        //                                                         selected={selectedDates[date.id]}
                                        //                                                         selected={temporalRow[col.value] ? temporalRow[col.value] : ''}
                                        //                                                         onChange={e => handleInfoRow(e, col.value, col.type)}
                                        //                                                         dateFormat="yyyy-MM-dd"
                                        //                                                         placeholder={date.placeholder}   
                                        //                                                         color='white'
                                        //                                                         bg='rgb(19,21,54)'
                                        //                                                         border='transparent'
                                        //                                                         borderRadius='20px'
                                        //                                                         fontSize='sm'
                                        //                                                         size='lg'
                                        //                                                         w={{ base: "100%", md: "145px" }}
                                        //                                                         maxW='100%'
                                        //                                                         h='46px'
                                        //                                                         placeholder={`Buscar...`}
                                        //                                                     />
                                        //                                                 </GradientBorder>
                                        //                                             </FormControl>
                                        //                                             :

                                        //                                             <FormControl
                                        //                                                 isInvalid={false}
                                        //                                             onSubmit={handleSubmit}
                                        //                                             >

                                        //                                                 <GradientBorder
                                        //                                                     mb='24px'
                                        //                                                     w='150px'
                                        //                                                     borderRadius='5px'>
                                        //                                                     <Input
                                        //                                                         color='white'
                                        //                                                         bg='rgb(19,21,54)'
                                        //                                                         border='transparent'
                                        //                                                         borderRadius='5px'
                                        //                                                         fontSize='sm'
                                        //                                                         size='lg'
                                        //                                                         w={{ base: "100%", md: "150px" }}
                                        //                                                         maxW='100%'
                                        //                                                         h='46px'
                                        //                                                         value={temporalRow[col.value] != undefined ? temporalRow[col.value] : ''}
                                        //                                                         id={col.value}
                                        //                                                         type={field.typeField}
                                        //                                                         placeholder={field.placeholder}
                                        //                                                         onChange={e => handleInfoRow(e, col.value, col.type)}
                                        //                                                     />
                                        //                                                 </GradientBorder>
                                        //                                                 <FormErrorMessage>Campo vacío</FormErrorMessage>

                                        //                                             </FormControl>
                                        //                             )
                                        //                             :
                                        //                             <Text fontSize='sm' color='#fff' fontWeight='' pb='.5rem'>
                                        //                                 {temporalRow[col.value]}
                                        //                             </Text>

                                        //                         } */}
                                        //                     </>
                                        //                 }

                                        //             </Td>
                                        //         ))
                                        //     }


                                        // </Tr>

                                    }

                                </Tbody>



                            </Table>



                        </CardBody>
                        <Flex justify='center' align='center' w='100%' h='13%' mt="20px">
                            <Flex direction='column' maxW='50%' align='center'>
                                <Button
                                    size="sm"
                                    leftIcon={<BsClipboardPlusFill />}
                                    colorScheme='blue'
                                    variant='solid'
                                    mr="2"
                                    onClick={() => addNewRow()}
                                >
                                    Nueva fila
                                </Button>
                            </Flex>
                            <Flex direction='column' maxW='50%' align='center'>
                                <Button
                                    size="sm"
                                    leftIcon={<BsFillSendFill />}
                                    colorScheme='green'
                                    variant='solid'
                                    onClick={() => addNewRow()}
                                >
                                    Enviar
                                </Button>
                            </Flex>
                        </Flex>

                    </Card>
                </Flex>


            </>

        );
    }
);