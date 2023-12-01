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
import { printBilling } from "actions/billing";

export const ModalPrintBilling = React.memo(
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
        billingToPrint,
        setBillingToPrint
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

            setBillingToPrint(null)
        }

        //State para almacenar el historial de pagos de la factura
        const [paymentHistory, setPaymentHistory] = useState([]);

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



        const [payAmount, setPayAmount] = useState("")
        // const [payAmount, setPayAmount] = useState("")

        useEffect(() => {
            setPayAmount(newInfo.rowBilling?.balance)
        }, [newInfo])







        useEffect(() => {
            console.log("billingToPrint", billingToPrint)
        }, [billingToPrint])



        return (
            <>
                <Modal isOpen={billingToPrint != null}
                    onClose={() => { handleOnClose() }}
                    bg='linear-gradient(111.84deg, rgba(6, 11, 38, 0.94) 59.3%, rgba(26, 31, 55, 0) 100%)'

                >
                    <ModalOverlay />
                    <ModalContent
                        bg='linear-gradient(111.84deg, rgba(6, 11, 38, 0.94) 59.3%, rgba(26, 31, 55, 0) 100%)'
                    >
                        <ModalHeader  ><Text color='#fff' fontSize='lg' fontWeight='bold'>{title + '  #'+ billingToPrint?.id} </Text></ModalHeader>
                        <ModalCloseButton />
                        <ModalBody mt={6}>
                            <Flex justify='space-between' w='100%' align='center' h='13%'>
                                <Flex maxW='100%' align='start' justify="space-between">
                                <a
                                        href={`${urls.BILLING.printbilling}/${window.btoa(billingToPrint?.id)}/${window.btoa("original")}`}
                                        style={{
                                            display: "inline-block",
                                            padding: "10px 20px",
                                            backgroundColor: "#007bff",
                                            color: "#fff",
                                            textDecoration: "none",
                                            border: "1px solid #007bff",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                            transition: "background-color 0.3s, color 0.3s",
                                        }}
                                    >
                                        <i className="fas fa-print"></i>
                                        {" "}Imprimir
                                    </a>
                                    {/* <a
                                        href={`${urls.BILLING.printbilling}/${window.btoa(billingToPrint?.id)}/${window.btoa("original")}`}
                                        style={{
                                            display: "inline-block",
                                            padding: "10px 20px",
                                            backgroundColor: "#007bff",
                                            color: "#fff",
                                            textDecoration: "none",
                                            border: "1px solid #007bff",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                            transition: "background-color 0.3s, color 0.3s",
                                        }}
                                    >
                                        <i className="fas fa-print"></i>
                                        {" "}Original
                                    </a>

                                    <a
                                        href={`${urls.BILLING.printbilling}/${window.btoa(billingToPrint?.id)}/${window.btoa("copy")}`}
                                        style={{
                                            display: "inline-block",
                                            padding: "10px 20px",
                                            marginLeft:"30px",
                                            backgroundColor: "#582CFF",
                                            color: "#fff",
                                            textDecoration: "none",
                                            border: "1px solid #582CFF",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                            transition: "background-color 0.3s, color 0.3s",
                                        }}
                                    >
                                        <i className="fas fa-print"></i>
                                        {" "}Copia
                                    </a> */}
                                </Flex>
                            </Flex>



                        </ModalBody>

                        <ModalFooter mt={8}>
                            <Flex justify='center' w='100%' align='center' h='13%'>
                                <Flex direction='column' maxW='100%' align='center'>
                                    <Button colorScheme='red' leftIcon={<HiArrowUturnLeft />} onClick={() => {
                                        setBillingToPrint(null);

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
