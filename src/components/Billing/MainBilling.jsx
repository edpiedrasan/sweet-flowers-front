/*!

=========================================================
* Vision UI Free Chakra - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-chakra
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-chakra/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// Chakra imports
import {
    Box,
    Button,
    CircularProgress,
    CircularProgressLabel,
    Flex,
    Grid,
    GridItem,
    Icon,
    Progress,
    SimpleGrid,
    Spacer,
    Stack,
    Stat,
    StatHelpText,
    StatLabel,
    StatNumber,
    Table,
    Tbody,
    Text,
    Th,
    Thead,
    Tr,

} from '@chakra-ui/react';
// Styles for the circular progressbar
import medusa from 'assets/img/cardimgfree.png';
// Custom components
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import CardHeader from 'components/Card/CardHeader.js';
import BarChart from 'components/Charts/BarChart';
import LineChart from 'components/Charts/LineChart';
import IconBox from 'components/Icons/IconBox';

import { Col, Form, Row } from "reactstrap";

// Icons
import { CartIcon, DocumentIcon, GlobeIcon, RocketIcon, StatsIcon, WalletIcon } from 'components/Icons/Icons.js';
import DashboardTableRow from 'components/Tables/DashboardTableRow';
import TimelineRow from 'components/Tables/TimelineRow';
import React, { useState, useEffect } from 'react';
import { AiFillCheckCircle } from 'react-icons/ai';
import { BiHappy } from 'react-icons/bi';
import { BsArrowRight } from 'react-icons/bs';
import { IoCheckmarkDoneCircleSharp, IoEllipsisHorizontal } from 'react-icons/io5';
// Data
import {
    barChartDataDashboard,
    barChartOptionsDashboard,
    lineChartDataDashboard,
    lineChartOptionsDashboard
} from 'variables/charts';
import { dashboardTableData, timelineData } from 'variables/general';
import { CardMain } from './SharedComponents/CardMain';
import { ManageRequest } from './SharedComponents/ManageRequest';

//Ruta para crear nuevo dato maestro
import { getOptions } from 'actions/masterdata';

//Import de componente contexto, para establecer variables globales
import { UserContext } from 'helpers/UserContext';
import StockCard from './SharedComponents/StockCard';


export default function MainBilling() {
    const [fields, setFields] = useState([
        {
            title: "Orden de compra",
            subtitle: "Crear orden de compra de productos",
            id: "purchaseOrder",
            image: "billing4.png",
            colorCardSelected: "#d6d4fa",
            buttonName: "Crear orden de compra",
            textTotalTable: "Total a pagar:",

            form: [

                {
                    colWidth: "6",
                    label: "Cliente*",
                    placeholder: "Ingrese la empresa",
                    id: "enterpriseclient",
                    options: "enterpriseclient",
                    type: "select",
                    dependsAnotherDropdown: false,
                    idDropdownDepends: "",
                    valueThatDepends: "",

                    optionsDependsAnotherDropdown: '',


                    disabled: false,
                    required: true
                },
                // {
                //     colWidth: "6",
                //     label: "Contacto",
                //     placeholder: "Ingrese la persona",
                //     id: "partnerenterprisecontact",
                //     options: "partnerenterprisecontact",
                //     type: "select",
                //     dependsAnotherDropdown: false,
                //     idDropdownDepends: "",
                //     valueThatDepends: "",

                //     optionsDependsAnotherDropdown: 'enterpriseclient',

                //     disabled: false,
                //     required: false
                // },

            ],
            modal: null,
            columnsTable: [
                { value: "actions", label: "", type: "button", editable: false },
                { value: "idBilling", label: "# Factura", type: "number", editable: false },
                { value: "enterpriseName", label: "Cliente", type: "input", editable: false },
                { value: "quantity", label: "Total", type: "input", editable: false, formatNumber: true },
                { value: "balance", label: "Saldo pendiente", type: "input", editable: false, formatNumber: true },
                { value: "wayPayment", label: "Tipo de pago", type: "badge", editable: false, applyBadge: true, formatNumber: true },
                { value: "expirationState", label: "Estado", type: "badge", editable: false, applyBadge: true },
                { value: "createdAt", label: "Fecha", type: "date", editable: false },
            
            
            
            
            ]

        },
        {
            title: "Facturar",
            subtitle: "Facturar ordenes de compra",
            id: "billing",
            image: "billing5.png",
            colorCardSelected: "#d6d4fa",
            buttonName: "Crear Factura",
            textTotalTable: "Total a pagar: ",
            form: [

                {
                    colWidth: "6",
                    label: "Seleccionar orden de compra*",
                    placeholder: "Ingrese la orden",
                    id: "purchaseorder",
                    options: "purchaseorderbuild",
                    type: "select",
                    dependsAnotherDropdown: false,
                    idDropdownDepends: "",
                    valueThatDepends: "",

                    optionsDependsAnotherDropdown: '',


                    disabled: false,
                    required: true
                },

                {
                    colWidth: "6",
                    label: "Contacto*",
                    placeholder: "Ingrese la persona",
                    id: "partnerenterprisecontact",
                    options: "partnerenterprisecontact",
                    type: "select",
                    dependsAnotherDropdown: false,
                    idDropdownDepends: "",
                    valueThatDepends: "",

                    optionsDependsAnotherDropdown: 'enterpriseclient',
                    idFieldThatDepends: 'client',

                    disabled: false,
                    required: true
                },

                {
                    colWidth: "6",
                    label: "Seleccione el método de pago*",
                    placeholder: "Ingrese el método de pago",
                    id: "paymentclientway",
                    options: "paymentclientway",
                    type: "select",
                    dependsAnotherDropdown: false,
                    idDropdownDepends: "",
                    valueThatDepends: "",

                    optionsDependsAnotherDropdown: '',


                    disabled: false,
                    required: true
                },

                {
                    colWidth: "6",
                    label: "Adelanto de pago",
                    placeholder: "Ingrese la cantidad",
                    id: "advancePayment",
                    options: "paymentclientway",
                    type: "number",
                    dependsAnotherDropdown: true,
                    idDropdownDepends: "paymentclientway",
                    valueThatDepends: "Credito",

                    optionsDependsAnotherDropdown: '',
                    idFieldThatDepends: '',


                    disabled: false,
                    required: false
                },



            ],
            modal: null,
            columnsTable: [
                { value: "quantity", label: "Cantidad", type: "number", editable: true },
                { value: "product", label: "Producto", type: "select", editable: true },
                { value: "unitaryPrice", label: "Precio Unitario", type: "number", editable: false },
                { value: "totaly", label: "Total", type: "number", editable: false },
                { value: "actions", label: "", type: "button", editable: false },



                // { value: "detail", label: "Detalle", type: "button" },
            ]

        },
        {
            title: "Orden de Eliminar",
            subtitle: "Crear orden para eliminar productos",
            id: "deleteOrder",
            image: "delete.png",
            colorCardSelected: "#d6d4fa",
            buttonName: "Crear orden de eliminación",
            iconName: "Crear orden de eliminación",
            textTotalTable: "Total a eliminar:",

            form: [



            ],
            modal: null,
            columnsTable: [
                { value: "quantity", label: "Cantidad", type: "number", editable: true },
                { value: "product", label: "Producto", type: "select", editable: true },
                { value: "unitaryPrice", label: "Precio Unitario", type: "number", editable: false },
                { value: "totaly", label: "Total", type: "number", editable: false },
                { value: "actions", label: "", type: "button", editable: false },



                // { value: "detail", label: "Detalle", type: "button" },
            ]

        },
        {
            title: "Manejo de Facturas",
            subtitle: "Revisar facturas pendientes y canceladas",
            id: "manageBilling",
            image: "billingManagement.png",
            colorCardSelected: "#d6d4fa",
            buttonName: "",
            iconName: "Crear orden de eliminación",
            textTotalTable: "Total a eliminar:",

            form: [



            ],
            modal: {
                title: "Registro de pago",
                fields: [

                    {
                        colWidth: "6",
                        label: "Cantidad a pagar*",
                        placeholder: "Ingrese la cantidad",
                        id: "quantityToPayment",
                        options: "",
                        type: "number",
                        dependsAnotherDropdown: false,
                        idDropdownDepends: "",
                        valueThatDepends: "",
                        disabled: false,
                        required: true
                    },

                ]
            },
            columnsTable: [
                { value: "actions", label: "", type: "button", editable: false },
                { value: "idBilling", label: "# Factura", type: "number", editable: false },
                { value: "enterpriseName", label: "Cliente", type: "input", editable: false },
                { value: "quantity", label: "Total", type: "input", editable: false, formatNumber:true },
                { value: "balance", label: "Saldo pendiente", type: "input", editable: false,  formatNumber:true},
                { value: "wayPayment", label: "Tipo de pago", type: "badge", editable: false, applyBadge:true,  formatNumber:true},
                { value: "expirationState", label: "Estado", type: "badge", editable: false, applyBadge: true },
                { value: "createdAt", label: "Fecha", type: "date", editable: false },




            ]

        },
    ]);

    const [formActive, setFormActive] = useState("")

    //State para guardar las opciones 
    const [options, setOptions] = useState({})



    //Efecto para cargar las opciiones cuando arranque
    useEffect(() => {

        getOptions().then((res) => {
            // console.log(res.isAxiosError)
            if (res.isAxiosError) {
                console.log("Fallo de cargar las opciones", res)


            } else {
                setOptions(res.data.payload.masterData)
            }

        })
    }, [])


    useEffect(() => {
        // console.log(options)
    }, [options])


    const [refreshOptions, setRefreshOptions] = useState(false);


    //Efecto para cargar las opciones cuando arranque
    useEffect(() => {

        if (refreshOptions == true) {
            setRefreshOptions(false);


            console.log('Trayendo options', options)
            // console.log(options);

            setOptions([])

            getOptions().then((res) => {
                // console.log(res.isAxiosError)
                if (res.isAxiosError) {
                    console.log("Fallo de cargar las opciones", res)


                } else {
                    setOptions(res.data.payload.masterData)
                }

            })

        }
    }, [refreshOptions])

//Para refrescar las facturas
    const [refreshBilling, setRefreshBilling] = useState(false);

    return (

        <UserContext.Provider value={
            { options, setOptions, refreshOptions, setRefreshOptions , refreshBilling, setRefreshBilling}
        }>

            <Flex flexDirection='column' pt={{ base: '120px', md: '55px' }}>
                <Grid templateColumns={{ sm: '1fr', md: '1fr 1fr', lg: '3fr 1fr' }} gap='14px'>
                    {/* Cards Master Data */}


                    <Card p='16px' overflowX={{ sm: 'scroll', xl: 'hidden' }}>
                        {formActive == "" ?
                            <>

                                <Flex direction='column'>
                                    <CardHeader py='1px'>
                                        <Text color='#fff' fontSize='lg' fontWeight='bold'>
                                            Facturación de la compañía
                                        </Text>
                                    </CardHeader>
                                </Flex>
                                {/* {billingData.map((row) => { */}
                                {/* return ( */}
                                <SimpleGrid columns={{ sm: 1, md: 3, xl: 3 }} spacing='44px'>
                                    {/* <Flex direction='column' w='25%' alignItems='baseline'> */}

                                    {fields.map((field) => {
                                        return (

                                            <CardBody w='250px'>

                                                <CardMain
                                                    field={field}
                                                    setFormActive={setFormActive}
                                                />

                                            </CardBody>
                                        )
                                    })}
                                    {/* </Flex> */}

                                </SimpleGrid>
                                {/* ); */}
                            </>
                            :
                            <ManageRequest
                                formActive={formActive}
                                setFormActive={setFormActive}
                                setRefreshOptions={setRefreshOptions}
                            />
                        }
                    </Card>

                    <StockCard />

                </Grid>
            </Flex>

        </UserContext.Provider>

    );
}
