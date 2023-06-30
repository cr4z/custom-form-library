import { SxProps } from "@mui/material";
import Box from "./BoxExtended";
import XNGBack from "../low-level/button_back";
import { getSizing } from "../sizing";
import { useRef, useState, useEffect } from "react";
import { XNGSlide } from "../types/slide";

export interface IXNGSlideView {
  width: string;
  left: JSX.Element;
  rightOpen: boolean;
  value: any;
  slides: XNGSlide[];
  useDefaultBack?: boolean;
  onClose?: () => void;
}

export function XNGSlideView(props: IXNGSlideView) {
  const sxLeftSlide: SxProps = {
    width: props.width,
    transform: `translateX(-${props.rightOpen ? props.width : "0px"})`,
    transition: "all .25s ease",
    top: 0,
    left: 0,
  };
  const sxRightSlide: SxProps = {
    width: props.width,
    transition: "all .25s ease",
    position: "absolute",
    transform: `translateX(${props.rightOpen ? "0px" : props.width})`,
    top: 0,
    left: 0,
  };

  function getSlideView(): JSX.Element {
    return props.slides.filter((s: XNGSlide) => s.id === props.value)[0].content;
  }

  // HEIGHT CHANGE  SYSTEM
  const rightHeightRef = useRef<HTMLDivElement>(null);
  const leftHeightRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>();
  useEffect(() => {
    if (props.rightOpen) {
      setHeight(rightHeightRef.current?.clientHeight);
    } else {
      setHeight(leftHeightRef.current?.clientHeight);
    }
  }, [props.rightOpen]);

  return (
    <Box sx={{ position: "relative", overflow: "hidden", height: height, transition: "height .2s ease" }}>
      <Box sx={sxLeftSlide}>
        <div ref={leftHeightRef}>{props.left}</div>
      </Box>
      <Box sx={sxRightSlide}>
        <div ref={rightHeightRef}>
          {props.useDefaultBack && (
            <Box sx={{ marginLeft: getSizing(1) }}>
              <XNGBack onClick={() => props.onClose!()} />
            </Box>
          )}
          {getSlideView()}
        </div>
      </Box>
    </Box>
  );
}
