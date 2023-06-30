import { yupResolver } from "@hookform/resolvers/yup";
import { FieldValues, useForm } from "react-hook-form";
import { AnyObject, ObjectSchema } from "yup";

export function useXNGFormWithValidation<T extends FieldValues>(props: {
  validationSchema: ObjectSchema<any, AnyObject, any, "">;
}) {
  return useForm<T>({ resolver: yupResolver(props.validationSchema), mode: "onChange" });
}

export function useXNGForm<T extends FieldValues>() {
  return useForm<T>();
}
