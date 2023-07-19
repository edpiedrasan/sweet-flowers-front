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

import React, { useEffect, useState } from "react";
// Chakra imports
import {
  FormControl,
  FormLabel,
  DarkMode,
  Heading,
  Switch,
  Button,
  Input,
  Spinner,
  Flex,
  Link,
  Text,
  Box,
  ChakraProvider,
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
  CloseButton
} from "@chakra-ui/react";

import theme from "theme/themeAuth.js";

// import { HashRouter, Route, Switch, Redirect } from "react-router-dom";

import { useHistory } from "react-router-dom";


import { authUser } from 'actions/auth.jsx';

import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';

import { getNamePerson } from 'helpers/decodeToken';



// Assets
import signInImage from "assets/img/prueba2.jpg"; //https://www.pexels.com/search/roses%20background/

// Custom Components
import AuthFooter from "components/Footer/AuthFooter";
import GradientBorder from "components/GradientBorder/GradientBorder";

//Dispatch para hacer peticiones
import { useDispatch } from 'react-redux';

function SignIn() {

  //#region Mensajes de notificaciones
  const MySwal = withReactContent(Swal);
  const Toast = MySwal.mixin({
    toast: true,
    position: 'bottom-right',
    showConfirmButton: true,
    timer: 8000,
    didOpen: toast => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });
  //#endregion

  let history = useHistory()

  //#region ejecutar fetch
  // const dispatch = useDispatch();
  //#endregion

  const titleColor = "white";
  const textColor = "gray.400";

  const [text, setText] = useState({
    title: "Bienvenido a Sweet Flowers Costa Rica",
    subtitle: "Ingrese sus credenciales",
    titleMain: "LAS MEJORES ROSAS DE COSTA RICA:",
    subtitleMain: "DIA A DIA"
  })

  const { title, subtitle, titleMain, subtitleMain } = text;


  const [login, setLogin] = useState({})

  const [loading, setLoading] = useState(false)

  const [alert, setAlert] = useState('')


  const handleSignIn = (e) => {

    // console.log(e.target.checked)

    setLogin({
      ...login, [e.target.id]:
        e.target.type !== "checkbox" ? e.target.value : e.target.checked
    })
    // console.log(e.target.id)
  }

  const validateFields = () => {
    if (login.email === '' || login.password == '') {
      return false;
    }
    return true;
  }



  const [fields, setFields] = useState([
    {
      id: "email",
      label: "Correo",
      placeholder: "Ingrese su correo",
      type: "text",
      typeField: "",
      required: false
    },
    {
      id: "password",
      label: "Contraseña",
      placeholder: "Ingrese su contraseña",
      type: "text",
      typeField: "password",
      required: false
    },
    // {
    //   id: "rememberMe",
    //   label: "Recuerdame",
    //   placeholder: "",
    //   type: "toggle",
    //   required: false
    // }
  ])

  //Funcion para traer las rows de la data de la tabla
  const handleSubmit = () => {

    if (validateFields()) {
      setLoading(true)


      authUser({ email: login.email, password: login.password }).then((res) => {
        setLoading(false)
        // console.log(res)
        // console.log(res.isAxiosError)
        if (res.isAxiosError) {
          // console.log("login failed")
          setAlert('Credenciales incorrectas!')

        } else {


          setAlert('')

          console.log(res.data.payload)
          const { token } = res.data.payload
          // console.log(token)

          // console.log("login success")

          let name= getNamePerson().split(' ')[0];
          Toast.fire({
            title: "Atención",
            html: `¡Bienvenido ${name} a Sweet Flowers!`,
            type: 'success'
          });

          localStorage.setItem('token', token);

          history.push("/admin");

        }

      })
    } else {

      setAlert('Existen campos vacíos')

    }






  }

  useEffect(() => {
    // console.log(login)
  }, [login])

  useEffect(() => {
    // debugger;
    fields.map(field => {
      setLogin(log => { return { ...log, [field.id]: '' } })
    })
  }, [])



  return (
    <ChakraProvider theme={theme} resetCss={false} w='100%'>
      <Box w='100%'>
        {/* <Portal containerRef={navRef}>
        <AuthNavbar
          secondary={getActiveNavbar(routes)}
          logoText='VISION UI FREE'
        />
      </Portal> */}
        <Box w='100%'>
          <Box w='100%'>
            <Flex position='relative'>

              <Flex
                minH='100vh'
                h={{ base: "120vh", lg: "fit-content" }}
                w='100%'
                maxW='1044px'
                mx='auto'
                pt={{ sm: "100px", md: "0px" }}
                flexDirection='column'
                me={{ base: "auto", lg: "50px", xl: "auto" }}>
                <Flex
                  alignItems='center'
                  justifyContent='start'
                  style={{ userSelect: "none" }}
                  mx={{ base: "auto", lg: "unset" }}
                  ms={{ base: "auto", lg: "auto" }}
                  w={{ base: "100%", md: "50%", lg: "450px" }}
                  px='50px'>
                  <Flex
                    direction='column'
                    w='100%'
                    background='transparent'
                    mt={{ base: "50px", md: "150px", lg: "160px", xl: "245px" }}
                    mb={{ base: "60px", lg: "95px" }}>
                    <Heading color={titleColor} fontSize='32px' mb='10px'>
                      {title}
                    </Heading>
                    <Text
                      mb='36px'
                      ms='4px'
                      color={textColor}
                      fontWeight='bold'
                      fontSize='14px'>
                      {subtitle}
                    </Text>


                    {
                      fields.map((field, index) => (



                        field.type === "text" ?
                          <FormControl
                            onSubmit={handleSubmit}
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
                              w={{ base: "100%", lg: "fit-content" }}
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
                                value={login[field.id]}
                                id={field.id}
                                type={field.typeField}
                                placeholder={field.placeholder}
                                onChange={e => handleSignIn(e)}
                              />
                            </GradientBorder>
                          </FormControl>

                          : //Tipo toggle
                          <FormControl display='flex' alignItems='center'>
                            <DarkMode>
                              <Switch id={field.id} colorScheme='brand' me='10px' onChange={e => handleSignIn(e)} />
                            </DarkMode>
                            <FormLabel
                              htmlFor={field.id}
                              mb='0'
                              ms='1'
                              fontWeight='normal'
                              color='white'
                              id={field.id}>

                              {field.label}
                            </FormLabel>
                          </FormControl>
                      ))
                    }


                    {/* <FormControl>
        <FormLabel
          ms='4px'
          fontSize='sm'
          fontWeight='normal'
          color='white'
        >
          Correo
        </FormLabel>
        <GradientBorder
          mb='24px'
          w={{ base: "100%", lg: "fit-content" }}
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
            placeholder='Your email adress'
            onChange={e => handleSignIn(e)}
          />
        </GradientBorder>
      </FormControl>
      <FormControl>
        <FormLabel
          ms='4px'
          fontSize='sm'
          fontWeight='normal'
          color='white'>
          Contraseña
        </FormLabel>
        <GradientBorder
          mb='24px'
          w={{ base: "100%", lg: "fit-content" }}
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
            type='password'
            placeholder='Your password'
          />
        </GradientBorder>
      </FormControl>
      <FormControl display='flex' alignItems='center'>
        <DarkMode>
          <Switch id='remember-login' colorScheme='brand' me='10px' />
        </DarkMode>
        <FormLabel
          htmlFor='remember-login'
          mb='0'
          ms='1'
          fontWeight='normal'
          color='white'>
          Recuerdame
        </FormLabel>
      </FormControl> */}
                    <Button
                      variant='brand'
                      fontSize='10px'
                      type='submit'
                      w='100%'
                      maxW='350px'
                      h='45'
                      mb='20px'
                      mt='20px'
                      colorScheme='blue'
                      isLoading={loading}
                      onClick={handleSubmit}
                    >

                      INGRESAR
                    </Button>

                    {alert != '' &&
                      <Alert status='warning'>
                        <AlertIcon />
                        <Box>
                          <AlertTitle>Atención!</AlertTitle>
                          <AlertDescription>
                            {alert}
                          </AlertDescription>
                        </Box>
                        <CloseButton
                          alignSelf='flex-end'
                          position='relative'
                          right={-1}
                          top={-1}
                          onClick={() => { setAlert('') }}
                        />
                      </Alert>
                    }

                    {/* <Flex
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        maxW='100%'
        mt='0px'>
        <Text color={textColor} fontWeight='medium'>
          No tiene una cuenta?
          <Link color={titleColor} as='span' ms='5px' fontWeight='bold'>
            Registrarse
          </Link>
        </Text>
      </Flex> */}
                  </Flex>
                </Flex>
                {/* <Box
    w={{ base: "335px", md: "450px" }}
    mx={{ base: "auto", lg: "unset" }}
    ms={{ base: "auto", lg: "auto" }}
    mb='80px'>
    <AuthFooter />
  </Box> */}
                <Box
                  display={{ base: "none", lg: "block" }}
                  overflowX='hidden'
                  h='100%'
                  maxW={{ md: "50vw", lg: "50vw" }}
                  minH='100vh'
                  w='960px'
                  position='absolute'
                  left='0px'>
                  <Box
                    bgImage={signInImage}
                    w='100%'
                    h='100%'
                    bgSize='cover'
                    bgPosition='50%'
                    position='absolute'
                    display='flex'
                    flexDirection='column'
                    justifyContent='center'
                    alignItems='center'
                    position='absolute'>
                    <Text
                      textAlign='center'
                      color='white'
                      letterSpacing='8px'
                      fontSize='20px'
                      fontWeight='500'>
                      {titleMain}
                    </Text>
                    <Text
                      textAlign='center'
                      color='transparent'
                      letterSpacing='8px'
                      fontSize='36px'
                      fontWeight='bold'
                      bgClip='text !important'
                      bg='linear-gradient(94.56deg, #FFFFFF 79.99%, #21242F 102.65%)'>
                      {subtitleMain}
                    </Text>
                  </Box>
                </Box>
              </Flex>
            </Flex>
          </Box>
        </Box>
      </Box>
    </ChakraProvider>

    // <Flex position='relative'>

    //   <Flex
    //     minH='100vh'
    //     h={{ base: "120vh", lg: "fit-content" }}
    //     w='100%'
    //     maxW='1044px'
    //     mx='auto'
    //     pt={{ sm: "100px", md: "0px" }}
    //     flexDirection='column'
    //     me={{ base: "auto", lg: "50px", xl: "auto" }}>
    //     <Flex
    //       alignItems='center'
    //       justifyContent='start'
    //       style={{ userSelect: "none" }}
    //       mx={{ base: "auto", lg: "unset" }}
    //       ms={{ base: "auto", lg: "auto" }}
    //       w={{ base: "100%", md: "50%", lg: "450px" }}
    //       px='50px'>
    //       <Flex
    //         direction='column'
    //         w='100%'
    //         background='transparent'
    //         mt={{ base: "50px", md: "150px", lg: "160px", xl: "245px" }}
    //         mb={{ base: "60px", lg: "95px" }}>
    //         <Heading color={titleColor} fontSize='32px' mb='10px'>
    //           {title}
    //         </Heading>
    //         <Text
    //           mb='36px'
    //           ms='4px'
    //           color={textColor}
    //           fontWeight='bold'
    //           fontSize='14px'>
    //           {subtitle}
    //         </Text>


    //         {
    //           fields.map((field, index) => (



    //             field.type === "text" ?
    //               <FormControl
    //                 onSubmit={handleSubmit}
    //               >
    //                 <FormLabel
    //                   ms='4px'
    //                   fontSize='sm'
    //                   fontWeight='normal'
    //                   color='white'
    //                 >
    //                   {field.label}
    //                 </FormLabel>
    //                 <GradientBorder
    //                   mb='24px'
    //                   w={{ base: "100%", lg: "fit-content" }}
    //                   borderRadius='20px'>
    //                   <Input
    //                     color='white'
    //                     bg='rgb(19,21,54)'
    //                     border='transparent'
    //                     borderRadius='20px'
    //                     fontSize='sm'
    //                     size='lg'
    //                     w={{ base: "100%", md: "346px" }}
    //                     maxW='100%'
    //                     h='46px'
    //                     id={field.id}
    //                     type={field.typeField}
    //                     placeholder={field.placeholder}
    //                     onChange={e => handleSignIn(e)}
    //                   />
    //                 </GradientBorder>
    //               </FormControl>

    //               : //Tipo toggle
    //               <FormControl display='flex' alignItems='center'>
    //                 <DarkMode>
    //                   <Switch id={field.id} colorScheme='brand' me='10px' onChange={e => handleSignIn(e)} />
    //                 </DarkMode>
    //                 <FormLabel
    //                   htmlFor={field.id}
    //                   mb='0'
    //                   ms='1'
    //                   fontWeight='normal'
    //                   color='white'
    //                   id={field.id}>

    //                   {field.label}
    //                 </FormLabel>
    //               </FormControl>
    //           ))
    //         }


    //         {/* <FormControl>
    //           <FormLabel
    //             ms='4px'
    //             fontSize='sm'
    //             fontWeight='normal'
    //             color='white'
    //           >
    //             Correo
    //           </FormLabel>
    //           <GradientBorder
    //             mb='24px'
    //             w={{ base: "100%", lg: "fit-content" }}
    //             borderRadius='20px'>
    //             <Input
    //               color='white'
    //               bg='rgb(19,21,54)'
    //               border='transparent'
    //               borderRadius='20px'
    //               fontSize='sm'
    //               size='lg'
    //               w={{ base: "100%", md: "346px" }}
    //               maxW='100%'
    //               h='46px'
    //               placeholder='Your email adress'
    //               onChange={e => handleSignIn(e)}
    //             />
    //           </GradientBorder>
    //         </FormControl>
    //         <FormControl>
    //           <FormLabel
    //             ms='4px'
    //             fontSize='sm'
    //             fontWeight='normal'
    //             color='white'>
    //             Contraseña
    //           </FormLabel>
    //           <GradientBorder
    //             mb='24px'
    //             w={{ base: "100%", lg: "fit-content" }}
    //             borderRadius='20px'>
    //             <Input
    //               color='white'
    //               bg='rgb(19,21,54)'
    //               border='transparent'
    //               borderRadius='20px'
    //               fontSize='sm'
    //               size='lg'
    //               w={{ base: "100%", md: "346px" }}
    //               maxW='100%'
    //               type='password'
    //               placeholder='Your password'
    //             />
    //           </GradientBorder>
    //         </FormControl>
    //         <FormControl display='flex' alignItems='center'>
    //           <DarkMode>
    //             <Switch id='remember-login' colorScheme='brand' me='10px' />
    //           </DarkMode>
    //           <FormLabel
    //             htmlFor='remember-login'
    //             mb='0'
    //             ms='1'
    //             fontWeight='normal'
    //             color='white'>
    //             Recuerdame
    //           </FormLabel>
    //         </FormControl> */}
    //         <Button
    //           variant='brand'
    //           fontSize='10px'
    //           type='submit'
    //           w='100%'
    //           maxW='350px'
    //           h='45'
    //           mb='20px'
    //           mt='20px'
    //           colorScheme='blue'
    //           isLoading={loading}
    //           onClick={handleSubmit}
    //         >

    //           INGRESAR
    //         </Button>

    //         {/* <Flex
    //           flexDirection='column'
    //           justifyContent='center'
    //           alignItems='center'
    //           maxW='100%'
    //           mt='0px'>
    //           <Text color={textColor} fontWeight='medium'>
    //             No tiene una cuenta?
    //             <Link color={titleColor} as='span' ms='5px' fontWeight='bold'>
    //               Registrarse
    //             </Link>
    //           </Text>
    //         </Flex> */}
    //       </Flex>
    //     </Flex>
    //     {/* <Box
    //       w={{ base: "335px", md: "450px" }}
    //       mx={{ base: "auto", lg: "unset" }}
    //       ms={{ base: "auto", lg: "auto" }}
    //       mb='80px'>
    //       <AuthFooter />
    //     </Box> */}
    //     <Box
    //       display={{ base: "none", lg: "block" }}
    //       overflowX='hidden'
    //       h='100%'
    //       maxW={{ md: "50vw", lg: "50vw" }}
    //       minH='100vh'
    //       w='960px'
    //       position='absolute'
    //       left='0px'>
    //       <Box
    //         bgImage={signInImage}
    //         w='100%'
    //         h='100%'
    //         bgSize='cover'
    //         bgPosition='50%'
    //         position='absolute'
    //         display='flex'
    //         flexDirection='column'
    //         justifyContent='center'
    //         alignItems='center'
    //         position='absolute'>
    //         <Text
    //           textAlign='center'
    //           color='white'
    //           letterSpacing='8px'
    //           fontSize='20px'
    //           fontWeight='500'>
    //           {titleMain}
    //         </Text>
    //         <Text
    //           textAlign='center'
    //           color='transparent'
    //           letterSpacing='8px'
    //           fontSize='36px'
    //           fontWeight='bold'
    //           bgClip='text !important'
    //           bg='linear-gradient(94.56deg, #FFFFFF 79.99%, #21242F 102.65%)'>
    //           {subtitleMain}
    //         </Text>
    //       </Box>
    //     </Box>
    //   </Flex>
    // </Flex>
  );
}

export default SignIn;
