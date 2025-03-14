import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

// TODO, revisit this and clean it up completely

const tableVariants = cva("caption-bottom text-sm", {
  variants: {
    layout: {
      default: "w-full", // Default full-width table
      fixed: "w-auto table-fixed", // Fixed width table that respects column widths
    },
    borderStyle: {
      default: "",
      bordered: "border",
      collapse: "", // Will use style prop for border-collapse
    },
  },
  defaultVariants: {
    layout: "default",
    borderStyle: "default",
  },
});

const tableWrapperVariants = cva("relative overflow-auto", {
  variants: {
    layout: {
      default: "w-full",
      fixed: "w-auto", // Auto-width wrapper for fixed layout tables
    },
  },
  defaultVariants: {
    layout: "default",
  },
});

export interface TableProps
  extends React.HTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableVariants> {
  wrapperClassName?: string;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    { className, layout, borderStyle, wrapperClassName, style, ...props },
    ref,
  ) => {
    // Calculate styles for wrapper and table
    const isFixedLayout = layout === "fixed";
    const wrapperStyles: React.CSSProperties = {
      ...(isFixedLayout ? { display: "inline-block" } : {}),
      ...style,
    };

    const tableStyles: React.CSSProperties = {
      ...(borderStyle === "collapse" ? { borderCollapse: "collapse" } : {}),
    };

    return (
      <div
        className={cn(tableWrapperVariants({ layout }), wrapperClassName)}
        style={wrapperStyles}
      >
        <table
          ref={ref}
          className={cn(tableVariants({ layout, borderStyle }), className)}
          style={tableStyles}
          {...props}
        />
      </div>
    );
  },
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors data-[state=selected]:bg-muted",
      className,
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground transition-colors hover:bg-muted/50 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-2 align-middle transition-colors hover:bg-muted/50 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className,
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  tableVariants,
};
