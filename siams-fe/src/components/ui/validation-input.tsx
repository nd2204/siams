import { FieldDescription, FieldLabel } from "./field";
import { Input } from "./input"

export type FormFieldData = {
  value: any,
  error: boolean,
  error_msg: string | null
}

export type FormData<TFields extends string> = Record<TFields, FormFieldData>;

export type FormAction<TFields> =
  | { type: 'SET_ERROR', field: TFields, error_msg: string }
  | { type: 'SET_ERROR_AND_DATA', field: TFields, error_msg: string, data: any }
  | { type: 'SET_ERROR_AND_CLEAR', field: TFields, error_msg: string }
  | { type: 'SET_DATA', field: TFields, data: any }

export function formReducer<TFields extends string>(state: FormData<TFields>, action: FormAction<TFields>) {
  const field = state[action.field];
  if (!field) return state;
  switch (action.type) {
    case "SET_ERROR_AND_DATA":
      return {
        ...state,
        [action.field]: { ...field, error: true, error_msg: action.error_msg, value: action.data },
      };
    case "SET_ERROR_AND_CLEAR":
      return {
        ...state,
        [action.field]: { ...field, error: true, error_msg: action.error_msg, value: '' },
      };
    case 'SET_DATA':
      return {
        ...state,
        [action.field]: { ...field, error: false, value: action.data },
      };
    case 'SET_ERROR':
      return {
        ...state,
        [action.field]: { ...field, error: true, error_msg: action.error_msg }
      };
    default:
      return state;
  }
}

export interface ValidationInputProps<TFields extends string> extends React.ComponentProps<typeof Input> {
  fieldLabel?: string,
  fieldName: TFields,
  fieldData: FormFieldData,
  dispatch: (action: FormAction<TFields>) => any,
}

export function ValidationInput<TFields extends string>({
  fieldLabel,
  fieldName,
  fieldData,
  dispatch,
  ...props
}: ValidationInputProps<TFields>) {
  return <>
    {fieldLabel && <FieldLabel htmlFor={props.id}>{fieldLabel}</FieldLabel>}
    <Input
      {...props}
      aria-invalid={fieldData.error}
      value={fieldData.value}
      onChange={(e) => dispatch({ type: 'SET_DATA', field: fieldName, data: e.target.value })}
    />
    {fieldData.error && fieldData.error_msg &&
      <FieldDescription className="text-accent-red">{fieldData.error_msg}</FieldDescription>
    }
  </>
}
