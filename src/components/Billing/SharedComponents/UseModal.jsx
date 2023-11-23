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

import IconBox from 'components/Icons/IconBox';

import { CartIcon, DocumentIcon, GlobeIcon, RocketIcon, StatsIcon, WalletIcon, FulgerIcon, CreditIcon, IconEdit, } from 'components/Icons/Icons.js';

import { FaUser } from "react-icons/fa";

import { HiArrowUturnLeft } from "react-icons/hi2";
import { UseForm } from "./UseForm";
import { useState } from "react";

import { BsClipboardPlusFill, } from "react-icons/bs";

import { RiSave3Fill } from "react-icons/ri";

import { getPaymentHistory, payBilling } from 'actions/billing';
import { UseTable } from "./UseTable";



//Import de componente contexto, para establecer variables globales
import { UserContext } from 'helpers/UserContext';

export const UseModal = React.memo(
    ({
        title,
        fields,
        visible,
        setVisible,
        newInfo,
        setNewInfo,
        preChargeInfoModal,
        setPreChargeInfoModal,
        setRefreshOptions
    }) => {

        useEffect(() => {
            console.log("newInfo", newInfo);
        }, [newInfo])


        //Declarar el Toast de notificaciones
        const toast = useToast()

        //Indicarle al useForm que valide los campos
        const [validateFormNow, setValidateFormNow] = useState(false);

        //Se almacena la nueva información 
        const [newInfoModal, setNewInfoModal] = useState([]);

        //Efecto para prestablecer la información del formulario del modal
        useEffect(() => {
            if (typeof preChargeInfoModal === 'object') {
                setNewInfoModal(preChargeInfoModal)
                // console.log("Información precargada", preChargeInfoModal)
            }

        }, [preChargeInfoModal])

        //states globales
        const { options, setOptions, refreshOptions, refreshBilling, setRefreshBilling } = useContext(UserContext);






        useEffect(() => {
            // console.log("INFO DEL MODAL", newInfoModal)
        }, [newInfoModal])

        useEffect(() => {
            // console.log("INFO DEL MODAL", newInfoModal)
        }, [newInfoModal])



        //Handle para pagar factura
        const handlePayBilling = () => {
            // debugger;

            payBilling({ idBilling: newInfo.rowBilling.idBilling, payAmount: payAmount, user: getUserPerson() }).then((res) => {
                // console.log(res)
                // console.log(res.isAxiosError)
                if (res.isAxiosError) {
                    // console.log("login failed")
                    toast({
                        title: 'Atención',
                        description: `Ocurrió un error al realizar el pago!`,
                        status: 'warning',
                        duration: 4000,
                        isClosable: true,
                    })

                } else {

                    console.log(res.data.payload)

                    toast({
                        title: 'Atención',
                        description: `¡Pago realizado con éxito!`,
                        status: 'success',
                        duration: 4000,
                        isClosable: true,
                    })


                    handleOnClose();
                    // handleCleanForm()
                    setRefreshBilling(true)



                }
            })


            if (payAmount != "") {




            } else {

                setValidateFormNow(true);

                toast({
                    title: 'Atención',
                    description: `Debe ingresar el monto a pagar en el campo inferior.`,
                    status: 'warning',
                    duration: 4000,
                    isClosable: true,
                })

            }

        }

        const validateForm = () => {
            let fieldsVoids = fields
                .filter(field => field.required == true)
                .filter(field => {
                    if (newInfoModal[field.id] == '' || newInfoModal[field.id] == undefined) {
                        return field
                    }
                })

            return [!fieldsVoids.length > 0, fieldsVoids.length]

        }

        const handleOnClose = () => {

            setPreChargeInfoModal([]);
            setVisible(false);
            setValidateFormNow(false);
        }

        //State para almacenar el historial de pagos de la factura
        const [paymentHistory, setPaymentHistory] = useState([]);

        //Cuando arranque traiga el historial de pagos
        useEffect(() => {

            getPaymentHistory({ idBilling: 24 }).then((res) => {
                // console.log(res)
                // console.log(res.isAxiosError)
                if (res.isAxiosError) {
                    // console.log("login failed")
                    toast({
                        title: 'Atención',
                        description: `Ocurrió un error al extraer el historial de pagos!`,
                        status: 'warning',
                        duration: 4000,
                        isClosable: true,
                    })

                } else {

                    setPaymentHistory(res.data.payload.historyBillings[0])


                    // handleCleanForm()
                    // setRefreshOptions(true);



                }

            })
        }, [])

        useEffect(() => {
            console.log(paymentHistory)
        }, [paymentHistory])

        const [columns, setcolumns] = useState(

            [
                { value: "amount", label: "Pago", type: "input", editable: false },
                { value: "createdAtF", label: "Fecha", type: "input", editable: false },
                { value: "createdBy", label: "Cajero", type: "input", editable: false }
            ]
        )

        const [rows, setrows] = useState([])


        const formatNumber = (number) => {
            return `₡${number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        }

        const getTotal = () => {
            let total = 0;

            newInfo.modalItems.map(e => {
                total += parseInt(e.amount);
            })

            return `₡${total?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        }

        const [payAmount, setPayAmount] = useState("")
        // const [payAmount, setPayAmount] = useState("")

        useEffect(() => {
            setPayAmount(newInfo.rowBilling?.balance)
        }, [newInfo])



        const handleAmount = (e) => {
            console.log(e)

            if ((newInfo.rowBilling?.balance >= e && e > 0) || e == "") {
                console.log(e)
                setPayAmount(e)
            }

        }



        useEffect(() => {
            console.log("payAmount", payAmount)
        }, [payAmount])


        return (
            <>
                <Modal isOpen={visible}
                    onClose={() => { handleOnClose() }}
                    bg='linear-gradient(111.84deg, rgba(6, 11, 38, 0.94) 59.3%, rgba(26, 31, 55, 0) 100%)'
                >
                    <ModalOverlay />
                    <ModalContent
                        bg='linear-gradient(111.84deg, rgba(6, 11, 38, 0.94) 59.3%, rgba(26, 31, 55, 0) 100%)'
                    >
                        <ModalHeader><Text color='#fff' fontSize='lg' fontWeight='bold'>{title} </Text></ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>

                            <Flex flexDirection='column' pt={{ base: '10px', md: '0px' }}>
                                <Grid templateColumns={{ sm: "1fr", lg: "100% 100%" }}>
                                    {/* Cards Master Data */}


                                    <>

                                        <SimpleGrid columns={{ sm: 1, md: columns, xl: columns }} spacingX='2px' spacingY='20px'>

                                            <Flex direction='column' pt={{ base: "12px", md: "0px" }}>
                                                {/* Projects Table */}

                                                <Table variant='simple' color='#fff'>
                                                    <Thead>
                                                        <Tr my='.2rem' ps='0px'>

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

                                                                            <Text fontSize='sm' color='#fff' fontWeight='' pb='.5rem'>
                                                                                {col.value == "amount" ?
                                                                                    (row[col.value]?.value != undefined ? formatNumber(row[col.value].label) : formatNumber(row[col.value]))
                                                                                    : (row[col.value]?.value != undefined ? row[col.value].label : row[col.value])}
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

                                                    <Td borderBottomColor='#56577A' border={true ? "none" : null}>

                                                        <Text fontSize='md' color='#fff' fontWeight='' pb='.5rem'>
                                                            Saldo total:  {formatNumber(newInfo.rowBilling?.quantity)}
                                                        </Text>


                                                    </Td>

                                                    <Td borderBottomColor='#56577A' border={true ? "none" : null}>

                                                        <Text fontSize='md' color='#fff' fontWeight='' pb='.5rem'>
                                                            Total pagado:  {getTotal(newInfo.rowBilling?.quantity)}
                                                        </Text>


                                                    </Td>
                                                </Table>
                                            </Flex>

                                        </SimpleGrid>


                                        {/* ); */}
                                    </>



                                </Grid>
                            </Flex>

                            {(newInfo.rowBilling?.balance) > 0
                                &&
                                <Flex flexDirection='column' pt={{ base: '0px', md: '0px' }}>
                                    <Grid templateColumns={{ sm: "1fr", lg: "100% 90%" }}>
                                        {/* Cards Master Data */}


                                        <>

                                            {/* {billingData.map((row) => { */}
                                            {/* return ( */}
                                            <SimpleGrid columns={{ sm: 1, md: 1, xl: 1 }} spacingX='40px' spacingY='0px'>





                                                <Box>

                                                    <FormControl
                                                        isInvalid={validateFormNow == true && payAmount == ""}
                                                    // onSubmit={handleSubmit}
                                                    >
                                                        <FormLabel
                                                            ms='4px'
                                                            fontSize='sm'
                                                            fontWeight='normal'
                                                            color='white'

                                                        >
                                                            Cliente va a pagar:
                                                        </FormLabel>
                                                        <GradientBorder
                                                            mb='2px'
                                                            w='300px'
                                                            borderRadius='20px'>
                                                            <NumberInput
                                                                w={{ base: "100%", md: "346px" }}
                                                                maxW='100%'
                                                                h='46px'
                                                                borderRadius='20px'
                                                                color='white'
                                                                bg='rgb(19,21,54)'
                                                                border='transparent'
                                                                fontSize='sm'
                                                                size='lg'
                                                                value={payAmount}
                                                                onChange={e => handleAmount(e)}
                                                                placeholder={"Ingrese el monto a pagar del cliente..."}

                                                            >

                                                                <NumberInputField
                                                                    w={{ base: "100%", md: "346px" }}
                                                                    maxW='100%'
                                                                    h='46px'
                                                                    color='white'
                                                                    border='transparent'
                                                                    fontSize='sm'
                                                                    size='lg'
                                                                    borderRadius='20px'
                                                                    value={2000}

                                                                // value={newInfo[field.id] ? newInfo[field.id] : ''}
                                                                // id={field.id}
                                                                // type={field.typeField}
                                                                // placeholder={field.placeholder}
                                                                // onChange={e => handleNewInfo(e, field.type)}
                                                                />

                                                            </NumberInput>
                                                        </GradientBorder>
                                                        <FormErrorMessage>Campo vacío</FormErrorMessage>

                                                    </FormControl>

                                                </Box>






                                            </SimpleGrid>
                                        </>



                                    </Grid>
                                </Flex>
                            }

                        </ModalBody>

                        <ModalFooter>

                            <Flex justify='space-between' w='100%' align='center' h='13%'>

                                {payAmount > 0 &&
                                    <Flex direction='column' maxW='50%' align='center'>

                                        <Button colorScheme='blue' ml={21}
                                            leftIcon={<RiSave3Fill />}

                                            // onClick={onClose}
                                            // onClick={setModalVisible(false)}
                                            onClick={() => handlePayBilling()}

                                        >
                                            Pagar
                                        </Button>
                                    </Flex>
                                }
                                <Flex direction='column' maxW={payAmount > 0?'50%':'100%'} align='center'>

                                    <Button colorScheme='red' mr={140}
                                        leftIcon={<HiArrowUturnLeft />}

                                        // onClick={onClose}
                                        // onClick={setModalVisible(false)}
                                        onClick={() => {


                                            handleOnClose()
                                        }}

                                    >
                                        Cancelar
                                    </Button>
                                </Flex>
                            </Flex>


                            {/* <Stack direction='row' align="flex-center" spacing={2}>
                                <Button colorScheme='blue' mr={2}
                                
                                // onClick={onClose}
                                // onClick={setModalVisible(false)}
                                //onClick={() => setModalVisible(false)}

                                >
                                    Enviar
                                </Button>
                                <Button colorScheme='red'  mr={20}
                                    // onClick={onClose}
                                    // onClick={setModalVisible(false)}
                                    onClick={() => setVisible(false)}

                                >
                                    Cancelar
                                </Button>
                            </Stack> */}

                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>
        );
    }
);
