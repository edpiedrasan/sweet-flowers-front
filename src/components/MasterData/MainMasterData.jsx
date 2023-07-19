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


export default function MainMasterData() {
    const [fields, setFields] = useState([
        {
            title: "Clientes",
            subtitle: " Creación y modificación de clientes",
            id: "clients",
            image: "idea.png",
            colorCardSelected: "#d6d4fa",
            form: [

                {
                    colWidth: "6",
                    label: "Nombre Empresa*",
                    placeholder: "Ingrese el nombre",
                    id: "enterpriseName",
                    options: "",
                    type: "input",
                    dependsAnotherDropdown: false,
                    idDropdownDepends: "",
                    valueThatDepends: "",
                    disabled: false,
                    required: true
                },
                {
                    colWidth: "6",
                    label: "Cédula Jurídica",
                    placeholder: "Ingrese la cédula",
                    id: "enterpriseNumber",
                    options: "",
                    type: "number",
                    dependsAnotherDropdown: false,
                    idDropdownDepends: "",
                    valueThatDepends: "",
                    disabled: false,
                    required: false
                },

            ],
            modal: {
                title: "Crear cliente",
                fields: [

                    {
                        colWidth: "6",
                        label: "Nombre completo*",
                        placeholder: "Ingrese el nombre",
                        id: "nameRepresentativePartner",
                        options: "",
                        type: "input",
                        dependsAnotherDropdown: false,
                        idDropdownDepends: "",
                        valueThatDepends: "",
                        disabled: false,
                        required: true
                    },
                    {
                        colWidth: "6",
                        label: "Teléfono*",
                        placeholder: "Ingrese el teléfono",
                        id: "cellphone",
                        options: "",
                        type: "number",
                        dependsAnotherDropdown: false,
                        idDropdownDepends: "",
                        valueThatDepends: "",
                        disabled: false,
                        required: true
                    },
                    {
                        colWidth: "6",
                        label: "Cédula",
                        placeholder: "Ingrese la cédula",
                        id: "dni",
                        options: "dni",
                        type: "number",
                        dependsAnotherDropdown: false,
                        idDropdownDepends: "",
                        valueThatDepends: "",
                        disabled: false,
                        required: false
                    },

                ]
            },
            columnsTable: [
                { value: "nameRepresentativePartner", label: "Contacto", type: "text" },
                { value: "detail", label: "Detalle", type: "button" },
            ]

        },
        {
            title: "Variedades",
            subtitle: " Creación y modificación de variedades de plantas",
            id: "varietiesPlants",
            image: "variety.png",
            colorCardSelected: "#d6d4fa",
            form: [

                {
                    colWidth: "6",
                    label: "Nombre de la variedad*",
                    placeholder: "Ingrese el nombre",
                    id: "varietyName",
                    options: "",
                    type: "input",
                    dependsAnotherDropdown: false,
                    idDropdownDepends: "",
                    valueThatDepends: "",
                    disabled: false,
                    required: true
                },
                {
                    colWidth: "6",
                    label: "Planta*",
                    placeholder: "Ingrese la la planta",
                    id: "idPlant",
                    options: "plant",
                    type: "select",
                    dependsAnotherDropdown: false,
                    idDropdownDepends: "",
                    valueThatDepends: "",
                    disabled: false,
                    required: true
                },
                {
                    colWidth: "6",
                    label: "País de orígen",
                    placeholder: "Ingrese el país",
                    id: "originCountry",
                    options: "",
                    type: "input",
                    dependsAnotherDropdown: false,
                    idDropdownDepends: "",
                    valueThatDepends: "",
                    disabled: false,
                    required: false
                },

            ],
            modal: null,
            columnsTable: []

        },
        {
            title: "Productos",
            subtitle: " Creación y modificación de productos",
            id: "product",
            image: "rose3.png",
            colorCardSelected: "#d6d4fa",
            form: [

                {
                    colWidth: "6",
                    label: "Nombre del producto*",
                    placeholder: "Ingrese el nombre",
                    id: "nameProduct",
                    options: "",
                    type: "input",
                    dependsAnotherDropdown: false,
                    idDropdownDepends: "",
                    valueThatDepends: "",
                    disabled: false,
                    required: true
                },
                {
                    colWidth: "6",
                    label: "Cantidad de tallos*",
                    placeholder: "Ingrese las unidades",
                    id: "quantityStems",
                    options: "",
                    type: "input",
                    dependsAnotherDropdown: false,
                    idDropdownDepends: "",
                    valueThatDepends: "",
                    disabled: false,
                    required: true
                },
                {
                    colWidth: "6",
                    label: "Precio unitario*",
                    placeholder: "Ingrese el precio",
                    id: "unitaryPrice",
                    options: "",
                    type: "number",
                    dependsAnotherDropdown: false,
                    idDropdownDepends: "",
                    valueThatDepends: "",
                    disabled: false,
                    required: true
                },
                {
                    colWidth: "6",
                    label: "Variedad de Planta*",
                    placeholder: "Ingrese la variedad planta",
                    id: "idVarietyPlant",
                    options: "varietyplant",
                    type: "select",
                    dependsAnotherDropdown: false,
                    idDropdownDepends: "",
                    valueThatDepends: "",
                    disabled: false,
                    required: true
                },

            ],
            modal: null,
            columnsTable: []

        },

        // {
        //     title: "Materiales",
        //     subtitle: "Creación y modificación de Materiales en SAP",
        //     id: "materiales",
        //     image: "elearning.png",
        // },
        // {
        //     title: "Contratos - Ordenes de Servicio",
        //     subtitle: "Creación y modificación de Servicios en SAP",
        //     id: "servicios",
        //     image: "exam.png",
        // },
        // {
        //     title: "Repuestos",
        //     subtitle: "Creación y modificación de repuestos en SAP",
        //     id: "repuestos",
        //     image: "tool-box.png",
        // },

        // {
        //     title: "Proveedores",
        //     subtitle: "Creación de Proveedores",
        //     id: "proveedores",
        //     image: "teacher.png",
        //     form: [

        //         {
        //             colWidth: "6",
        //             label: "Nombre*",
        //             placeholder: "Seleccione la opción",
        //             id: "name",
        //             options: "",
        //             typeField: "text",
        //             dependsAnotherDropdown: false,
        //             idDropdownDepends: "",
        //             valueThatDepends: "",
        //             disabled: false,
        //             required: true
        //         },
        //         {
        //             colWidth: "6",
        //             label: "Cédula*",
        //             placeholder: "Seleccione la opción",
        //             id: "dni",
        //             options: "dni",
        //             typeField: "tel",
        //             dependsAnotherDropdown: false,
        //             idDropdownDepends: "",
        //             valueThatDepends: "",
        //             disabled: false,
        //             required: true
        //         },
        //         {
        //             colWidth: "6",
        //             label: "Puesto*",
        //             placeholder: "Seleccione la opción",
        //             id: "ocupation",
        //             options: "ocupation",
        //             typeField: "text",
        //             dependsAnotherDropdown: false,
        //             idDropdownDepends: "",
        //             valueThatDepends: "",
        //             disabled: false,
        //             required: true
        //         },

        //     ]
        // },
        // {
        //     title: "Contactos",
        //     subtitle: "Creación de contactos ",
        //     id: "contactos",
        //     image: "contacts.png",
        // },
        // {
        //     title: "Materiales de Servicios (PS)",
        //     subtitle: "Creación y modificación de Materiales de Terceros (LEIS) en SAP",
        //     id: "materialesservicio",
        //     image: "solar-panel.png",
        // },
        // {
        //     title: "Productos",
        //     subtitle: " Creación y modificación de Productos",
        //     id: "equipos",
        //     image: "data-storage.png",
        //     form: [

        //         {
        //             colWidth: "6",
        //             label: "Nombre*",
        //             placeholder: "Seleccione la opción",
        //             id: "name",
        //             options: "",
        //             type: "input",
        //             dependsAnotherDropdown: false,
        //             idDropdownDepends: "",
        //             valueThatDepends: "",
        //             disabled: false,
        //             required: true
        //         },
        //         {
        //             colWidth: "6",
        //             label: "Cédula*",
        //             placeholder: "Seleccione la opción",
        //             id: "dni",
        //             options: "dni",
        //             type: "number",
        //             dependsAnotherDropdown: false,
        //             idDropdownDepends: "",
        //             valueThatDepends: "",
        //             disabled: false,
        //             required: true
        //         },
        //         {
        //             colWidth: "6",
        //             label: "Puesto*",
        //             placeholder: "Seleccione la opción",
        //             id: "ocupation",
        //             options: "ocupation",
        //             type: "input",
        //             dependsAnotherDropdown: false,
        //             idDropdownDepends: "",
        //             valueThatDepends: "",
        //             disabled: false,
        //             required: true
        //         },

        //     ]
        // },
        // {
        //     title: "Garantías",
        //     subtitle: "Modificación de Garantías en SAP",
        //     id: "garantias",
        //     image: "warranty.png",
        // },
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
        }, [formActive])


    useEffect(() => {
        // console.log(options)
    }, [options])






    return (

        <UserContext.Provider value={
            {options}
        }>

            <Flex flexDirection='column' pt={{ base: '120px', md: '75px' }}>
                <Grid templateColumns={{ sm: "1fr", lg: "100% 38%" }}>
                    {/* Cards Master Data */}


                    <Card my={{ lg: "24px" }} me={{ lg: "24px" }} >
                        {formActive == "" ?
                            <>

                                <Flex direction='column'>
                                    <CardHeader py='12px'>
                                        <Text color='#fff' fontSize='lg' fontWeight='bold'>
                                            Datos Maestros de la Compañía
                                        </Text>
                                    </CardHeader>
                                </Flex>
                                {/* {billingData.map((row) => { */}
                                {/* return ( */}
                                <SimpleGrid columns={{ sm: 1, md: 2, xl: 4 }} spacing='24px'>
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
                            />
                        }
                    </Card>

                </Grid>
            </Flex>

        </UserContext.Provider>

    );
}
