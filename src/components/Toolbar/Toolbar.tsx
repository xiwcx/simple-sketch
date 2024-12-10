import { FaMousePointer } from "react-icons/fa";
import { IoMove } from "react-icons/io5";
import { MdOutlineRectangle } from "react-icons/md";

import clsx from "clsx";
import { type IconType } from "react-icons/lib";
import { type Tool, useToolStore } from "../../store/toolStore";

const tools: ToolBarButtonProps[] = [
  { id: "move", title: "Move", Icon: IoMove },
  { id: "select", title: "Select", Icon: FaMousePointer },
  {
    id: "create-rectangle",
    title: "Create Rectangle",
    Icon: MdOutlineRectangle,
  },
];

type ToolBarButtonProps = {
  id: Tool;
  title: string;
  Icon: IconType;
};

const ToolbarButton = ({ id, title, Icon }: ToolBarButtonProps) => {
  const { current, selectCurrent } = useToolStore();
  const classes = clsx("p-2 bg-slate-100", { "bg-slate-300": current === id });

  console.log(current, id);

  return (
    <button className={classes} onClick={() => selectCurrent(id)}>
      <Icon title={title} />
    </button>
  );
};

export const Toolbar = () => (
  <div className="fixed top-4 left-4 divide-x divide-solid border-solid border-2 border-slate-300">
    {tools.map((props) => (
      <ToolbarButton {...props} />
    ))}
  </div>
);
