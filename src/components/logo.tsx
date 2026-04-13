import Image from "next/image";
import Link from "next/link";
import React from "react";
import styled from "styled-components";
import darkLogo from "@/assets/logoBlack.png";
import lightLogo from "@/assets/logoWhite.png";

const LogoStyles = styled.div<{ $size?: "sm" | "md" | "lg" }>`
  width: ${({ $size }) => {
    switch ($size) {
      case "sm":
        return "100px";
      case "md":
        return "200px";
      case "lg":
        return "300px";
      default:
        return "200px";
    }
  }};
  height: auto;

  img {
    width: 100%;
    height: auto;
  }
`;

const Logo = ({
  size,
  dark,
}: {
  size?: "sm" | "md" | "lg";
  dark?: boolean;
}) => {
  return (
    <Link href="/">
      {" "}
      <LogoStyles $size={size}>
        <Image
          src={dark ? darkLogo.src : lightLogo.src}
          alt="Chago Logo"
          width={200}
          height={80}
        />
      </LogoStyles>
    </Link>
  );
};

export default Logo;
