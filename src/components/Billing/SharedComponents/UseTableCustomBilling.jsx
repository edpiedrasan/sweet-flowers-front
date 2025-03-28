// react library
import React, { useContext, useState } from "react";
// reactstrap components
import { CardTitle, Col, Row } from "reactstrap";
import {
    Box, Button, Flex, Icon, Text, ChakraProvider, FormControl, Input, FormLabel, FormErrorMessage, SimpleGrid, Grid, Select, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper,
    Td, Tbody, Tr, Table, Thead, Th, NumberDecrementStepper, useColorModeValue,
    Stack, chakra, HStack, Badge, Progress,

    Stat,
    StatHelpText,
    StatLabel,
    StatNumber,

    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useToast



} from "@chakra-ui/react";

import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';

// import { Paginate } from "react-paginate-chakra-ui";


import IconBox from 'components/Icons/IconBox';

import { BsClipboardPlusFill, BsFillSendPlusFill, BsFillSendFill, BsFillBrushFill, BsFillPencilFill, BsFillPenFill } from "react-icons/bs";


import { FaEdit, FaUserEdit, FaRegEdit, FaMoneyBill, FaMoneyBillAlt, FaEraser, FaRedo, FaTimes, FaUndo, FaRegEye, FaTrash, FaEllipsisH, FaTrashRestore, FaMoneyBillWaveAlt, FaMoneyBillWave, FaMoneyCheckAlt, FaMoneyCheck } from "react-icons/fa";
import { DeleteIcon, EditIco, ViewIcon } from '@chakra-ui/icons';



import { CartIcon, DocumentIcon, GlobeIcon, RocketIcon, StatsIcon, WalletIcon, FulgerIcon, CreditIcon, IconEdit } from 'components/Icons/Icons.js';
import GradientBorder from "components/GradientBorder/GradientBorder";

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { FaUser } from "react-icons/fa";

import theme from "theme/themeAuth.js";
import { useEffect } from "react";
import withReactContent from 'sweetalert2-react-content';


import { RiSave3Fill } from "react-icons/ri";
import { HiArrowUturnLeft, HiPrinter } from "react-icons/hi2";

//Import de componente contexto, para establecer variables globales
import { UserContext } from 'helpers/UserContext';

//Ruta para crear nuevo dato maestro
import { getBillings, getPaymentHistory, deleteBilling } from 'actions/billing';

import Swal from "sweetalert2";




import {
    // PaginationItem,
    // PaginationLink,
    // Pagination,
    CardHeader,
    FormGroup,
    // Button,
    // Input,
    // Table,
    // Card,
    // Col,
    // Row
} from "reactstrap";

import CardFooter from 'reactstrap/lib/CardFooter';

import { ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { Paginate } from "./Paginate";
import { UseForm } from "./UseForm";
import { getOcupationPerson, getUserPerson } from "helpers/decodeToken";




export const UseTableCustomBilling = React.memo(
    ({
        edit, columns, newInfo, setNewInfo, validateFormNow, setModalVisible, setRefreshOptions, setBillingToPrint, setBillingDetail
    }) => {

        //#region Mensajes de notificaciones
        const MySwal = withReactContent(Swal);

        // const Toast = MySwal.mixin({
        //     toast: true,
        //     position: 'bottom-right',
        //     showConfirmButton: true,
        //     timer: 8000,
        //     didOpen: toast => {
        //         toast.addEventListener('mouseenter', Swal.stopTimer)
        //         toast.addEventListener('mouseleave', Swal.resumeTimer)
        //     }
        // });

        //Declarar el Toast de notificaciones
        const toast = useToast()
        //#endregion

        const [rowsG, setRowsG] = useState([])

        let ocupation = getOcupationPerson();

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

            setPage(1);
        }

        //Aplicar los filtros a la data de la tabla
        const renderRowsByFilters = (rows) => {

            if (Object.keys(filters)?.length === 0) {
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
        const { options, refreshBilling, setRefreshBilling } = useContext(UserContext);
        let optionsG = {
            statusBilling:
                [{ label: "Al Día", value: "1" }, { label: "Vencida", value: "2" }],
            paymentBilling:
                [{ label: "Pendiente", value: "1" }, { label: "Cancelada", value: "2" }],

            ...options
        }
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
            getBillings({ startDate: selectedDates.startDate, endDate: selectedDates.endDate }).then((res) => {
                // console.log(res.isAxiosError)
                if (res.isAxiosError) {
                    console.log("Fallo de cargar las opciones", res)


                } else {
                    setRowsG(res.data.payload.billings)
                }

            })

        }, [])



        useEffect(() => {
            if (refreshBilling) {
                setRefreshBilling(false)

                getBillings({ startDate: selectedDates.startDate, endDate: selectedDates.endDate }).then((res) => {
                    // console.log(res.isAxiosError)
                    if (res.isAxiosError) {
                        console.log("Fallo de cargar las opciones", res)


                    } else {
                        setRowsG(res.data.payload.billings)
                    }

                })
            }
        }, [refreshBilling])









        useEffect(() => {
            console.log(rows)
        }, [rows])


        const [sizePerPage, setSizePerPage] = useState(5)



        const paginations = rows?.length > sizePerPage ?
            rows.length / sizePerPage > Math.round(rows.length / sizePerPage) ?
                Math.round(rows?.length / sizePerPage) + 1
                : Math.round(rows?.length / sizePerPage)
            : 1

        const [page, setPage] = useState(1);

        //Lista de opciones de números de página a escoger en la tabla.
        const [listPaginations, setListPagionations] = useState([5, 25, 50, 100, 1000, 5000, 10000])

        //Función para establecer la cantidad de registros por página.
        const handlePageQuantity = (e) => {
            setSizePerPage(parseInt(e.target.children[e.target.selectedIndex].value))
        }

        useEffect(() => {
            console.log("newInfo", newInfo)
        }, [newInfo])

        const handleModalVisible = (row) => {

            // console.log("row", row);

            getPaymentHistory({ idBilling: row.idBilling }).then((res) => {
                // console.log(res.isAxiosError)
                if (res.isAxiosError) {
                    console.log("Fallo de cargar las opciones", res)


                } else {
                    // console.log("ESTA ES LA DATA" , res.data.payload.historyBillings)
                    setModalVisible(true);

                    setNewInfo({
                        ...newInfo,
                        ['modalItems']:
                            res.data.payload.historyBillings,
                        ['rowBilling']: row

                    })

                }

            })


        }

        //Realizar un formato a los números tipo colones
        const formatNumber = (number) => {
            return `₡${number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        }

        //Array con las fechas especiales a escoger
        const [datesFields, setDatesFields] = useState([
            {
                id: "startDate",
                label: "Fecha de inicio",
                placeholder: "Toque"
            },
            {
                id: "endDate",
                label: "Fecha final",
                placeholder: "Toque"
            }
        ])


        //Las fechas escogidas
        const [selectedDates, setSelectedDates] = useState({ startDate: null, endDate: null });

        //Para cambiar las fechas del state
        const handleDateChange = (index, date) => {
            setSelectedDates((prevSelectedDates) => ({
                ...prevSelectedDates,
                [index]: date,
            }));

            setRefreshBilling(true);
            setrenderByDate(true);

            setPage(1);
        };

        useEffect(() => {
            console.log("Filtros de fechas", selectedDates)
        }, [selectedDates])

        //Array para desplegar reporte rápido
        const [statsItems, setstatsItems] = useState([
            {
                id: "totalAmount",
                text: "Total facturado",
                keyToSearch: "quantity",
                typeSearch: "number"
            },
            {
                id: "paymenthistoryAmount",
                text: "Total cancelado",
                keyToSearch: "paymenthistory",
                typeSearch: "number"

            },
            {
                id: "pendingAmount",
                text: "Saldo pendiente",
                keyToSearch: "balance",
                typeSearch: "number"

            },
            {
                id: "Vencidas",
                text: "Cantidad vencidas",
                keyToSearch: "expirationState",
                valueToSearch: "Vencida",
                typeSearch: "quantity"
            },

        ])

        const [dataQuickStats, setDataQuickStats] = useState({})
        const [renderStatsFirstTime, setRenderStatsFirstTime] = useState(false);

        const [renderByDate, setrenderByDate] = useState(false);

        //Cuando cambie los filtros.
        useEffect(() => {
            asignStats();
            setPage(1);
            console.log("cambio filters")
        }, [filters])

        //Cuando cambie las rows renderizar por primera vez.
        useEffect(() => {
            if (
                (renderStatsFirstTime == false && rows.length > 0)
                ||
                ((selectedDates.startDate !== null || selectedDates.endDate !== null) && renderByDate)
            ) {
                console.log("cambio rows")
                // Alert("cambio rows")
                asignStats();
                setrenderByDate(false);
                setRenderStatsFirstTime(true);

                setPage(1)
            }
        }, [rows])

        //Método para asignar las estadísticas rápidas según las rows.
        const asignStats = () => {
            let data = {};

            statsItems.map((stat, i) => {

                let result = 0;

                rows.map((row, rowI) => {

                    if (stat.typeSearch == "number") {
                        result += parseInt(row[stat.keyToSearch])
                    } else if (stat.typeSearch == "quantity") {
                        // debugger;
                        if (row[stat.keyToSearch /*wayPayment */] == stat.valueToSearch/*Credito */) {
                            result++;
                        }
                    }


                });

                data = { ...data, [stat.id]: stat.typeSearch == "number" ? formatNumber(result) : result }


            });

            // console.log("Stats!!",data)
            setDataQuickStats(data)
        }






        useEffect(() => {
            console.log("Rows", rows)
        }, [rows])

        useEffect(() => {
            console.log("SELECTED DATES", selectedDates)
        }, [selectedDates])


        //Establece las opciones de dropdowns de los filtros.
        const buildFilterOptions = (columnOptions) => {


            let toReturn = [];

            toReturn = optionsG[columnOptions]?.map(option => (
                <option key={option.value} value={option.label} label={option.label}>{option.label}</option>
            ))

            return toReturn;
        }

        const handleRefresh = () => {
            setFilters([])
            setSelectedDates({ startDate: null, endDate: null });
            setRefreshBilling(true);

            setRenderStatsFirstTime(false);

        }


        //State para desplegar la lista de botones de acciones.
        const [displayListButtons, setDisplayListButtons] = useState("");
        const [alert, setAlert] = useState("")


        //Método para eliminar una factura si es administrador.
        const handleDeleteBilling = (id) => {
            MySwal.fire({

                type: 'warning',
                title: `Eliminar Factura`,
                html:

                    `<h2>¿Está seguro que desea eliminar la factura #${id}?</h2>`,

                confirmButtonText: 'Si, eliminar',
                confirmButtonColor: '#f5365c',
                cancelButtonText: 'No, cancelar',
                showCancelButton: true,

                preConfirm: () => {

                    deleteBilling({ idBilling: id, user: getUserPerson() }).then((res) => {
                        // console.log(res.isAxiosError)
                        if (res.isAxiosError) {
                            toast({
                                title: 'Atención',
                                description: `Ocurrió un error al eliminar la factura`,
                                status: 'warning',
                                duration: 4000,
                                isClosable: true,
                            })


                        } else {
                            toast({
                                title: 'Atención',
                                description: `Factura eliminada con éxito!`,
                                status: 'success',
                                duration: 4000,
                                isClosable: true,
                            })
                            handleRefresh();
                            setRefreshOptions(true);
                            setRenderStatsFirstTime(false);
                        }

                    })
                },

            })
        }

        useEffect(() => {
            console.log("ROWS", rows)
        }, [rows])



        return (

            <>
                {/* Estadística 
                FaEraser,FaRedo, FaTimes, FaUndo, FaTrash, FaTrashRestore,
                */}


                <Grid
                    templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
                    gap={{ base: '16px', md: '0px' }}
                    pt={{ base: '0px', md: '0px' }}
                >
                    {statsItems.map((stat, i) => (
                        <Card minH='83px'>
                            <CardBody>
                                <Flex flexDirection='row' align='center' justify='center' w='100%'>
                                    <Stat me='auto'>
                                        <StatLabel fontSize='sm' color='gray.400' fontWeight='bold' pb='2px'>
                                            {stat.text}
                                        </StatLabel>
                                        <Flex>
                                            <StatNumber fontSize='lg' color='#fff'>
                                                {dataQuickStats[stat.id]}
                                            </StatNumber>
                                            {/* <StatHelpText
                      alignSelf='flex-end'
                      justifySelf='flex-end'
                      m='0px'
                      color='green.400'
                      fontWeight='bold'
                      ps='3px'
                      fontSize='md'>
                      +5%
                  </StatHelpText> */}
                                        </Flex>
                                    </Stat>
                                    <IconBox as='box' h={'45px'} w={'45px'} bg='brand.200'>
                                        <GlobeIcon h={'24px'} w={'24px'} color='#fff' />
                                    </IconBox>
                                </Flex>
                            </CardBody>
                        </Card>



                    ))}
                </Grid>






                <Flex direction='row' maxW='90%' align='start' marginTop='20px'>
                    <Text color='#fff' fontSize='xl' fontWeight='bold'>
                        Filtros
                    </Text>
                    <Button size="sm" colorScheme='purple' variant='solid' ml={4} onClick={() => { handleRefresh() }} style={{ display: 'flex', alignItems: 'center' }}>
                        <FaTrash style={{ verticalAlign: 'middle' }} />
                    </Button>
                </Flex>
                <Flex flexDirection='column' pt={{ base: '0px', md: '0px' }}>
                    <Grid templateColumns={{ sm: "1fr", lg: "100% 90%" }}>
                        {/* Cards Master Data */}


                        <>
                            {/* Filtros  */}

                            <SimpleGrid columns={{ sm: 2, md: 4, xl: 4 }} spacingX='20px' spacingY='0px'>

                                {columns.map((col, colIndex) => {
                                    return (

                                        col.typeInFilter == "select" ?

                                            <Box>

                                                <FormControl
                                                // isInvalid={field.required && ((newInfo[field.id] == '' || newInfo[field.id] == undefined) || (field.type == 'select' && newInfo[field.id].label == '')) && validateFormNow}
                                                // onSubmit={handleSubmit}
                                                >
                                                    <FormLabel
                                                        ms='0px'
                                                        fontSize='sm'
                                                        fontWeight='normal'
                                                        color='white'

                                                    >
                                                        {col.label}
                                                    </FormLabel>
                                                    <GradientBorder
                                                        mb='24px'
                                                        w='150px'
                                                        borderRadius='20px'>

                                                        <Select
                                                            placeholder={`Buscar...`}
                                                            id={col.value}

                                                            color='gray'
                                                            colorOptions='Black'
                                                            bg='rgb(19,21,54)'
                                                            border='transparent'
                                                            borderRadius='20px'
                                                            fontSize='sm'
                                                            size='lg'
                                                            w={{ base: "100%", md: "346px" }}
                                                            maxW='100%'
                                                            h='46px'

                                                            value={filters[col.value] ? newInfo[col.value] : ''}
                                                            onChange={(e) => handleOnfilterDynamic(col.value, e.target.value)}

                                                            // onChange={e => handleNewInfo(e, field.type)}
                                                            // value={newInfo[field.id]?.value ? newInfo[field.id]?.value : ''}


                                                            _focus={{ bg: 'black' }} // Establecer el color de fondo cuando el componente está enfocado

                                                        >
                                                            {
                                                                buildFilterOptions(col.options)
                                                            /* {field.optionsDependsAnotherDropdown == '' ? options[field.options]?.map(option => (
                                                                <option key={option.value} value={option.value} label={option.label}>{option.label}</option>
                                                            ))

                                                                :



                                                                buildOptions(field)

                                                            } */}

                                                        </Select>

                                                    </GradientBorder>

                                                </FormControl>

                                            </Box>

                                            : col.typeInFilter != "button" && col.typeInFilter != "date" ?

                                                <Box>

                                                    <FormControl
                                                    // isInvalid={field.required && (newInfo[field.id] == '' || newInfo[field.id] == undefined) && validateFormNow}
                                                    // onSubmit={handleSubmit}
                                                    >
                                                        <FormLabel
                                                            ms='0px'
                                                            fontSize='sm'
                                                            fontWeight='normal'
                                                            color='white'

                                                        >
                                                            {col.label}

                                                        </FormLabel>
                                                        <GradientBorder
                                                            mb='24px'
                                                            w='150px'
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
                                                                value={filters[col.value] ? newInfo[col.value] : ''}

                                                            // value={newInfo[field.id] ? newInfo[field.id] : ''}
                                                            // id={field.id}
                                                            // type={field.typeField}
                                                            // placeholder={field.placeholder}
                                                            // onChange={e => handleNewInfo(e, field.type)}
                                                            />
                                                        </GradientBorder>
                                                        {/* <FormErrorMessage>Campo vacío</FormErrorMessage> */}

                                                    </FormControl>

                                                </Box> :
                                                col.typeInFilter != "button" &&
                                                <>
                                                    {datesFields.map((date, i) => (
                                                        <Box key={i}>
                                                            <FormControl>
                                                                <FormLabel ms='4px' fontSize='sm' fontWeight='normal' color='white'>
                                                                    {date.label}
                                                                </FormLabel>
                                                                <GradientBorder mb='24px' w='150px' borderRadius='20px'>
                                                                    {/* <DatePicker
                                                                    selected={selectedDates[date.id]}
                                                                    onChange={(dateAux) => handleDateChange(date.id, dateAux)}
                                                                    dateFormat="yyyy-MM-dd"
                                                                    placeholderText={date.placeholder}
                                                                /> */}
                                                                    <Input
                                                                        as={DatePicker} // Use the DatePicker component as an input
                                                                        selected={selectedDates[date.id]}
                                                                        onChange={(dateAux) => handleDateChange(date.id, dateAux)}
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
                                                        </Box>
                                                    ))}


                                                </>




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
                            <SimpleGrid columns={{ sm: 1, md: columns, xl: columns }} spacingX='2px' spacingY='15px'>

                                <Flex direction='column' pt={{ base: "12px", md: "0px" }}>
                                    {/* Tabla */}

                                    <Card overflowX={{ sm: 'scroll', xl: 'hidden' }}>
                                        <CardBody>



                                            <Table variant='simple' color='#fff' p={"0px"}>
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

                                                {/* Filas */}
                                                <Tbody>


                                                    {rows.slice((page - 1) * sizePerPage, page * sizePerPage).map((row, rowIndex) => (
                                                        <Tr>
                                                            {

                                                                columns.map((col, colIndex) => (
                                                                    <Td borderBottomColor='#56577A' border={true ? "none" : null}>

                                                                        {col.type == 'button' ?
                                                                            //  <Flex direction="row">
                                                                            <>

                                                                                {
                                                                                    displayListButtons == row.idBilling ?
                                                                                        <>
                                                                                            {/* Botones de acciones */}
                                                                                            {/* {edit
                                                                                                // && row.wayPayment == "Credito"
                                                                                                // && row.balance > 0
                                                                                                && */}




                                                                                            <Button size="sm" colorScheme='blue' variant='solid' ml={4} onClick={() => handleModalVisible(row)} style={{ display: 'flex', alignItems: 'center' }}>
                                                                                                <FaMoneyBillAlt style={{ verticalAlign: 'middle' }} />
                                                                                            </Button>




                                                                                            <Button size="sm" colorScheme='purple' variant='solid' ml={4} onClick={() => { setBillingToPrint({ id: row.idBilling }) }} style={{ display: 'flex', alignItems: 'center' }}>
                                                                                                <HiPrinter style={{ verticalAlign: 'middle' }} />
                                                                                            </Button>

                                                                                            <Button size="sm" colorScheme='green' variant='solid' ml={4} onClick={() => { setBillingDetail({ id: row.idBilling }) }} style={{ display: 'flex', alignItems: 'center' }}>
                                                                                                <FaRegEye style={{ verticalAlign: 'middle' }} />
                                                                                            </Button>

                                                                                            {//Sólo los administradores pueden usar el botón de eliminar.
                                                                                                [1, 3].includes(ocupation) &&
                                                                                                <Button size="sm" colorScheme='red' variant='solid' ml={4} onClick={() => { handleDeleteBilling(row.idBilling) }} style={{ display: 'flex', alignItems: 'center' }}>
                                                                                                    <FaTrash style={{ verticalAlign: 'middle' }} />
                                                                                                </Button>
                                                                                            }

                                                                                        </>
                                                                                        :
                                                                                        //Botón para desplegar los botones de acciones.
                                                                                        <Button size="sm" colorScheme='green' variant='solid' ml={4} onClick={() => { setDisplayListButtons(row.idBilling) }} style={{ display: 'flex', alignItems: 'center' }}>
                                                                                            <FaEllipsisH style={{ verticalAlign: 'middle' }} />
                                                                                        </Button>


                                                                                }
                                                                                {/* { edit
                                                                                    && row.wayPayment == "Credito"
                                                                                    && row.balance > 0
                                                                                    &&


                                                                                    <Button size="sm" leftIcon={<FaMoneyBillAlt />} colorScheme='blue' variant='solid' ml={4}
                                                                                        onClick={() => handleModalVisible(row)}
                                                                                    >

                                                                                    </Button>
                                                                                
                                                                               }
                                                                                    
                                                                                <Button size="sm" leftIcon={<HiPrinter />} colorScheme='purple' variant='solid' ml={4}
                                                                                    onClick={() => setBillingToPrint({ id: row.idBilling })}
                                                                                >

                                                                                </Button> */}


                                                                            </>

                                                                            // </Flex>
                                                                            : col.type == 'badge' ?

                                                                                <Badge colorScheme=
                                                                                    {(row[col.value]?.value != undefined ? row[col.value].label : row[col.value]) == "Vencida" ? "red" :
                                                                                        (row[col.value]?.value != undefined ? row[col.value].label : row[col.value]) == "Pendiente" ? "orange" :
                                                                                            (row[col.value]?.value != undefined ? row[col.value].label : row[col.value]) == "Credito" ? "purple" :
                                                                                                (row[col.value]?.value != undefined ? row[col.value].label : row[col.value]) == "Contado" ? "blue" :
                                                                                                    "green"}

                                                                                > {row[col.value]?.value != undefined ? row[col.value].label : row[col.value]}</Badge>

                                                                                : col.formatNumber == true ?
                                                                                    <Text fontSize='sm' color='#fff' fontWeight='' pb='.5rem'>
                                                                                        {row[col.value]?.value != undefined ? formatNumber(row[col.value].label) : formatNumber(row[col.value])}
                                                                                    </Text>
                                                                                    :

                                                                                    <Text fontSize='sm' color='#fff' fontWeight='' pb='.5rem'>
                                                                                        {row[col.value]?.value != undefined ? row[col.value].label : row[col.value]}
                                                                                    </Text>


                                                                        }

                                                                    </Td>
                                                                ))
                                                            }


                                                        </Tr>
                                                    ))}

                                                </Tbody>

                                            </Table>
                                            {/* <div>
                                                <hr

                                                    width='740px'
                                                    color='#ffff'
                                                />
                                            </div> */}
                                        </CardBody>
                                    </Card>

                                    {/* Paginación */}
                                    <Flex alignItems="center" justifyContent="space-between">



                                        {<Stack p={1}>
                                            <chakra.div>
                                                <Text fontSize='md' color='#fff' fontWeight='' pb='.5rem'>
                                                    Mostrando del {((page - 1) * sizePerPage) + 1} al {page * sizePerPage > rows?.length ? rows?.length : page * sizePerPage} de {rows?.length} resultados.
                                                </Text>
                                            </chakra.div>
                                            <Paginate
                                                count={rows?.length}
                                                paginations={paginations}
                                                pageSize={sizePerPage}
                                                page={page}
                                                onPageChange={setPage}
                                                margin={2}
                                                size={"md"}
                                                selectedVariant={"solid"}
                                                variant={"outline"}
                                                previousIcon={<ChevronLeftIcon />}
                                                nextIcon={<ChevronRightIcon />}
                                                colorScheme={"purple"}
                                                fontWeight={"light"}
                                                borderRadius={"md"}
                                            ></Paginate>

                                        </Stack>}

                                        <Stack p={1}>
                                            <FormControl
                                            >
                                                <FormLabel
                                                    ms='4px'
                                                    fontSize='sm'
                                                    fontWeight='normal'
                                                    color='white'

                                                >
                                                    Cantidad de filas por página:
                                                </FormLabel>
                                                <GradientBorder
                                                    mb='24px'
                                                    w='100px'
                                                    borderRadius='20px'>

                                                    <Select
                                                        // placeholder={field.placeholder}
                                                        // id={field.id}

                                                        color='gray'
                                                        colorOptions='Black'
                                                        bg='rgb(19,21,54)'
                                                        border='transparent'
                                                        borderRadius='20px'
                                                        fontSize='sm'
                                                        size='lg'
                                                        w={{ base: "100%", md: "346px" }}
                                                        maxW='100%'
                                                        h='46px'
                                                        onChange={e => handlePageQuantity(e)}
                                                        // value={newInfo[field.id]?.value ? newInfo[field.id]?.value : ''}


                                                        _focus={{ bg: 'black' }} // Establecer el color de fondo cuando el componente está enfocado

                                                    >
                                                        {listPaginations.map((number, i) => (
                                                            <option key={i} value={number} label={number.toString()}>{number}</option>
                                                        ))}


                                                    </Select>

                                                </GradientBorder>

                                            </FormControl>


                                        </Stack>
                                    </Flex>

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