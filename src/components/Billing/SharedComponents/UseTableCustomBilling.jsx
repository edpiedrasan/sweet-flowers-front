// react library
import React, { useContext, useState } from "react";
// reactstrap components
import { Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import {
    Box, Button, Flex, Icon, Text, ChakraProvider, FormControl, Input, FormLabel, FormErrorMessage, SimpleGrid, Grid, Select, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper,
    Td, Tbody, Tr, Table, Thead, Th, NumberDecrementStepper, useColorModeValue,
    Stack, chakra

} from "@chakra-ui/react";

import { Paginate } from "react-paginate-chakra-ui";


import IconBox from 'components/Icons/IconBox';

import { BsClipboardPlusFill, BsFillSendPlusFill, BsFillSendFill, BsFillBrushFill, BsFillPencilFill, BsFillPenFill } from "react-icons/bs";


import { FaEdit, FaUserEdit, FaRegEdit } from "react-icons/fa";
import { DeleteIcon, EditIco, ViewIcon } from '@chakra-ui/icons';



import { CartIcon, DocumentIcon, GlobeIcon, RocketIcon, StatsIcon, WalletIcon, FulgerIcon, CreditIcon, IconEdit } from 'components/Icons/Icons.js';
import GradientBorder from "components/GradientBorder/GradientBorder";

import { FaUser } from "react-icons/fa";

import theme from "theme/themeAuth.js";
import { useEffect } from "react";


import { RiSave3Fill } from "react-icons/ri";
import { HiArrowUturnLeft } from "react-icons/hi2";

//Import de componente contexto, para establecer variables globales
import { UserContext } from 'helpers/UserContext';

//Ruta para crear nuevo dato maestro
import { getBillings } from 'actions/billing';


import {
    // PaginationItem,
    // PaginationLink,
    // Pagination,
    CardHeader,
    FormGroup,
    // Button,
    // Input,
    // Table,
    Badge,
    // Card,
    // Col,
    // Row
} from "reactstrap";

import CardFooter from 'reactstrap/lib/CardFooter';


export const UseTableCustomBilling = React.memo(
    ({
        edit, columns, newInfo, setNewInfo, validateFormNow, setModalVisible
    }) => {

        const [rowsG, setRowsG] = useState([])


        //#region

        //Filtros request tables
        const [filters, setFilters] = useState([]);


        //Capturar los valores de los inputs de los filtros
        const handleOnfilterDynamic = (constant, e) => {
            console.log(constant, e)
            setFilters(prevState => ({
                ...prevState,
                [constant]: e
            }))
        }

        //Aplicar los filtros a la data de la tabla
        const renderRowsByFilters = (rows) => {

            if (Object.keys(filters).length === 0) {
                return rows
            } else {
                const filterKeys = Object.keys(filters);
                for (const element of filterKeys) {
                    const valueFiltered = filters[element].toString().toLowerCase();
                    rows = rows.filter((item) => item[element].toString().toLowerCase().indexOf(valueFiltered) != -1)
                }
                return rows
            }
        }


        const rows = renderRowsByFilters(rowsG);
        //#endregion


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

        const bgIconColor = useColorModeValue("white.300", "gray.700");


        useEffect(() => {
            getBillings().then((res) => {
                // console.log(res.isAxiosError)
                if (res.isAxiosError) {
                    console.log("Fallo de cargar las opciones", res)


                } else {
                    setRowsG(res.data.payload.billings)
                }

            })

        }, [])





        useEffect(() => {
            console.log(rows)
        }, [rows])


        const [sizePerPage, setSizePerPage] = useState(5)

        // const [page, setPage] = useState(1);

        const paginations = rows.length > sizePerPage ?
            rows.length / sizePerPage > Math.round(rows.length / sizePerPage) ?
                Math.round(rows.length / sizePerPage) + 1
                : Math.round(rows.length / sizePerPage)
            : 1

        // const renderPaginations = () => {
        //     const options = [];
        //     for (let i = 1; i <= paginations; i++) {
        //         options.push(
        //             <PaginationItem className={page === i ? "active" : ""} key={i}>
        //                 <PaginationLink
        //                     onClick={() => handleOnSetPage(i, "page")}
        //                 >
        //                     {i}
        //                 </PaginationLink>
        //             </PaginationItem>
        //         )
        //     }
        //     return options.length >= 5 ? page >= 5 ? options.slice(page - 3, page + 2) : options.slice(0, 5) : options;
        // }

        const handleOnSetPage = (page) => {
            setPage(page);
        };

        const handleSetNumPag = (e) => {
            setPage(1);
            const value = e.target.value;
            setSizePerPage(value);
        }


        // const [page, setPage] = React.useState(1);

        const [page, setPage] = useState(1);

        const handlePageClick =(page) => {

            // alert("aqui" , p)
            console.log(page)
            setPage(page);
        }






        return (

            <>

                <Flex direction='column' maxW='80%' align='start'>

                    <Text color='#fff' fontSize='md' fontWeight='bold'>
                        Filtros
                    </Text>
                </Flex>
                <Flex flexDirection='column' pt={{ base: '0px', md: '0px' }}>
                    <Grid templateColumns={{ sm: "1fr", lg: "100% 90%" }}>
                        {/* Cards Master Data */}


                        <>
                            {/* Filtros  */}

                            <SimpleGrid columns={{ sm: 1, md: columns.length - 1, xl: columns.length - 1 }} spacingX='40px' spacingY='0px'>

                                {columns.map((col, colIndex) => {
                                    return (


                                        col.type != "button" &&

                                        <Box>

                                            <FormControl
                                            // isInvalid={field.required && (newInfo[field.id] == '' || newInfo[field.id] == undefined) && validateFormNow}
                                            // onSubmit={handleSubmit}
                                            >
                                                <FormLabel
                                                    ms='4px'
                                                    fontSize='sm'
                                                    fontWeight='normal'
                                                    color='white'

                                                >
                                                    {col.label}

                                                </FormLabel>
                                                <GradientBorder
                                                    mb='24px'
                                                    w='130px'
                                                    borderRadius='20px'>
                                                    <Input
                                                        color='white'
                                                        bg='rgb(19,21,54)'
                                                        border='transparent'
                                                        borderRadius='20px'
                                                        fontSize='sm'
                                                        size='lg'
                                                        w={{ base: "100%", md: "346px" }}
                                                        maxW='100%'
                                                        h='46px'
                                                        placeholder={`Buscar...`}
                                                        onChange={(e) => handleOnfilterDynamic(col.value, e.target.value)}
                                                    // value={newInfo[field.id] ? newInfo[field.id] : ''}
                                                    // id={field.id}
                                                    // type={field.typeField}
                                                    // placeholder={field.placeholder}
                                                    // onChange={e => handleNewInfo(e, field.type)}
                                                    />
                                                </GradientBorder>
                                                {/* <FormErrorMessage>Campo vacío</FormErrorMessage> */}

                                            </FormControl>

                                        </Box>



                                    )
                                })}

                            </SimpleGrid>

                        </>



                    </Grid>
                </Flex>

                <Flex flexDirection='column' pt={{ base: '10px', md: '0px' }}>
                    <Grid templateColumns={{ sm: "1fr", lg: "100% 100%" }}>
                        {/* Cards Master Data */}


                        <>
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
                                            </Tr>
                                        </Thead>
                                        <Tbody>


                                            {rows.slice((page - 1) * sizePerPage, page * sizePerPage).map((row, rowIndex) => (
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


                                                                            <Button size="sm" leftIcon={<FaEdit />} colorScheme='blue' variant='solid' ml={4}
                                                                                onClick={() => setModalVisible(true)}
                                                                            >



                                                                            </Button>
                                                                        }
                                                                    </>
                                                                }

                                                            </Td>
                                                        ))
                                                    }


                                                </Tr>
                                            ))}
















                                        </Tbody>

                                        {/* Contenido de la tabla */}


                                        {/* </nav> */}

                                    </Table>
                                    <div>
                                        <hr

                                            width='740px'
                                            color='#ffff'
                                        />
                                    </div>

                                    {/* <Table variant='simple' color='#fff'>

                                        <Td borderBottomColor='#56577A' border={true ? "none" : null}>

                                            <Text fontSize='md' color='#fff' fontWeight='' pb='.5rem'>
                                            Mostrando del {((page - 1) * sizePerPage) + 1} al {page * sizePerPage > rows.length ? rows.length : page * sizePerPage} de {rows.length} resultados
                                            </Text>


                                        </Td>
                                    </Table> */}

                                    <Stack p={1}>
                                        <chakra.div>        <Text fontSize='md' color='#fff' fontWeight='' pb='.5rem'>
                                            Mostrando del {((page - 1) * sizePerPage) + 1} al {page * sizePerPage > rows.length ? rows.length : page * sizePerPage} de {rows.length} resultados
                                            La page {page}
                                            </Text></chakra.div>
                                        <Paginate
                                            // required props 👇
                                            page={page}
                                            count={rows.length}
                                            pageSize={5}
                                            onPageChange={(e)=>handlePageClick(e)}
                                            // optional props 👇
                                            margin={2}
                                            shadow="lg"
                                            fontWeight="white"
                                            variant="outline"
                                            colorScheme="purple"
                                            // ...border and other props also work 💪
                                            border="2px solid"
                                            // you can use w to adjust to parent
                                            // container
                                            w="full"
                                        />
                                    </Stack>
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