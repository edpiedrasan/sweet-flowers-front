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
    useColorModeValue,
    useToast

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

import TimelineRow from 'components/Tables/TimelineRow';


import { Col, Form, Row } from "reactstrap";

// Icons
import { CartIcon, DocumentIcon, GlobeIcon, RocketIcon, StatsIcon, WalletIcon } from 'components/Icons/Icons.js';

import React, { useState, useEffect, useContext } from 'react';
import { AiFillCheckCircle } from 'react-icons/ai';
import { BiHappy } from 'react-icons/bi';
import { BsArrowRight } from 'react-icons/bs';
import { IoCheckmarkDoneCircleSharp, IoEllipsisHorizontal } from 'react-icons/io5';
import { SiDropbox } from "react-icons/si";

// Data
import {
    barChartDataDashboard,
    barChartOptionsDashboard,
    lineChartDataDashboard,
    lineChartOptionsDashboard
} from 'variables/charts';
import { dashboardTableData, timelineData } from 'variables/general';

import { toDeleteOrder } from 'actions/billing';


//Ruta para crear nuevo dato maestro
import { getOptions } from 'actions/masterdata';

//Import de componente contexto, para establecer variables globales
import { UserContext } from 'helpers/UserContext';

import {
    FaArrowDown,
    FaArrowUp,
    FaBell,
    FaCreditCard,
    FaFilePdf,
    FaHtml5,
    FaShoppingCart,

} from "react-icons/fa";
import { CreditIcon } from 'components/Icons/Icons';
import { DeleteIcon, EditIco, ViewIcon } from '@chakra-ui/icons';


export default function StockCard() {






    //states globales
    const { options, refreshOptions, setRefreshOptions } = useContext(UserContext);

    useEffect(() => {
        // console.log(options?.product)
        // console.log(options?.purchaseorder)

    }, [options])

    const getQuantity = (type) => {

        if (type == "purchaseOrder") {
            let quantity = 0;

            options?.purchaseorder?.map(purchaseorder => {
                quantity += parseInt(purchaseorder.quantity)
            })

            return quantity
        } else {
            let quantity = 0;

            options?.product?.map(product => {
                quantity += product.stock
            })

            return quantity
        }

    }


    const bgIconColor = useColorModeValue("white.300", "gray.700");

    //Declarar el Toast de notificaciones
    const toast = useToast()

    const numberWithCommas = (number) => {

        return `₡${number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    }

    const handleDeletePO = (po) => {
        console.log("Eliminar ", po)

        toDeleteOrder({ poId: po.value }).then((res) => {
            // console.log(res)
            // console.log(res.isAxiosError)
            if (res.isAxiosError) {
                // console.log("login failed")
                toast({
                    title: 'Atención',
                    description: `Ocurrió un error en la eliminación!`,
                    status: 'warning',
                    duration: 3000,
                    isClosable: true,
                })

            } else {
                toast({
                    title: 'Atención',
                    description: `Eliminado con éxito!`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })

                setRefreshOptions(true);



            }

        })

    }


    return (

        <>

            <Card>
                <CardHeader mb='22px'>
                    <Flex direction='column'>
                        <Text fontSize='lg' color='#fff' fontWeight='bold' mb='6px'>
                            Inventario de Productos
                        </Text>
                        <Flex align='center'>
                            <Icon as={AiFillCheckCircle} color='green.500' w='15px' h='15px' me='5px' />
                            <Text fontSize='sm' color='gray.400' fontWeight='normal'>
                                <Text fontWeight='bold' as='span' color='gray.400'>
                                    {getQuantity()} paquetes
                                </Text>{' '}
                                en bodega
                            </Text>
                        </Flex>
                    </Flex>
                </CardHeader>
                <CardBody>
                    <Flex direction='column' lineHeight='18px'>
                        {/* {timelineData.map((row, index, arr) => {
                        return (
                            <TimelineRow
                                logo={row.logo}
                                title={row.title}
                                date={row.date}
                                color={row.color}
                                index={index}
                                arrLength={arr.length}
                            />
                        );
                    })} */}

                        {/* <TimelineRow
                        logo={'FaShoppingCart'}
                        title={'Hola mundo'}
                        date={''}
                        color={'blue.400'}
                        index={'1'}
                        arrLength={'2'}
                    /> */}
                        {/* <Text fontWeight='bold' as='span' color='gray.400'>
                        Hola mundo
                    </Text>{' '} */}

                        {options?.product?.map(product => (
                            < Flex alignItems='center' minH='48px' justifyContent='start' mb='2px'>
                                <Flex direction='column' h='100%' align='center'>
                                    <Icon
                                        as={SiDropbox}
                                        bg={bgIconColor}
                                        color={'purple'}
                                        h={"20px"}
                                        w={"20px"}
                                        me='16px'
                                        right={document.documentElement.dir === "rtl" ? "-8px" : ""}
                                        left={document.documentElement.dir === "rtl" ? "" : "-8px"}
                                    />
                                </Flex>
                                <Flex direction='column' justifyContent='flex-start' h='100%'>
                                    <Text fontSize='sm' color='#fff' fontWeight='normal' mb='3px'>
                                        {product.label}
                                    </Text>
                                    <Text fontSize='sm' color='gray.400' fontWeight='normal'>
                                        {product.stock} paquetes                           </Text>
                                </Flex>
                            </Flex>
                        )
                        )


                        }
                    </Flex>
                </CardBody>




                <CardHeader mb='22px'>
                    <Flex direction='column'>
                        <Text fontSize='lg' color='#fff' fontWeight='bold' mb='6px'>
                            Ordenes de Compra
                        </Text>
                        <Flex align='center'>
                            <Icon as={AiFillCheckCircle} color='green.500' w='15px' h='15px' me='5px' />
                            <Text fontSize='sm' color='gray.400' fontWeight='normal'>
                                <Text fontWeight='bold' as='span' color='gray.400'>
                                    {numberWithCommas (getQuantity("purchaseOrder"))}
                                </Text>{' '}
                                a facturar
                            </Text>
                        </Flex>
                    </Flex>
                </CardHeader>
                <CardBody>
                    <Flex direction='column' lineHeight='18px'>
                        {/* {timelineData.map((row, index, arr) => {
                        return (
                            <TimelineRow
                                logo={row.logo}
                                title={row.title}
                                date={row.date}
                                color={row.color}
                                index={index}
                                arrLength={arr.length}
                            />
                        );
                    })} */}

                        {/* <TimelineRow
                        logo={'FaShoppingCart'}
                        title={'Hola mundo'}
                        date={''}
                        color={'blue.400'}
                        index={'1'}
                        arrLength={'2'}
                    /> */}
                        {/* <Text fontWeight='bold' as='span' color='gray.400'>
                        Hola mundo
                    </Text>{' '} */}

                        {options?.purchaseorder?.map(product => (
                            < Flex alignItems='center' minH='48px' justifyContent='start' mb='2px'>
                                <Flex direction='column' h='100%' align='center'>
                                    <Icon
                                        as={CreditIcon}
                                        bg={bgIconColor}
                                        color={'white'}
                                        h={"20px"}
                                        w={"20px"}
                                        me='16px'
                                        right={document.documentElement.dir === "rtl" ? "-8px" : ""}
                                        left={document.documentElement.dir === "rtl" ? "" : "-8px"}
                                    />
                                </Flex>
                                <Flex direction='column' justifyContent='flex-start' h='100%'>
                                    <Text fontSize='sm' color='#fff' fontWeight='normal' mb='3px'>
                                        {product.label}
                                    </Text>
                                    <Text fontSize='sm' color='gray.400' fontWeight='normal'>
                                        {numberWithCommas(product.quantity)}                            </Text>
                                </Flex>
                                <Flex direction='column' h='100%' align='center'>
                                    <Icon
                                        as={DeleteIcon}
                                        bg={bgIconColor}
                                        color={'red.500'}
                                        h={"20px"}
                                        w={"20px"}
                                        ml='16px'
                                        right={document.documentElement.dir === "rtl" ? "-8px" : ""}
                                        left={"80px"}
                                        onClick={() => handleDeletePO(product)}
                                    />

                                </Flex>
                                {/* <Flex direction='column' h='100%' align='center'>
                                    <Icon
                                        as={ViewIcon}
                                        bg={bgIconColor}
                                        color={'green.500'}
                                        h={"20px"}
                                        w={"20px"}
                                        ml='16px'
                                        right={document.documentElement.dir === "rtl" ? "-8px" : ""}
                                        left={"80px"}
                                        onClick={() => alert("a ver")}
                                    />

                                </Flex> */}
                            </Flex>
                        )
                        )


                        }
                    </Flex>
                </CardBody>
            </Card >


        </>



    );
}
