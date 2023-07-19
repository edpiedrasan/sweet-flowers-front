// react library
import React, { useContext } from "react";

//Import de componente contexto, para establecer variables globales
import { UserContext } from 'helpers/UserContext';


//Ruta para crear nuevo dato maestro
import { registerProductionProducts } from 'actions/production';


import { getUserPerson } from 'helpers/decodeToken';



// reactstrap components
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from "reactstrap";
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



import { FaEllipsisV } from "react-icons/fa";


import IconBox from 'components/Icons/IconBox';

import { CartIcon, DocumentIcon, GlobeIcon, RocketIcon, StatsIcon, WalletIcon, FulgerIcon, CreditIcon, IconEdit, } from 'components/Icons/Icons.js';

import { FaUser } from "react-icons/fa";

import { HiArrowUturnLeft } from "react-icons/hi2";
import { UseForm } from "./UseForm";
import { useState } from "react";

import { BsClipboardPlusFill, BsFillSendPlusFill, BsFillSendFill } from "react-icons/bs";
import { UseModal } from "./UseModal";
import { useEffect } from "react";




export const ManageRequest = React.memo(
    ({
        formActive,
        id,
        setFormActive }) => {

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

        const [chargingButton, setChargingButton] = useState(false)

        const handleCleanForm = () => {
            setNewInfo({ modalItems: [] })
            setValidateFormNow(false);
            setPreChargeInfoModal([]);

        }

        //Handle para enviar la gestión
        const handleSendForm = () => {
            if (validateForm()) {
                setChargingButton(true);
                registerProductionProducts({ newInfo: newInfo, user: getUserPerson(), land: 1 }).then((res) => {
                    setChargingButton(false);

                    console.log(res)
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





            }
        }


        const validateForm = () => {
            // debugger;
            setValidateFormNow(true)
            let fieldsVoids = generateFields(formActive)
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


        const generateFields = (formActive) => {

            let temp = []

            if (formActive.id == 'productionRegister') {
                temp = [...temp,
                {
                    colWidth: "6",
                    label: `Día de producción`,
                    placeholder: "Ingrese la fecha",
                    id: `productionDate`,
                    options: "",
                    type: "datetime-local",
                    dependsAnotherDropdown: false,
                    idDropdownDepends: "",
                    valueThatDepends: "",
                    disabled: false,
                    required: false
                },
                ]

                options.product?.map(product => {

                    temp = [...temp,
                    {
                        colWidth: "6",
                        label: `${product.label}*`,
                        placeholder: "Cantidad",
                        id: `${product.label}`,
                        options: "",
                        type: "number",
                        dependsAnotherDropdown: false,
                        idDropdownDepends: "",
                        valueThatDepends: "",
                        disabled: false,
                        required: true
                    },
                    ]
                })
            }

            console.log(temp)
            // console.log(formActive)

            return temp.length > 0 ? temp : formActive.form

        }

        return (
            <>

                {formActive.modal != null && false &&
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
                <Flex justify='space-between' w='100%' align='center' h='13%'>
                    <Flex direction='column' maxW='80%' align='center'>

                        <Text color='#fff' fontSize='lg' fontWeight='bold'>
                            {formActive.title}
                        </Text>
                    </Flex>

                    <Flex direction='column' maxW='20%' align='center'>

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
                    p='20px'
                    bg='linear-gradient(127.09deg, rgba(24, 29, 60, 0.94) 19.41%, rgba(10, 14, 35, 0.49) 76.65%)'
                    my='12px'
                    borderRadius='25px'
                >

                    <Flex justify='space-between' w='100%' align='center'>
                        <Flex direction='column' maxW='100%' align='flex-center'>
                            <UseForm
                                columns={2}
                                fields={generateFields(formActive)}
                                newInfo={newInfo}
                                setNewInfo={setNewInfo}
                                validateFormNow={validateFormNow}
                            />
                            {formActive.modal != null && //En caso que no haya modal que no cree el apartado
                                <>
                                    <Text className=""> Contactos</Text>

                                    <Text fontSize='sm' color='gray.400' fontWeight='normal'>
                                        <Text fontWeight='bold' as='span' color='gray.400'>
                                            Agregar contactos del cliente
                                        </Text>{" "}
                                    </Text>


                                    <Box


                                        p='30px'
                                        bg='linear-gradient(127.09deg, rgba(24, 29, 60, 0.94) 19.41%, rgba(10, 14, 35, 0.49) 76.65%)'
                                        my='12px'
                                        borderRadius='25px'>



                                        <Button leftIcon={<BsClipboardPlusFill />} colorScheme='blue' variant='solid'
                                            onClick={() => setModalVisible(true)}
                                        >
                                            Agregar contacto</Button>













                                        <Flex direction='column' pt={{ base: "120px", md: "25px" }}>
                                            {/* Projects Table */}

                                            <Table variant='simple' color='#fff'>
                                                <Thead>
                                                    <Tr my='.8rem' ps='0px'>

                                                        {

                                                            formActive.columnsTable.map((col, colIndex) => (

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


                                                    {newInfo.modalItems.map((row, rowIndex) => (
                                                        <Tr>
                                                            {

                                                                formActive.columnsTable.map((col, colIndex) => (
                                                                    <Td borderBottomColor='#56577A' border={true ? "none" : null}>

                                                                        {col.type == "text" ?
                                                                            <Text fontSize='sm' color='#fff' fontWeight='' pb='.5rem'>
                                                                                {row[col.value]}
                                                                            </Text>
                                                                            :
                                                                            <>

                                                                                <Button size="sm" leftIcon={<BsClipboardPlusFill />} colorScheme='blue' variant='solid'
                                                                                    onClick={() => { setPreChargeInfoModal(row); setModalVisible(true); }}
                                                                                >
                                                                                    Editar
                                                                                </Button>

                                                                                <Button size="sm" leftIcon={<BsClipboardPlusFill />} colorScheme='red' variant='solid' ml={4}
                                                                                    onClick={() => handleOnDeleteModalItem(row)}
                                                                                >
                                                                                    Eliminar
                                                                                </Button> </>
                                                                        }

                                                                    </Td>
                                                                ))
                                                            }


                                                        </Tr>
                                                    ))}



                                                </Tbody>
                                            </Table>

                                        </Flex>




                                    </Box>
                                </>


                            }
                            <Flex justify='space-between' w='100%' align='center' h='13%'>

                                <Flex direction='column' maxW='50%' align='center'>

                                    <Button colorScheme='green' ml={600}
                                        leftIcon={<BsFillSendFill />}

                                        isLoading={chargingButton}
                                        // onClick={onClose}
                                        // onClick={setModalVisible(false)}
                                        onClick={() => {
                                            handleSendForm();
                                        }}

                                    >
                                        Enviar
                                    </Button>
                                </Flex>
                            </Flex>

                        </Flex>
                    </Flex>
                </Box>
            </>
        );
    }
);
