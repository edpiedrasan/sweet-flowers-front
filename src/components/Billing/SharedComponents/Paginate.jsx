import React, { useContext, useState, useEffect } from "react";
import { Button, HStack, IconButton, Stack } from "@chakra-ui/react";

import { ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";


export const Paginate = ({
  count,
  pageSize,
  page,
  onPageChange,
  margin,
  size,
  selectedVariant,
  variant,
  previousIcon,
  nextIcon,
  colorScheme,
  fontWeight,
  paginations,
  borderRadius }) => {



  const numberOfPages = Math.ceil(count / pageSize);

  const handlePageClick = (i) => {
 
    let newPage = i;
    if (i > numberOfPages) {
      return;
    } else if (i == 0) {
      return;
    }
    console.log("newPage", newPage)
    onPageChange(newPage);
  };


  const renderPaginations = () => {

    const options = [];
    for (let i = 1; i <= paginations; i++) {
      options.push(
        <>
          <Button
            fontWeight={fontWeight}
            borderRadius={borderRadius}
            size={size}
            variant={page == (i ) ? selectedVariant : variant}
            onClick={e => {
              e.preventDefault();
              handlePageClick((i));
            }}
            colorScheme={colorScheme}
          >
            {i}
          </Button>

        </>
      )
    }

    return options.length >= 5 ? page >= 5 ? options.slice(page - 3, page+ 2) : options.slice(0, 5) : options;

  }


  return (
    <Stack p={5}>
      <HStack>
        <IconButton

          fontWeight={fontWeight}
          borderRadius={borderRadius}
          size={size}
          variant={variant}
          aria-label="previous"
          icon={previousIcon}
          onClick={e => {
            e.preventDefault();
            handlePageClick(page - 1);
          }}
          colorScheme={colorScheme}
        />
        {/* {Array(numberOfPages)
          .fill(0)
          .map((_, i) => (

            <Button
              key={i}

              fontWeight={fontWeight}
              borderRadius={borderRadius}
              size={size}
              variant={page == (i + 1) ? selectedVariant : variant}
              onClick={e => {
                e.preventDefault();
                handlePageClick((i + 1));
              }}
              colorScheme={colorScheme}
            >
              {i + 1}
            </Button>

            // {shouldRender(i) ? (
            //   <Button
            //     key={i}
            //     {...rest}
            //     fontWeight={fontWeight}
            //     borderRadius={borderRadius}
            //     size={size}
            //     variant={page == i ? selectedVariant : variant}
            //     onClick={e => {
            //       e.preventDefault();
            //       handlePageClick(i);
            //     }}
            //     colorScheme={colorScheme}
            //   >
            //     {9}
            //   </Button>
            // ) : shouldRenderEllipsis(i) ? (
            //   <Button
            //     key={i}
            //     {...rest}
            //     fontWeight={fontWeight}
            //     borderRadius={borderRadius}
            //     size={size}
            //     variant={variant}
            //     pointerEvents="none"
            //     colorScheme={colorScheme}
            //   >
            //     ...
            //   </Button>


            // : (
            //   <React.Fragment key={i}></React.Fragment>
            // );}
          ))

        } */}
        {renderPaginations()}
        <IconButton

          fontWeight={fontWeight}
          borderRadius={borderRadius}
          aria-label="next"
          icon={nextIcon}
          onClick={e => {
            e.preventDefault();
            handlePageClick(page + 1);
          }}
          size={size}
          variant={variant}
          colorScheme={colorScheme}
        />
      </HStack>
    </Stack>
  );
};