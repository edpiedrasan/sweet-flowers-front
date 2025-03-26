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

// Chakra Imports
import { Button, useColorModeValue } from "@chakra-ui/react";
// Custom Icons
import { SettingsIcon } from "components/Icons/Icons";
import PropTypes from "prop-types";
import React from "react";
import { useHistory } from "react-router-dom";
import { PiPlantBold } from "react-icons/pi";

export default function FixedPlugin(props) {
  const { secondary, onChange, onSwitch, fixed, ...rest } = props;
  let history = useHistory()
  // Chakra Color Mode
  let navbarIcon = "white";
  let bgButton = "brand.200";
  // if (props.secondary) {
  //   fixedDisplay = "none";
  // }
const handleOpenSmartAutomation =() => {
  history.push("/automation");

}
  const settingsRef = React.useRef();
  return (
    <>
      <Button
        h='52px'
        w='52px'
        // onClick={props.onOpen}
        onClick={handleOpenSmartAutomation}
        bg={bgButton}
        position='fixed'
        variant='no-hover'
        left={document.documentElement.dir === "rtl" ? "35px" : ""}
        right={document.documentElement.dir === "rtl" ? "" : "35px"}
        bottom='30px'
        borderRadius='50px'
        boxShadow='0 2px 12px 0 rgb(0 0 0 / 16%)'>
        {/* <SettingsIcon
          cursor='pointer'
          ref={settingsRef}
          color={navbarIcon}
          w='20px'
          h='20px'
        /> */}
        <PiPlantBold color="white" size="30px" /> {/* Aquí ajustamos el tamaño y el color */}
      </Button>
    </>
  );
}

FixedPlugin.propTypes = {
  fixed: PropTypes.bool,
  onChange: PropTypes.func,
  onSwitch: PropTypes.func,
};
