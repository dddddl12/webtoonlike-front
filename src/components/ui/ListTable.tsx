import {
  Children,
  ComponentProps,
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState
} from "react";
import { clsx } from "clsx";
import { useTranslations } from "next-intl";
import { useAdminPageContext } from "@/providers/AdminPageContextProvider";

type ListTableContextValue = {
  widths: number[];
  isRoot: boolean;
};
const ListTableContext = createContext<ListTableContextValue>(
  {} as ListTableContextValue
);

export function ListTable({ children, columns }: {
  children: ReactNode;
  columns: {
    label: string;
    width: number; // 비율(다른 컬럼 대비 상대 너비)
  }[];
}) {
  const widths = useMemo(() => {
    const totalWidth = columns.reduce((totalWidth, curColumn) => {
      return totalWidth + curColumn.width;
    }, 0);
    return columns.map(({ width }) => (width / totalWidth) * 100);
  }, [columns]);

  const { isRoot: parentIsRoot } = useContext(ListTableContext);
  const isRoot = !parentIsRoot;
  const isAdminPage = useAdminPageContext();
  return <ListTableContext.Provider value={{
    widths, isRoot
  }}>
    <div className={clsx("w-full", {
      "px-10 py-3 bg-box rounded-md": !isRoot && !isAdminPage,
    })}>
      <div className={clsx("flex p-2", {
        "border-b border-muted-foreground": !isRoot && !isAdminPage,
      })}>
        {columns.map((column, i) => {
          return <div key={i} className={clsx("p-2 flex justify-center text-muted-foreground", {
            "font-semibold": isRoot
          })}
          style={{ width: `${widths[i]}%` }}>
            {column.label}
          </div>;
        })}
      </div>
      <div>
        {children}
      </div>
    </div>
  </ListTableContext.Provider>;
}

export const ListRow = ({
  className, children, ...props
}: ComponentProps<"div">) => {
  const { widths, isRoot } = useContext(ListTableContext);
  const isAdminPage = useAdminPageContext();

  // Cell wrapper
  const cells = useMemo(() => {
    const childrenArray = Children.toArray(children);
    if (childrenArray.length !== widths.length) {
      throw new Error("The number of children does not match the number of widths.");
    }
    return childrenArray.map((child, index) => (
      <div
        key={index}
        style={{
          width: `${widths[index]}%`
        }}
        className="p-2 flex justify-center items-center"
      >
        {child}
      </div>
    ));
  }, [children, widths]);

  return <div
    {...props}
    className={clsx("flex p-2 rounded-md items-center", {
      "[&:not(:first-child)]:mt-4": isRoot,
      "bg-white": isAdminPage,
      "bg-muted": isRoot && !isAdminPage,
      "has-[.expansion-switch-on]:bg-[#376C49] has-[.expansion-switch-on]:rounded-[10px]": !isRoot,
    }, className)}>{cells}</div>;
};

export function ListCell({ children }: {
  children: ReactNode;
}) {
  return <>{children}</>;
}

export const useListExpansionSwitch = () => {
  const tGeneral = useTranslations("general");
  const [expanded, setExpanded] = useState(false);
  const switchButton = <span className={clsx("clickable", {
    "expansion-switch-on": expanded
  })}
  onClick={() => setExpanded(prev => !prev)}>
    {expanded ? tGeneral("collapse") : tGeneral("expand")}
  </span>;
  return {
    switchButton,
    ListRowExpanded: ListRowExpanded.bind(null, expanded),
  };
};

function ListRowExpanded(expanded: boolean, { children }: {
  children: ReactNode;
}) {
  return expanded && children;
}