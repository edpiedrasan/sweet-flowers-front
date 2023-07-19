// react library
import React from "react";
// reactstrap components
import { Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import { Box, Button, Flex, Icon, Text, } from "@chakra-ui/react";

import IconBox from 'components/Icons/IconBox';

import { CartIcon, DocumentIcon, GlobeIcon, RocketIcon, StatsIcon, WalletIcon, FulgerIcon, CreditIcon, IconEdit } from 'components/Icons/Icons.js';

import { FaUser } from "react-icons/fa";



export const CardMain = React.memo(
  ({
    field,
    setFormActive
  }) => {
    return (
      <Box
        p='20px'
        bg='linear-gradient(127.09deg, rgba(24, 29, 60, 0.94) 19.41%, rgba(10, 14, 35, 0.49) 76.65%)'
        my='12px'
        borderRadius='25px'
        onClick={() => setFormActive(field)}>
        <Flex justify='space-between' w='100%' align='center'>
          <Flex direction='column' maxW='100%' align='center'>
            <Flex justify='space-between' w='50%' align='start'>
              <Flex direction='column' maxW='70%'>
                <img
                  alt="..."
                  className="rounded img-center img-fluid shadow shadow-lg--hover"
                  src={require(`assets/img/masterdata/${field.image}`)}
                  style={{ objectFit: "contain", width: "60px", height: "60px" }}
                />

              </Flex>
              {/* <Flex direction='column' maxW='30%' align='flex-end'>

<img
                  alt="..."
                  className="rounded img-center img-fluid shadow shadow-lg--hover"
                  src={require(`assets/img/masterdata/click.png`)}
                  style={{ objectFit: "contain", width: "60px", height: "60px" }}
                />

              </Flex> */}

              {/* <Flex direction='column' maxW='30%'>
                <div className={"icon icon-shape bg-gradient-primary text-white rounded-circle shadow"}>
                  <i class={"ni ni-active-40"}></i>
                </div>
                <Icon as={FaUser} mr={2} />
                <span>Usuario</span>

                <IconBox as='box' h={'30px'} w={'30px'} bg='brand.200' me='6px'>
                  <IconEdit>

                  </IconEdit>

                </IconBox>
              </Flex> */}
            </Flex>


            <Text color='#fff' fontSize='sm' mb='15px' mr={50}>
              {field.title}
            </Text>
            <Text color='gray.400' fontSize='xs'>
              Descripción: {window.innerWidth < 768 ? <br /> : null}
              <Text as='span' color='gray.500'>
                {field.subtitle}
              </Text>
            </Text>
          </Flex>
        </Flex>
      </Box>
    );
  }
);
