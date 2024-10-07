export type FilterOperator =
  | 'ilike'
  | 'notIlike'
  | 'startsWith'
  | 'endsWith'
  | 'eq'
  | 'notEq'
  | 'isNull'
  | 'isNotNull'
  | 'gt'
  | 'lt';

export function parseFilterInput(
  input: string,
): { operator: FilterOperator; value?: string } | undefined {
  const match = input.match(
    /^(.*)~(ilike|notIlike|startsWith|endsWith|eq|notEq|isNull|isNotNull|gt|lt)$/,
  );
  if (!match) return undefined;

  const [, value, operator] = match;
  return {
    operator: operator as FilterOperator,
    value: value ?? undefined, // Handle cases where value might be empty
  };
}

export function parseSelectableFilterInput(
  input: string,
): { filterOperator: string; filterValue: string } | undefined {
  const match = input.match(/^(.*)~(eq|notEq|isNull|isNotNull)$/);
  if (!match) return undefined;

  const [, filterValue, filterOperator] = match;

  return {
    filterOperator: filterOperator ? filterOperator.trim() : 'eq',
    filterValue: filterValue!.trim(),
  };
}

export function buildFilter({
  column,
  operator,
  value,
}: {
  column: string;
  operator: FilterOperator;
  value?: string | number; // Value can be a string or a number
}): any | undefined {
  if (value === undefined && operator !== 'isNull' && operator !== 'isNotNull') return;

  switch (operator) {
    case 'ilike':
      return { [column]: { $regex: value, $options: 'i' } };
    case 'notIlike':
      return { [column]: { $not: { $regex: value, $options: 'i' } } };
    case 'startsWith':
      return { [column]: { $regex: `^${value}`, $options: 'i' } };
    case 'endsWith':
      return { [column]: { $regex: `${value}$`, $options: 'i' } };
    case 'eq':
      return { [column]: { $eq: value } };
    case 'notEq':
      return { [column]: { $ne: value } };
    case 'isNull':
      return { [column]: null };
    case 'isNotNull':
      return { [column]: { $ne: null } };
    case 'gt':
      return { [column]: { $gt: Number(value) } };
    case 'lt':
      return { [column]: { $lt: Number(value) } };
    default:
      return { [column]: { $regex: value, $options: 'i' } };
  }
}

export function buildSelectableFilter(filter: {
  column: string;
  filterOperator: string;
  filterValue: string;
  isInt?: boolean;
}): any[] | undefined {
  const { column, filterOperator, filterValue, isInt } = filter;
  const values = filterValue
    .split('.')
    .filter(Boolean)
    .map((v) => (isInt ? Number(v) : v));

  switch (filterOperator) {
    case 'eq':
      return [{ [column]: { $in: values } }];
    case 'notEq':
      return [{ [column]: { $nin: values } }];
    case 'isNull':
      return [{ [column]: null }];
    case 'isNotNull':
      return [{ [column]: { $ne: null } }];
    default:
      return [{ [column]: { $in: values } }];
  }
}

export function parseSort(sort: string | undefined): any {
  if (!sort) return { created_at: -1 }; // Default sort by descending creation date

  const parts = sort.split('.').filter(Boolean);
  if (parts.length !== 2) return { created_at: -1 };

  const [field, direction]: any = parts;
  const order = direction === 'asc' ? 1 : -1;

  return { [field]: order };
}
