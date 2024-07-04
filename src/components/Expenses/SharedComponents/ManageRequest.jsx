// react library
import React from "react";

//Ruta para crear nuevo dato maestro
import { newMasterData } from 'actions/masterdata';


import { getUserPerson } from 'helpers/decodeToken';


// Custom components
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

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

    Table,
    Thead,
    Tr,
    Td,
    Th,
    Tbody,

    Progress,

    useToast




} from "@chakra-ui/react";
import { AiFillCheckCircle } from "react-icons/ai";



import { FaEllipsisV } from "react-icons/fa";


import IconBox from 'components/Icons/IconBox';

import { CartIcon, DocumentIcon, GlobeIcon, RocketIcon, StatsIcon, WalletIcon, FulgerIcon, CreditIcon, IconEdit, } from 'components/Icons/Icons.js';

import { FaUser } from "react-icons/fa";

import { HiArrowUturnLeft } from "react-icons/hi2";
import { UseForm } from "./UseForm";
import { useState } from "react";

import { BsClipboardPlusFill, BsFillSendPlusFill, BsFillSendFill } from "react-icons/bs";
import { UseModal } from "./UseModal";
import { useEffect, useContext } from "react";

//Import de componente contexto, para establecer variables globales
import { UserContext } from 'helpers/UserContext';

import withReactContent from 'sweetalert2-react-content';

import Swal from "sweetalert2";
import { UseTable } from "./UseTable";


export const ManageRequest = React.memo(
    ({
        formActive,
        id,
        setFormActive }) => {
        //Notificaciones
        const MySwal = withReactContent(Swal);

        //states globales
        const { options } = useContext(UserContext);



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
            console.log("newInfo", newInfo)
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

        //Handle para enviar la gestión
        const handleSendForm = () => {
            if (validateForm()) {
                MySwal.fire({

                    type: 'warning',
                    title: `Crear Dato Maestro`,
                    html:

                        `<h2>¿Está seguro que desea crear el dato maestro?</h2>`,

                    confirmButtonText: 'Si, crear',
                    confirmButtonColor: '#0ABF67',
                    cancelButtonText: 'No, cancelar',
                    showCancelButton: true,

                    preConfirm: () => {

                        setIsLoading(true)

                        newMasterData({ type: tabActive, newInfo: newInfo, form: formActive.id, user: getUserPerson() }).then((res) => {
                            console.log(res)

                            setIsLoading(false);
                            // console.log(res.isAxiosError)
                            if (res.isAxiosError) {
                                // console.log("login failed")
                                toast({
                                    title: 'Atención',
                                    description: `Ocurrió un error al crear el dato maestro!`,
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



                            }

                        })
                    },

                })













            }
        }


        const validateForm = () => {
            console.log("formActive", formActive);
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

            if ((newInfo.modalItems.length == 0 || newInfo.modalItems.length == undefined) && formActive.modal != null) {
                toast({
                    title: 'Atención',
                    description: `Debe agregar al menos un contacto al cliente!`,
                    status: 'warning',
                    duration: 4000,
                    isClosable: true,
                })
                return false;
            }

            return true;




        }

        const [isLoading, setIsLoading] = useState(false)


        return (
            <>

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
                    />
                }




                <UseTable
                    edit={true}
                    columns={formActive.columnsTable}
                    newInfo={newInfo}
                    setNewInfo={setNewInfo}
                    validateFormNow={validateFormNow}
                    formActive={formActive}
                    setFormActive={setFormActive}
                />




                {/* <Flex justify='space-between' w='100%' align='center'>
                    <Flex direction='column' maxW='100%' align='flex-center'>

                        <UseForm
                            columns={3}
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
                        <Flex
                            justify={['center', 'center', 'space-between']} // Alinear al centro en dispositivos móviles
                            w='100%'
                            align={['center', 'center', 'center']} // Alinear al centro en dispositivos móviles
                            h={['13%', '13%', '13%']}
                        >
                            <Flex direction='column' maxW={['100%', '100%', '50%']} align='center'>
                                <Button
                                    colorScheme='green'
                                    ml={[0, 0, 600]} // Ajustar margen izquierdo en dispositivos móviles
                                    leftIcon={<BsFillSendFill />}
                                    onClick={handleSendForm}
                                    isLoading={isLoading}
                                >
                                    Crear Registros
                                </Button>
                            </Flex>
                        </Flex>

                    </Flex>
                </Flex> */}


            </>
        );
    }
);
