import React, { ReactElement, ReactNode } from "react";
import styled, { css } from "styled-components";
import { palette, PaletteKeyTypes } from "../styles/palette";

interface ButtonStyle {
  width?: string;
  height?: string;
  buttonColor?: PaletteKeyTypes;
  hasBorder?: boolean;
  borderColor?: PaletteKeyTypes;
  borderRadius?: string;
  fontColor?: PaletteKeyTypes;
  fontSize?: string;
  isSelected?: boolean;
}
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonStyle {
  children: ReactNode;
  className?: string;
}

function Button({
  className,
  children,
  isSelected,
  ...rest
}: ButtonProps): ReactElement {
  return (
    <ButtonStyled className={className} isSelected={isSelected} {...rest}>
      {children}
    </ButtonStyled>
  );
}

const ButtonStyled = styled.button<ButtonStyle>`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  ${({
    width = "auto",
    height = "auto",
    buttonColor = "white",
    hasBorder = false,
    borderColor = "white",
    borderRadius = "4px",
    fontColor = "black",
    fontSize = "14px",
    isSelected = false,
  }) => css`
    width: ${width};
    height: ${height};
    background-color: ${palette[buttonColor]};
    border: ${hasBorder
      ? isSelected
        ? `2px solid #0080CA`
        : `2px solid ${palette[borderColor]}`
      : "none"};
    border-radius: ${borderRadius};
    color: ${isSelected ? "#111111" : palette[fontColor]};
    font-size: ${fontSize};
    &:disabled {
      background-color: #ededed;
      color: #111111;
      cursor: not-allowed;
    }
    .icon {
      filter: ${isSelected
        ? "invert(35%) sepia(75%) saturate(3687%) hue-rotate(182deg) brightness(93%) contrast(101%)"
        : "invert(67%) sepia(1%) saturate(0%) hue-rotate(270deg) brightness(96%) contrast(85%)"};
    }
  `}
`;

export default Button;
