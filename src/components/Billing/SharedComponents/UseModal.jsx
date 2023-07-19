// react library
import React, { useEffect } from "react";
// reactstrap components
import { Card, CardBody, CardTitle, Col, Row } from "reactstrap";
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


    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,


    Tr,
    Td,

    useToast

} from "@chakra-ui/react";

import IconBox from 'components/Icons/IconBox';

import { CartIcon, DocumentIcon, GlobeIcon, RocketIcon, StatsIcon, WalletIcon, FulgerIcon, CreditIcon, IconEdit, } from 'components/Icons/Icons.js';

import { FaUser } from "react-icons/fa";

import { HiArrowUturnLeft } from "react-icons/hi2";
import { UseForm } from "./UseForm";
import { useState } from "react";

import { BsClipboardPlusFill, } from "react-icons/bs";

import { RiSave3Fill } from "react-icons/ri";

import { getPaymentHistory } from 'actions/billing';





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
    }) => {

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






        useEffect(() => {
            // console.log("INFO DEL MODAL", newInfoModal)
        }, [newInfoModal])

        useEffect(() => {
            // console.log("INFO DEL MODAL", newInfoModal)
        }, [newInfoModal])



        //Agregar o no un item del modal
        const handleAddModal = () => {
            // debugger;

            let validate = validateForm()

            if (validate[0]) { //El [0] es si existe ya


                let existIndex = newInfo.modalItems.indexOf(preChargeInfoModal);

                if (existIndex != -1) //En caso de que ya existia eliminarlo y agregar el nuevo
                {
                    let modalItemsAux = newInfo.modalItems.filter((item, i) => i != existIndex)
                    modalItemsAux = [
                        ...modalItemsAux,
                        newInfoModal
                    ]


                    setNewInfo({
                        ...newInfo,
                        ['modalItems']: [...modalItemsAux]
                    })


                } else { //No existe entonces simplemente se agrega
                    setNewInfo({
                        ...newInfo,
                        ['modalItems']: [
                            ...newInfo.modalItems,
                            newInfoModal
                        ]
                    })

                }

                // setNewInfo({
                //     ...newInfo,
                //     ['modalItems']: [
                //         ...newInfo.modalItems,
                //         newInfoModal
                //     ]
                // })


                setVisible(false)
                setValidateFormNow(false);
                setPreChargeInfoModal([]);

            } else {

                setValidateFormNow(true);


                // alert("Hay" + validate[1] + "Campos vacíos")

                toast({
                    title: 'Atención',
                    description: `Existen ${validate[1]} campos obligatorios vacíos.`,
                    status: 'warning',
                    duration: 4000,
                    isClosable: true,
                })

            }

            // console.log(e.target.checked)


            // console.log(e.target.id)

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

            getPaymentHistory({ idBilling: 24}).then((res) => {
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

                    setPaymentHistory(res.data.payload.historyBillings)


                    // handleCleanForm()
                    // setRefreshOptions(true);



                }

            })
        }, [])

        useEffect(() => {
            console.log(paymentHistory)
        }, [paymentHistory])




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

                            <UseForm
                                columns={1}
                                fields={fields}
                                newInfo={newInfoModal}
                                setNewInfo={setNewInfoModal}
                                validateFormNow={validateFormNow}
                            />


                        </ModalBody>

                        <ModalFooter>

                            <Flex justify='space-between' w='100%' align='center' h='13%'>

                                <Flex direction='column' maxW='50%' align='center'>

                                    <Button colorScheme='blue' ml={21}
                                        leftIcon={<RiSave3Fill />}

                                        // onClick={onClose}
                                        // onClick={setModalVisible(false)}
                                        onClick={() => handleAddModal()}

                                    >
                                        Agregar
                                    </Button>
                                </Flex>

                                <Flex direction='column' maxW='50%' align='center'>

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
