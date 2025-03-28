// react library
import React, { useContext } from "react";

//Ruta para crear nuevo dato maestro
import { newMasterData } from 'actions/masterdata';

import { newPurchaseOrder, newBilling, newDeleteOrder, printBilling } from 'actions/billing';
//Ruta para crear nuevo dato maestro
import { getOptions } from 'actions/masterdata';


import { getUserPerson } from 'helpers/decodeToken';


//Import de componente contexto, para establecer variables globales
import { UserContext } from 'helpers/UserContext';

import { urlBase } from "api/urls.jsx"

import urls from "api/urls.jsx"



import {
    PaginationItem,
    PaginationLink,
    Pagination,
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
import {
    Box, Link, Button, Flex, Icon, Text, Tabs, TabList, TabPanels, Tab, TabPanel, ButtonGroup, Input,

    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,

    Stack,


    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,

    Table,
    Thead,
    Tr,
    Td,
    Th,
    Tbody,

    Progress,

    useToast




} from "@chakra-ui/react";



import { FaEllipsisV, FaTrafficLight } from "react-icons/fa";


import IconBox from 'components/Icons/IconBox';

import { CartIcon, DocumentIcon, GlobeIcon, RocketIcon, StatsIcon, WalletIcon, FulgerIcon, CreditIcon, IconEdit, } from 'components/Icons/Icons.js';

import { FaUser } from "react-icons/fa";

import { HiArrowUturnLeft } from "react-icons/hi2";
import { UseForm } from "./UseForm";
import { useState } from "react";

import { BsClipboardPlusFill, BsFillSendPlusFill, BsFillSendFill } from "react-icons/bs";
import { UseModal } from "./UseModal";
import { useEffect } from "react";
import { UseTable } from "./UseTable";
import { UseTableCustomBilling } from "./UseTableCustomBilling";

import html2canvas from 'html2canvas';

import jsPDF from 'jspdf';

const { createCanvas, loadImage } = require('canvas');
// const fs = require('fs');






import { Br, Cut, Line, Printer, render, Row } from 'react-thermal-printer';
import { ModalPrintBilling } from "./ModalPrintBilling";
import { ModalBillingDetail } from "./ModalBillingDetail";

import withReactContent from 'sweetalert2-react-content';
import Swal from "sweetalert2";

export const ManageRequest = React.memo(
    ({

        formActive,
        id,
        setFormActive, setRefreshOptions }) => {

        //Notificaciones
        const MySwal = withReactContent(Swal);

        //states globales
        const { options, setOptions, refreshOptions } = useContext(UserContext);


        //Se almacena la nueva información 
        const [newInfo, setNewInfo] = useState({ modalItems: [] });

        //Aparezca o no el modal
        const [modalVisible, setModalVisible] = useState(false)

        //Si se le da editar precargar esa información
        const [preChargeInfoModal, setPreChargeInfoModal] = useState([])

        //Indicarle al useForm que valide los campos
        const [validateFormNow, setValidateFormNow] = useState(false);


        //Declarar el Toast de notificaciones
        const toast = useToast()

        useEffect(() => {
            if (formActive.id == 'billing'
                // && newInfo?.modalItems.length==0 
                && newInfo?.purchaseorder != undefined
                && newInfo?.purchaseorder?.label != ''
            ) {
                // debugger;

                let itemPurchaseOrder = options?.itempurchaseorder?.filter(option => option.idPurchaseOrder == newInfo.purchaseorder.value)

                let buildArray = [];


                itemPurchaseOrder.map(itemPO => {

                    buildArray = [
                        ...buildArray,
                        {
                            product: { value: itemPO.value, label: itemPO.label },
                            quantity: itemPO.quantity,
                            totaly: itemPO.quantity * itemPO.unitaryPrice,
                            unitaryPrice: itemPO.unitaryPrice
                        }
                    ]

                })

                setNewInfo({
                    ...newInfo,
                    ['modalItems']: [
                        ...buildArray
                    ]
                })

            } else {
                if (newInfo?.modalItems.length > 0) {

                    setNewInfo({
                        ...newInfo,
                        ['modalItems']: []
                    })
                }
            }
        }, [newInfo?.purchaseorder?.label])




        useEffect(() => {
            // console.log("newInfo", newInfo)
        }, [newInfo])


        //eliminar un item de la liste de modales
        const handleOnDeleteModalItem = (modalItem) => {
            console.log(modalItem)
            let modalItems = newInfo.modalItems.filter(modalItemA => modalItem != modalItemA)
            console.log(modalItems)
            setNewInfo({
                ...newInfo,
                ['modalItems']: [
                    ...modalItems
                ]
            })

        }





        useEffect(() => {
            // console.log("AQUI", preChargeInfoModal);
        }, [preChargeInfoModal])


        //Establece cual está activo si crear(0) o modificar (1)
        const [tabActive, setTabActive] = useState(0)

        const handleCleanForm = () => {
            setNewInfo({ modalItems: [] })
            setValidateFormNow(false);
            setPreChargeInfoModal([]);

        }

        const getTotal = () => {
            let total = 0;

            newInfo.modalItems.map(e => {
                total += parseInt(e.totaly);
            })

            return `₡${total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        }



        //Handle para enviar la gestión
        const handleSendForm = () => {
            if (validateForm()) {

                MySwal.fire({

                    type: 'warning',
                    title: `Crear`,
                    html:

                        `<h2>¿Está seguro que desea crearlo?</h2>`,

                    confirmButtonText: 'Si, crear',
                    confirmButtonColor: '#0ABF67',
                    cancelButtonText: 'No, cancelar',
                    showCancelButton: true,

                    preConfirm: () => {

                        setIsLoading(true);


                        if (formActive.id == 'purchaseOrder') {


                            newPurchaseOrder({ newInfo: newInfo, form: formActive.id, total: getTotal(), user: getUserPerson() }).then((res) => {
                                // console.log(res)
                                // console.log(res.isAxiosError)
                                setIsLoading(false);

                                if (res.isAxiosError) {
                                    // console.log("login failed")
                                    toast({
                                        title: 'Atención',
                                        description: `Ocurrió un error en la solicitud!`,
                                        status: 'warning',
                                        duration: 4000,
                                        isClosable: true,
                                    })

                                } else {
                                    toast({
                                        title: 'Atención',
                                        description: `Creado con éxito!`,
                                        status: 'success',
                                        duration: 4000,
                                        isClosable: true,
                                    })

                                    handleCleanForm()
                                    setRefreshOptions(true);



                                }

                            })
                        } else if (formActive.id == 'billing') {

                            newBilling({ newInfo: newInfo, form: formActive.id, total: getTotal(), user: getUserPerson() }).then((res) => {
                                // console.log(res)
                                // console.log(res.isAxiosError)
                                setIsLoading(false);

                                if (res.isAxiosError) {
                                    // console.log("login failed")
                                    toast({
                                        title: 'Atención',
                                        description: `Ocurrió un error en la solicitud!`,
                                        status: 'warning',
                                        duration: 4000,
                                        isClosable: true,
                                    })

                                } else {
                                    console.log("res", res)
                                    toast({
                                        title: 'Atención',
                                        description: `Factura #${res.data.payload.billing.insertId} creada con éxito!`,
                                        status: 'success',
                                        duration: 4000,
                                        isClosable: true,
                                    })
                                    setBillingToPrint({ id: res.data.payload.billing.insertId });

                                    handleCleanForm()
                                    setRefreshOptions(true);



                                }

                            })
                        } else if (formActive.id == 'deleteOrder') {

                            newDeleteOrder({ newInfo: newInfo, form: formActive.id, total: getTotal(), user: getUserPerson() }).then((res) => {
                                // console.log(res)
                                // console.log(res.isAxiosError)
                                setIsLoading(false);

                                if (res.isAxiosError) {
                                    // console.log("login failed")
                                    toast({
                                        title: 'Atención',
                                        description: `Ocurrió un error en la solicitud!`,
                                        status: 'warning',
                                        duration: 4000,
                                        isClosable: true,
                                    })

                                } else {
                                    toast({
                                        title: 'Atención',
                                        description: `Creado con éxito!`,
                                        status: 'success',
                                        duration: 4000,
                                        isClosable: true,
                                    })

                                    handleCleanForm()
                                    setRefreshOptions(true);



                                }

                            })
                        }
                    },

                })

            }






            // }

            console.log(formActive.id)
        }


        const validateForm = () => {
            // debugger;
            setValidateFormNow(true)
            let fieldsVoids = formActive.form
                // .filter(field => !Array.isArray(field)) //Eliminar el modalItems
                .filter(field => field.required == true)
                .filter(field => {
                    if (newInfo[field.id] == '' || newInfo[field.id] == undefined) {
                        return field
                    }
                })

            if (fieldsVoids.length > 0) {
                toast({
                    title: 'Atención',
                    description: `Existen ${fieldsVoids.length} campos obligatorios vacíos.`,
                    status: 'warning',
                    duration: 4000,
                    isClosable: true,
                })
                return false;
            }

            // debugger;
            if ((newInfo.modalItems.length == 0 || newInfo.modalItems.length == undefined)) {
                toast({
                    title: 'Atención',
                    description: `Debe agregar al menos un producto!`,
                    status: 'warning',
                    duration: 4000,
                    isClosable: true,
                })
                return false;
            }

            if (getTotal() == 0) {
                toast({
                    title: 'Atención',
                    description: `El total de la factura no puede ser 0`,
                    status: 'warning',
                    duration: 4000,
                    isClosable: true,
                })
                return false;
            }

            return true;




        }

        console.log(formActive)

        const [billingToPrint, setBillingToPrint] = useState(null)

        useEffect(() => {
            console.log("billingToPrint", billingToPrint)
        }, [billingToPrint])

        const [billingDetail, setBillingDetail] = useState(null)

        const [isLoading, setIsLoading] = useState(false)
        return (
            <>
                {<ModalPrintBilling
                    title={"Impresión de Factura"}
                    visible={true}
                    setVisible={null}
                    newInfo={{}}
                    billingToPrint={billingToPrint}
                    setBillingToPrint={setBillingToPrint}
                />}

                {<ModalBillingDetail
                    title={"Detalle de Factura"}
                    visible={true}
                    setVisible={null}
                    newInfo={{}}
                    billingDetail={billingDetail}
                    setBillingDetail={setBillingDetail}
                />}

                {formActive.modal != null &&
                    <UseModal
                        title={formActive.modal.title}
                        fields={formActive.modal.fields}
                        visible={modalVisible}
                        setVisible={setModalVisible}
                        newInfo={newInfo}
                        setNewInfo={setNewInfo}
                        preChargeInfoModal={preChargeInfoModal}
                        setPreChargeInfoModal={setPreChargeInfoModal}
                        setRefreshOptions={setRefreshOptions}
                    />
                }
                <Flex justify='space-between' w='100%' align='center' h='13%'>
                    <Flex direction='column' maxW='60%' align='center'>

                        <Text color='#fff' fontSize='lg' fontWeight='bold'>
                            Gestión de {formActive.title}
                        </Text>
                    </Flex>


                    <Flex direction='column' maxW='40%' align='center'>


                        <Button leftIcon={<HiArrowUturnLeft />}
                            variant='brand'
                            fontSize='15px'
                            type='submit'
                            w='100%'
                            maxW='350px'
                            h='45'
                            mb='20px'
                            mt='20px'
                            //   colorScheme='red'
                            onClick={() => setFormActive("")}
                        >
                            Volver
                        </Button>
                    </Flex>

                </Flex>

                <Box
                    p='0px'
                    // bg='linear-gradient(127.09deg, rgba(24, 29, 60, 0.94) 19.41%, rgba(10, 14, 35, 0.49) 76.65%)'
                    my='px'
                    borderRadius='10px'
                >

                    <Flex justify='space-between' w='100%' align='center'>
                        <Flex direction='column' maxW='100%' align='flex-center'>

                            {formActive.id == 'billing' ?
                                <>
                                    <UseForm
                                        columns={2}
                                        fields={formActive.form}
                                        newInfo={newInfo}
                                        setNewInfo={setNewInfo}
                                        validateFormNow={validateFormNow}
                                    />
                                    <UseTable
                                        edit={false}
                                        columns={formActive.columnsTable}
                                        newInfo={newInfo}
                                        setNewInfo={setNewInfo}
                                        validateFormNow={validateFormNow}
                                    />
                                </>
                                : formActive.id == 'manageBilling' ?
                                    <>
                                        <UseTableCustomBilling
                                            edit={true}
                                            columns={formActive.columnsTable}
                                            newInfo={newInfo}
                                            setNewInfo={setNewInfo}
                                            validateFormNow={validateFormNow}
                                            setModalVisible={setModalVisible}
                                            setRefreshOptions={setRefreshOptions}
                                            setBillingToPrint={setBillingToPrint}
                                            setBillingDetail={setBillingDetail}

                                        />
                                    </>
                                    :
                                    <>
                                        <UseForm
                                            columns={2}
                                            fields={formActive.form}
                                            newInfo={newInfo}
                                            setNewInfo={setNewInfo}
                                            validateFormNow={validateFormNow}
                                        />
                                        <UseTable
                                            edit={true}
                                            columns={formActive.columnsTable}
                                            newInfo={newInfo}
                                            setNewInfo={setNewInfo}
                                            validateFormNow={validateFormNow}
                                        />
                                    </>

                            }
                            {formActive.buttonName != "" &&
                                <Flex justify='space-between' w='100%' align='center' h='13%'>

                                    <Flex direction='column' maxW='50%' align='center'>

                                        <Button colorScheme='green' ml={350}
                                            leftIcon={<BsFillSendFill />}

                                            // onClick={onClose}
                                            // onClick={setModalVisible(false)}
                                            isLoading={isLoading}
                                            onClick={() => {
                                                handleSendForm();
                                            }}

                                        >
                                            {formActive.buttonName}
                                        </Button>

                                        {/* <Button colorScheme='green' ml={600}
                                        leftIcon={<BsFillSendFill />}

                                        // onClick={onClose}
                                        // onClick={setModalVisible(false)}
                                        onClick={() => {
                                            handleSendForm();
                                        }}

                                    >
                                        Crear Factura
                                    </Button> */}
                                    </Flex>


                                </Flex>}
                        </Flex>
                    </Flex>
                </Box>
            </>
        );
    }
);
