import { useEffect, useState } from "react";
import classes from "./Canvas.module.css";

type Layer = {
  id: string;
} & Bounds;

type Bounds = { top: number; right: number; bottom: number; left: number };

type OnCommit = (oppositeCoordinate: Coordinate) => void;

type LayerProps = {
  initialCoordinate: Coordinate;
  oppositCoordinate?: Coordinate;
  onCommit?: OnCommit;
};

const getLayerStyle = ([x1, y1]: Coordinate, [x2, y2]: Coordinate) => ({
  top: y1 < y2 ? y1 : y2,
  left: x1 < x2 ? x1 : x2,
  height: y1 < y2 ? y2 - y1 : y1 - y2,
  width: x1 < x2 ? x2 - x1 : x1 - x2,
});

const getBounds = ([x1, y1]: Coordinate, [x2, y2]: Coordinate): Bounds => {
  const [top, bottom] = y1 < y2 ? [y1, y2] : [y2, y1];
  const [left, right] = x1 < x2 ? [x1, x2] : [x2, x1];

  return {
    top: Math.round(top),
    right: Math.round(right),
    bottom: Math.round(bottom),
    left: Math.round(left),
  };
};

const numToPixels = (num: number) => `${num}px`;

type SimpleLayerProps = {
  bounds: Bounds;
};
const SimpleLayer = ({
  bounds: { top, right, bottom, left },
}: SimpleLayerProps) => (
  <div
    className="fixed border-solid border border-red-500"
    style={{
      top: numToPixels(top),
      width: numToPixels(right - left),
      left: numToPixels(left),
      height: numToPixels(bottom - top),
    }}
  />
);

const EditableLayer = ({
  initialCoordinate,
  oppositCoordinate,
  onCommit,
}: LayerProps) => {
  const [oppositeCoordinate, setOppositeCoordinate] = useState<Coordinate>(
    oppositCoordinate || initialCoordinate
  );

  useEffect(() => {
    const handlePointerMove = ({ pageX, pageY }: PointerEvent): void => {
      setOppositeCoordinate([pageX, pageY]);
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [onCommit]);

  return (
    <div
      className="fixed border-solid border border-red-500"
      style={getLayerStyle(initialCoordinate, oppositeCoordinate)}
    />
  );
};

type Coordinate = [x: number, y: number];

export const Canvas = () => {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [initialCoordinate, setInitialCoordinate] = useState<Coordinate | null>(
    null
  );

  const handlePointerDown: React.PointerEventHandler<HTMLDivElement> = ({
    pageX,
    pageY,
  }) => {
    setInitialCoordinate([pageX, pageY]);
  };

  const handleCommit: OnCommit = (oppositeCoordinate: Coordinate) => {
    if (!initialCoordinate) return;

    setLayers([
      ...layers,
      {
        id: crypto.randomUUID(),
        ...getBounds(initialCoordinate, oppositeCoordinate),
      },
    ]);

    setInitialCoordinate(null);
  };

  return (
    <div
      onPointerUp={({ pageX, pageY }) => handleCommit([pageX, pageY])}
      onPointerDown={handlePointerDown}
      className={`${classes.canvas} fixed top-0 right-0 bottom-0 left-0`}
    >
      {layers.map(({ id, top, right, bottom, left }) => (
        <SimpleLayer key={id} bounds={{ top, right, bottom, left }} />
      ))}
      {initialCoordinate && (
        <EditableLayer
          initialCoordinate={initialCoordinate}
          onCommit={handleCommit}
        />
      )}
    </div>
  );
};
