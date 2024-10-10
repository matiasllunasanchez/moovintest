import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/custom/button";
import { Input } from "@/components/ui/input";
// import { priorities, statuses } from "../data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import { ChangeEvent, useCallback, useState } from "react";
interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  columnToSearch?: string;
  externalSearch?: (val: string) => void;
  hasSearchButton?: boolean;
}

export function DataTableToolbar<TData>({
  table,
  columnToSearch,
  externalSearch,
  hasSearchButton,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const searchColumn = columnToSearch
    ? table.getColumn(columnToSearch)
    : table.getAllColumns()[0];

  const [externalSearchValue, setExternalSearchValue] = useState<string>();

  const searchInputValue = !!externalSearch
    ? externalSearchValue
    : (searchColumn?.getFilterValue() as string) ?? "";

  const handleSearchInputOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (externalSearch) setExternalSearchValue(event.target.value);
    else searchColumn?.setFilterValue(event.target.value);
  };

  const handleSubmitSearch = useCallback(() => {
    if (externalSearchValue) externalSearch?.(externalSearchValue);
  }, [externalSearch, externalSearchValue]);

  const handleDeleteSearch = () => {
    if (externalSearch) {
      setExternalSearchValue("");
      externalSearch?.("");
    } else table.resetColumnFilters();
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2 gap-2">
        {(columnToSearch || externalSearch) && (
          <div className="relative flex justify-center flex-grow md:flex-grow-0 items-center">
            <Input
              placeholder="Buscar"
              value={searchInputValue}
              onChange={handleSearchInputOnChange}
              className="h-8 md:w-[150px] lg:w-[250px]"
            />
            {(isFiltered || searchInputValue) && (
              <Cross2Icon
                onClick={handleDeleteSearch}
                className="h-4 w-4 z-10 absolute right-2 pointer hover:bg-black hover:bg-opacity-10 rounded-full transition-all duration-300 cursor-pointer"
              />
            )}
          </div>
        )}

        {/* <div className="flex gap-x-2">
          {table.getColumn("status") && (
            <DataTableFacetedFilter
              column={table.getColumn("status")}
              title="Status"
              options={[]}
            />
          )}
          {table.getColumn("priority") && (
            <DataTableFacetedFilter
              column={table.getColumn("priority")}
              title="Priority"
              options={[]}
            />
          )}
        </div> */}

        {hasSearchButton && (
          <Button
            iconName="search-icon"
            variant={"black"}
            disabled={!searchInputValue}
            autoFocus
            onClick={handleSubmitSearch}
          >
            Buscar
          </Button>
        )}
      </div>
      {/* <DataTableViewOptions table={table} /> */}
    </div>
  );
}
