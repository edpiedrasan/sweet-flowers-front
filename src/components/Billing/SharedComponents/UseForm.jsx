// react library
import React, { useContext } from "react";
// reactstrap components
import { Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import { Box, Button, Flex, Icon, Text, ChakraProvider, FormControl, Input, FormLabel, FormErrorMessage, SimpleGrid, Grid, Select, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper } from "@chakra-ui/react";

import IconBox from 'components/Icons/IconBox';

import { CartIcon, DocumentIcon, GlobeIcon, RocketIcon, StatsIcon, WalletIcon, FulgerIcon, CreditIcon, IconEdit } from 'components/Icons/Icons.js';
import GradientBorder from "components/GradientBorder/GradientBorder";

import { FaUser } from "react-icons/fa";

import theme from "theme/themeAuth.js";
import { useEffect } from "react";


import { RiSave3Fill } from "react-icons/ri";
import { HiArrowUturnLeft } from "react-icons/hi2";

//Import de componente contexto, para establecer variables globales
import { UserContext } from 'helpers/UserContext';


export const UseForm = React.memo(
  ({
    columns, fields, newInfo, setNewInfo, validateFormNow
  }) => {

    //states globales
    const { options } = useContext(UserContext);

    useEffect(() => {

      // console.log(options)
    }, [options])



    // console.log(fields);

    //Al arranque agregue campos en blanco a newInfo.
    useEffect(() => {

      // console.log(fields)
      let aux = { ...newInfo }
      delete aux.modalItems;

      aux = Object.keys(aux)
      // console.log(aux)

      //No haya información precargada
      if (! typeof newInfo === 'object' || aux.length == 0) {



        fields.map(field => {
          if (field.type == "select") {
            setNewInfo(info => { return { ...info, [field.id]: { label: "", value: "" } } })

          } else {
            setNewInfo(info => { return { ...info, [field.id]: '' } })
          }
        })

      }

    }, [])

    useEffect(() => {
      console.log("newInfo", newInfo)
    }, [newInfo])

    const handleNewInfo = (e, type) => {

      if (type == 'select') {
        setNewInfo({
          ...newInfo, [e.target.id]: { value: e.target.children[e.target.selectedIndex].value, label: e.target.children[e.target.selectedIndex].label }
        })
      } else { //No es select

        setNewInfo({
          ...newInfo, [e.target.id]:
            e.target.type !== "checkbox" ? e.target.value : e.target.checked
        })
      }
      // console.log(e.target.id)
    }


    const buildOptions = (field) => {
      // debugger;
      let toReturn = '';

      // console.log(field)

      if (field.id == 'partnerenterprisecontact') { //Excepción
        // console.log("hola mundo")

        if (newInfo?.purchaseorder != undefined && newInfo?.purchaseorder.label != '' && options['partnerenterprisecontact'] && options['partnerenterprisecontact'].length > 0) {
          // debugger;
          let idPo = newInfo.purchaseorder.value;
          let idClient = options.purchaseorderbuild.filter(poB => poB.value == idPo)[0]?.client;

          toReturn = options[field.options]?.filter(option => (option[field.optionsDependsAnotherDropdown] == idClient))
            .map(option => (
              <option key={option.value} value={option.value} label={option.label}>{option.label}</option>
            ))


        }

      } else {
        toReturn = options[field.options]?.filter(option => (option[field.optionsDependsAnotherDropdown] == newInfo[field.optionsDependsAnotherDropdown]?.value))
          .map(option => (
            <option key={option.value} value={option.value} label={option.label}>{option.label}</option>
          ))
      }


      return toReturn;
    }

    const showField = (field) => {

      let toReturn = false;

      if (field.dependsAnotherDropdown == true &&
        newInfo[field.idDropdownDepends]?.label == field.valueThatDepends) {
          toReturn=true
      } else {
        //Si no se habilita que se limpie el campo
        if(newInfo[field.id] != undefined && newInfo[field.id] != '')
        {
          setNewInfo({
            ...newInfo, [field.id]: ''
          })
        }
      }
      return toReturn;
    }



    return (




      <Flex flexDirection='column' pt={{ base: '0px', md: '0px' }}>
        <Grid templateColumns={{ sm: "1fr", lg: "100% 90%" }}>
          {/* Cards Master Data */}


          <>

            {/* {billingData.map((row) => { */}
            {/* return ( */}
            <SimpleGrid columns={{ sm: 1, md: columns, xl: columns }} spacingX='40px' spacingY='0px'>

              {fields.map((field, index) => {
                return (

                  (field.dependsAnotherDropdown == false ||
                    (showField(field))
                  )

                  &&


                  (field.type == 'input' ?
                    <Box>

                      <FormControl
                        isInvalid={field.required && (newInfo[field.id] == '' || newInfo[field.id] == undefined) && validateFormNow}
                      // onSubmit={handleSubmit}
                      >
                        <FormLabel
                          ms='4px'
                          fontSize='sm'
                          fontWeight='normal'
                          color='white'

                        >
                          {field.label}
                        </FormLabel>
                        <GradientBorder
                          mb='24px'
                          w='300px'
                          borderRadius='20px'>
                          <Input
                            color='white'
                            bg='rgb(19,21,54)'
                            border='transparent'
                            borderRadius='20px'
                            fontSize='sm'
                            size='lg'
                            w={{ base: "100%", md: "346px" }}
                            maxW='100%'
                            h='46px'
                            value={newInfo[field.id] ? newInfo[field.id] : ''}
                            id={field.id}
                            type={field.typeField}
                            placeholder={field.placeholder}
                            onChange={e => handleNewInfo(e, field.type)}
                          />
                        </GradientBorder>
                        <FormErrorMessage>Campo vacío</FormErrorMessage>

                      </FormControl>

                    </Box>


                    : field.type == 'number' ?//select
                      <Box>

                        <FormControl
                          isInvalid={field.required && (newInfo[field.id] == '' || newInfo[field.id] == undefined) && validateFormNow}
                        // onSubmit={handleSubmit}
                        >
                          <FormLabel
                            ms='4px'
                            fontSize='sm'
                            fontWeight='normal'
                            color='white'

                          >
                            {field.label}
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


                                value={newInfo[field.id] ? newInfo[field.id] : ''}
                                id={field.id}
                                type={field.typeField}
                                placeholder={field.placeholder}
                                onChange={e => handleNewInfo(e, field.type)}
                              />

                            </NumberInput>
                          </GradientBorder>
                          <FormErrorMessage>Campo vacío</FormErrorMessage>

                        </FormControl>

                      </Box>
                      :
                      <Box>

                        <FormControl
                          isInvalid={field.required && ((newInfo[field.id] == '' || newInfo[field.id] == undefined) || (field.type == 'select' && newInfo[field.id].label == '')) && validateFormNow}
                        // onSubmit={handleSubmit}
                        >
                          <FormLabel
                            ms='4px'
                            fontSize='sm'
                            fontWeight='normal'
                            color='white'

                          >
                            {field.label}
                          </FormLabel>
                          <GradientBorder
                            mb='24px'
                            w='300px'
                            borderRadius='20px'>
                            {/* <Input
                            color='white'
                            bg='rgb(19,21,54)'
                            border='transparent'
                            borderRadius='20px'
                            fontSize='sm'
                            size='lg'
                            w={{ base: "100%", md: "346px" }}
                            maxW='100%'
                            h='46px'
                            value={newInfo[field.id] ? newInfo[field.id] : ''}
                            id={field.id}
                            type={field.typeField}
                            placeholder={field.placeholder}
                            onChange={e => handleNewInfo(e)}
                          /> */}

                            <Select
                              placeholder={field.placeholder}
                              id={field.id}

                              color='gray'
                              colorOptions='Black'
                              bg='rgb(19,21,54)'
                              border='transparent'
                              borderRadius='20px'
                              fontSize='sm'
                              size='lg'
                              w={{ base: "100%", md: "346px" }}
                              maxW='100%'
                              h='46px'
                              onChange={e => handleNewInfo(e, field.type)}
                              value={newInfo[field.id]?.value ? newInfo[field.id]?.value : ''}


                              _focus={{ bg: 'black' }} // Establecer el color de fondo cuando el componente está enfocado

                            >
                              {field.optionsDependsAnotherDropdown == '' ? options[field.options]?.map(option => (
                                <option key={option.value} value={option.value} label={option.label}>{option.label}</option>
                              ))

                                :



                                buildOptions(field)

                              }

                            </Select>

                          </GradientBorder>
                          <FormErrorMessage>Campo vacío</FormErrorMessage>

                        </FormControl>

                      </Box>
                  )

                )
              })}
              {/* </Flex> */}


              {/* <Flex justify='space-between' w='100%' align='center' h='13%'>

                <Flex direction='column' maxW='50%' align='center'>

                  <Button colorScheme='blue' ml={21}
                    leftIcon={<RiSave3Fill />}

                  // onClick={onClose}
                  // onClick={setModalVisible(false)}
                  // onClick={() => handleAddModal()}

                  >
                    Agregar
                  </Button>
                </Flex>

                <Flex direction='column' maxW='50%' align='center'>

                  <Button colorScheme='red' mr={140}
                    leftIcon={<HiArrowUturnLeft />}

                  // onClick={onClose}
                  // onClick={setModalVisible(false)}
                  // onClick={() => setVisible(false)}

                  >
                    Cancelar
                  </Button>
                </Flex>
              </Flex> */}
            </SimpleGrid>


            {/* ); */}
          </>



        </Grid>
      </Flex>


    );
  }
);














































{/* <Flex
alignItems='center'
justifyContent='start'
style={{ userSelect: "none" }}
mx={{ base: "auto", lg: "unset" }}
ms={{ base: "auto", lg: "auto" }}
w={{ base: "100%", md: "50%", lg: "450px" }}
px='50px'>


{
  fields.map((field, index) => (
    <Flex
      direction='column'
      w='100%'
      background='transparent'
      mt={{ base: "50px", md: "150px", lg: "160px", xl: "245px" }}
      mb={{ base: "60px", lg: "95px" }}>

      <FormControl
      // onSubmit={handleSubmit}
      >
        <FormLabel
          ms='4px'
          fontSize='sm'
          fontWeight='normal'
          color='white'
        >
          {field.label}
        </FormLabel>
        <GradientBorder
          mb='24px'
          w={{ base: "30%", lg: "fit-content" }}
          borderRadius='20px'>
          <Input
            color='white'
            bg='rgb(19,21,54)'
            border='transparent'
            borderRadius='20px'
            fontSize='sm'
            size='lg'
            w={{ base: "100%", md: "346px" }}
            maxW='100%'
            h='46px'
            //value={login[field.id]}
            id={field.id}
            type={field.typeField}
          // placeholder={field.placeholder}
          // onChange={e => handleSignIn(e)}
          />
        </GradientBorder>
      </FormControl>
    </Flex>
  ))

}


</Flex> */}