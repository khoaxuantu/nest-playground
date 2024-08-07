import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputProps,
  NumberInputStepper,
} from "@chakra-ui/react";
import { FieldError, FieldValues, Path, UseFormRegister } from "react-hook-form";

export interface FormControlNumberProps<T extends FieldValues> {
  field: Path<T>;
  label: string;
  required?: boolean;
  register: UseFormRegister<T>;
  error?: FieldError;
  numberInputProps?: NumberInputProps;
}

export function FormControlNumber<T extends FieldValues>(props: FormControlNumberProps<T>) {
  return (
    <FormControl mb={3} isInvalid={!!props.error} isRequired={props.required}>
      <FormLabel>{props.label}</FormLabel>
      <NumberInput {...props.numberInputProps}>
        <NumberInputField {...props.register(props.field)} />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      {props.error && <FormErrorMessage>{props.error.message}</FormErrorMessage>}
    </FormControl>
  );
}
