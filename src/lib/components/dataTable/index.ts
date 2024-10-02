import type { ClassValue } from 'clsx';
import { createRender, Table, type Constructor, type TableViewModel } from 'svelte-headless-table';
import {
	addHiddenColumns,
	addPagination,
	addResizedColumns,
	addSelectedRows,
	addSortBy,
	addTableFilter
} from 'svelte-headless-table/plugins';

import DataTableAction from './data-table-action.svelte';
import DataTable from './data-table.svelte';
import DataTableCheckbox from './data-table-checkbox.svelte';
import type { ComponentProps, SvelteComponent } from 'svelte';

export interface PluginOptions {
	select: Parameters<typeof addSelectedRows>[0];
	sort: Parameters<typeof addSortBy>[0];
	hide: Parameters<typeof addHiddenColumns>[0];
	resize: Parameters<typeof addResizedColumns>[0];
	page: Parameters<typeof addPagination>[0];
	filter: Parameters<typeof addTableFilter>[0];
}

function createTablePlugins(opt: Partial<PluginOptions> = {}) {
	return {
		select: addSelectedRows(opt.select),
		sort: addSortBy(opt.sort),
		hide: addHiddenColumns(opt.hide),
		resize: addResizedColumns(opt.resize),
		page: addPagination({
			initialPageSize: 20,
			...opt.page
		}),
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase()),
			...opt.filter
		})
	};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createSelectColumn = (table: Table<any, ReturnType<typeof createTablePlugins>>) =>
	table.column({
		id: 'select',
		accessor: () => {},
		header: (_, { pluginStates }) => {
			return createRender(DataTableCheckbox, {
				checked: pluginStates.select.allPageRowsSelected
			});
		},
		cell: ({ row }, { pluginStates }) => {
			return createRender(DataTableCheckbox, {
				checked: pluginStates.select.getRowState(row).isSelected
			});
		},
		plugins: {
			sort: { disable: true },
			filter: { exclude: true },
			hide: {}
		}
	});

export interface RootProps extends Omit<Partial<HTMLTableElement>, 'caption'> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	model: TableViewModel<any, ReturnType<typeof createTablePlugins>>;
	headerSizes?: string[];
	caption?: string;
	description?: string;
	omitHeader?: boolean;
	unHidableCells?: string[];
	class?: ClassValue;
	actions?: TableAction<SvelteComponent, SvelteComponent>[];
}

export interface TableAction<Component extends SvelteComponent, Icon extends SvelteComponent>
	extends Omit<ComponentProps<DataTableAction>, 'disabled' | 'action'> {
	icon: Constructor<Icon>;
	iconProps?: ComponentProps<Icon>;
	component?: Constructor<Component>;
	componentProps?: (selectedDataIds: string[]) => ComponentProps<Component>;
	disabled?: (selectedDataIds: string[]) => boolean;
	action?: (selectedDataIds: string[]) => void | Promise<void>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data?: (selectedDataIds: string[]) => any;
}

/** Only used for proper type inference */
const createAction = <Component extends SvelteComponent, Icon extends SvelteComponent>(
	data: TableAction<Component, Icon>
): TableAction<Component, Icon> => data;

export {
	DataTable as default,
	DataTable as Root,
	DataTable,
	DataTableAction as Action,
	DataTableAction,
	DataTableCheckbox as Checkbox,
	DataTableCheckbox,
	createTablePlugins,
	createSelectColumn,
	createAction
};
