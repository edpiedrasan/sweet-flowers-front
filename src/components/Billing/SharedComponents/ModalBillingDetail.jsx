// react library
import React, { useEffect, useContext } from "react";
// reactstrap components
import { Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import GradientBorder from "components/GradientBorder/GradientBorder";

import { getUserPerson } from 'helpers/decodeToken';


import {
    Box, Button, Flex, Icon, Text, Tabs, TabList, TabPanels, Tab, TabPanel, ButtonGroup, Input,

    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,

    Stack,

    FormControl, FormLabel, FormErrorMessage,


    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,

    NumberInput,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInputField,


    Tr,
    Td,

    useToast,

    Grid,
    SimpleGrid,
    Table,
    Thead,
    Tbody,

    Th

} from "@chakra-ui/react";

import { urlBase } from "api/urls.jsx"

import urls from "api/urls.jsx"

import IconBox from 'components/Icons/IconBox';

import { CartIcon, DocumentIcon, GlobeIcon, RocketIcon, StatsIcon, WalletIcon, FulgerIcon, CreditIcon, IconEdit, } from 'components/Icons/Icons.js';

import { FaUser } from "react-icons/fa";

import { HiArrowUturnLeft, HiPrinter, HiOutlinePrinter } from "react-icons/hi2";
import { UseForm } from "./UseForm";
import { useState } from "react";

import { BsClipboardPlusFill, } from "react-icons/bs";

import { RiSave3Fill } from "react-icons/ri";

import { getPaymentHistory, payBilling } from 'actions/billing';
import { UseTable } from "./UseTable";



//Import de componente contexto, para establecer variables globales
import { UserContext } from 'helpers/UserContext';
import { getBillingDetails } from "actions/billing";

export const ModalBillingDetail = React.memo(
    ({
        title,
        fields,
        visible,
        setVisible,
        newInfo,
        setNewInfo,
        preChargeInfoModal,
        setPreChargeInfoModal,
        setRefreshOptions,
        billingDetail,
        setBillingDetail
    }) => {

        useEffect(() => {
            console.log("newInfo", newInfo);
        }, [newInfo])


        //Declarar el Toast de notificaciones
        const toast = useToast()

        //Indicarle al useForm que valide los campos
        const [validateFormNow, setValidateFormNow] = useState(false);




        //states globales
        const { options, setOptions, refreshOptions, refreshBilling, setRefreshBilling } = useContext(UserContext);







        const handleOnClose = () => {

            // setPreChargeInfoModal([]);
            // setVisible(false);
            // setValidateFormNow(false);

            setBillingDetail(null)
        }

        //State para almacenar el historial de pagos de la factura
        const [paymentHistory, setPaymentHistory] = useState([]);

        useEffect(() => {
            console.log(paymentHistory)
        }, [paymentHistory])

        const [columns, setcolumns] = useState(

            [
                { value: "quantity", label: "Cantidad", type: "input", editable: false },
                { value: "nameProduct", label: "Descripción", type: "input", editable: false },
                { value: "unitaryPrice", label: "Precio Unitario", type: "amount", editable: false },
                { value: "totalProduct", label: "Total", type: "input", editable: false }

            ]
        )

        const [rows, setRows] = useState([])

        const formatNumber = (number) => {
            return `₡${number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        }

        const getTotal = () => {
            let total = 0;

            rows.map(e => {
                total += parseInt(e.totalProduct.replace(/₡|,/g, ""));
            })

            return `₡${total?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        }


        const [payAmount, setPayAmount] = useState("")
        // const [payAmount, setPayAmount] = useState("")

        useEffect(() => {
            setPayAmount(newInfo.rowBilling?.balance)
        }, [newInfo])







        useEffect(() => {
            console.log("billingDetail", billingDetail)
        }, [billingDetail])


        //Cuando arranque traiga el historial de pagos
        useEffect(() => {

            if (billingDetail?.id != null) {

                getBillingDetails({ idBilling: billingDetail?.id }).then((res) => {
                    // console.log(res)
                    // console.log(res.isAxiosError)
                    if (res.isAxiosError) {
                        // console.log("login failed")
                        toast({
                            title: 'Atención',
                            description: `Ocurrió un error al extraer el detalle de factura!`,
                            status: 'warning',
                            duration: 4000,
                            isClosable: true,
                        })

                    } else {

                        console.log("ROWS", res.data.payload.detailBilling)
                        setRows(res.data.payload.detailBilling)
                        // setPaymentHistory(res.data.payload.historyBillings[0])


                        // handleCleanForm()
                        // setRefreshOptions(true);



                    }

                })
            }
        }, [billingDetail])






        return (
            <>
                <Modal isOpen={billingDetail != null}
                    onClose={() => { handleOnClose() }}
                    bg='linear-gradient(111.84deg, rgba(6, 11, 38, 0.94) 59.3%, rgba(26, 31, 55, 0) 100%)'

                >
                    <ModalOverlay />
                    <ModalContent
                        bg='linear-gradient(111.84deg, rgba(6, 11, 38, 0.94) 59.3%, rgba(26, 31, 55, 0) 100%)'
                    >
                        <ModalHeader  ><Text color='#fff' fontSize='lg' fontWeight='bold'>{title + '  #' + billingDetail?.id} </Text></ModalHeader>
                        <ModalCloseButton />
                        <ModalBody mt={6}>

                            <Flex flexDirection='column' pt={{ base: '1px', md: '0px' }}>
                                <Grid templateColumns={{ sm: "1fr", lg: "100% 100%" }}>
                                    {/* Cards Master Data */}


                                    <>

                                        <SimpleGrid columns={{ sm: 1, md: columns, xl: columns }} spacingX='2px' spacingY='20px'>

                                            <Flex direction='column' pt={{ base: "12px", md: "0px" }}>
                                                {/* Projects Table */}

                                                <Table variant='simple' color='#fff'>
                                                    <Thead>
                                                        <Tr my='.1rem' ps='0px'>

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


                                                        {rows?.map((row, rowIndex) => (
                                                            <Tr>
                                                                {

                                                                    columns.map((col, colIndex) => (
                                                                        <Td borderBottomColor='#56577A' border={true ? "none" : null} style={{ maxWidth: '100px' }}>

                                                                            <Text fontSize='sm' color='#fff' fontWeight='' pb='.1rem'>
                                                                                {col.value == "amount" ?

                                                                                    (row[col.value]?.value != undefined ? (formatNumber(row[col.value].label) +".."): formatNumber(row[col.value]) +".")

                                                                                    : (row[col.value]?.value != undefined ? row[col.value].label : row[col.value] )}
                                                                            </Text>


                                                                        </Td>
                                                                    ))
                                                                }


                                                            </Tr>
                                                        ))}






                                                    </Tbody>

                                                </Table>
                                                <div>
                                                    <hr

                                                        width='400px'
                                                        color='#ffff'
                                                    />
                                                </div>

                                                <Table variant='simple' color='#fff'>
                                                    <Td borderBottomColor='#56577A' border={true ? "none" : null} style={{ textAlign: 'left' }}>
                                                        <Text fontSize='md' color='#fff' fontWeight='' pb='.5rem'>
                                                            Total:  {getTotal(newInfo.rowBilling?.quantity)}
                                                        </Text>
                                                    </Td>
                                                </Table>

                                            </Flex>

                                        </SimpleGrid>


                                        {/* ); */}
                                    </>



                                </Grid>
                            </Flex>



                        </ModalBody>

                        <ModalFooter mt={8}>
                            <Flex justify='center' w='100%' align='center' h='13%'>
                                <Flex direction='column' maxW='100%' align='center'>
                                    <Button colorScheme='red' leftIcon={<HiArrowUturnLeft />} onClick={() => {
                                        setBillingDetail(null);

                                    }}
                                        marginRight="140px">
                                        Cerrar
                                    </Button>
                                </Flex>
                            </Flex>
                        </ModalFooter>

                    </ModalContent>
                </Modal>
            </>
        );
    }
);
