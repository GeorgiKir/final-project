import React from "react";
import styled from "styled-components";

const Footer = () => {
  return (
    <>
      <StyledFooter>
        <p>RE:lease MTL Copyright - 2023</p>
      </StyledFooter>
    </>
  );
};

const StyledFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  /* width: 98.9vw; */
  background-color: #0078a0;
  /* background-color: black; */
  height: 50px;
  color: white;
  /* bottom: 0; */
  /* margin-top: 100%; */
`;

export default Footer;
