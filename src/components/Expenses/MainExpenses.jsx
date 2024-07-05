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
// import { ManageRequest } from './SharedComponents/ManageRequest';

//Ruta para crear nuevo dato maestro
import { getOptions } from 'actions/masterdata';

//Import de componente contexto, para establecer variables globales
import { UserContext } from 'helpers/UserContext';
import { ManageRequest } from './SharedComponents/ManageRequest';


export default function MainExpenses() {
    const [fields, setFields] = useState([
        {
            title: "Gastos",
            subtitle: " Registro de gastos de la compañía",
            image: "expenses2.png",
            colorCardSelected: "#d6d4fa",
            form: [



            ],
            modal: null,
            columnsTable: [
                { value: "provider", label: "Proveedor", type: "select", editable: true },
                { value: "amount", label: "Monto", type: "number", editable: true },
                { value: "billingNumber", label: "Número de factura", type: "text", editable: true },
                { value: "billingDate", label: "Fecha", type: "date", editable: true },
                { value: "actions", label: "", type: "button", editable: false },
            ]

        },

    ]);

    const [formActive, setFormActive] = useState("")

    //State para guardar las opciones 
    const [options, setOptions] = useState({})

    const [refreshOptions, setRefreshOptions] = useState(false)




    //Efecto para cargar las opciiones cuando arranque
    useEffect(() => {

        // getOptions().then((res) => {
        //     // console.log(res.isAxiosError)
        //     if (res.isAxiosError) {
        //         console.log("Fallo de cargar las opciones", res)


        //     } else {
        //         setOptions(res.data.payload.masterData)
        //     }

        // })
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
            { options }
        }>


            {/* Cards Master Data */}


            {formActive == "" ?
                <>
                    <Flex flexDirection='column' pt={{ base: '120px', md: '75px' }}>
                        <Grid templateColumns={{ sm: "1fr", lg: "100% 38%" }}>
                            <Card my={{ lg: "24px" }} me={{ lg: "24px" }} >

                                <Flex direction='column'>
                                    <CardHeader py='12px'>
                                        <Text color='#fff' fontSize='lg' fontWeight='bold'>
                                            Gastos de la Compañía
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
                            </Card>
                        </Grid>
                    </Flex>

                </>
                :
                // <ManageRequest
                //     formActive={formActive}
                //     setFormActive={setFormActive}
                // />
                <ManageRequest
                    formActive={formActive}
                    setFormActive={setFormActive}
                    setRefreshOptions={setRefreshOptions}
                />
            }




        </UserContext.Provider>

    );
}
