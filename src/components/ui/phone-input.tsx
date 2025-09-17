
"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"
import {
  Country,
  parsePhoneNumber,
  PhoneNumber as PhoneNumberType,
} from "libphonenumber-js/core"
import "react-phone-number-input/style.css"
import PhoneInputWithCountry, {
  CountrySelect,
  isCountrySupported,
  isPossiblePhoneNumber,
  PhoneInputProps,
  Props,
} from "react-phone-number-input"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input, type InputProps } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type PhoneInputComponentProps = React.ForwardRefExoticComponent<
  Props<PhoneInputProps> & React.RefAttributes<HTMLInputElement>
>

const PhoneInput = React.forwardRef<
  React.ElementRef<PhoneInputComponentProps>,
  Omit<React.ComponentPropsWithoutRef<PhoneInputComponentProps>, "onChange"> & {
    onChange: (value: string) => void
  }
>(({ className, onChange, ...props }, ref) => {
  return (
    <PhoneInputWithCountry
      ref={ref}
      className={cn("flex", className)}
      flagComponent={FlagComponent}
      countrySelectComponent={CountrySelectComponent}
      inputComponent={InputComponent}
      /**
       * Format phone number as international format.
       * @example "+12133734253"
       * @see https://github.com/catamphetamine/react-phone-number-input#international
       */
      international
      /**
       * Make sure that the country code is always present.
       * @see https://github.com/catamphetamine/react-phone-number-input#smartcaret
       */
      smartCaret={false}
      /**
       * Always display the country code.
       * @see https://github.com/catamphetamine/react-phone-number-input#countryselectcomponent
       */
      countryCallingCodeEditable={false}
      /**
       * The `onChange` event is passed to the `InputComponent` and is used to update the `value` of the `PhoneInput` component.
       *
       * The `onChange` event is not passed to the `PhoneInput` component directly, because the `value` is managed by the `PhoneInput` component itself.
       * @see https://github.com/catamphetamine/react-phone-number-input#onchange
       */
      onChange={(value) => onChange(value || "")}
      {...props}
    />
  )
})
PhoneInput.displayName = "PhoneInput"

const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <Input
      className={cn("rounded-e-lg rounded-s-none", className)}
      {...props}
      ref={ref}
    />
  ),
)
InputComponent.displayName = "InputComponent"

type CountrySelectOption = { label: string; value: Country }

type CountrySelectComponentProps = {
  className?: string
  disabled?: boolean
  value: Country
  onChange: (value: Country) => void
  options: CountrySelectOption[]
}

const CountrySelectComponent = ({
  disabled,
  value,
  onChange,
  options,
}: CountrySelectComponentProps) => {
  const handleSelect = React.useCallback(
    (country: Country) => {
      onChange(country)
    },
    [onChange],
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn("flex gap-1 rounded-e-none rounded-s-lg px-3")}
          disabled={disabled}
        >
          <FlagComponent country={value} countryName={value} />
          <ChevronsUpDown
            className={cn(
              "-mr-2 h-4 w-4 opacity-50",
              disabled ? "hidden" : "opacity-100",
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search country..." />
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {options
                .filter((x) => x.value)
                .map((option) => (
                  <CommandItem
                    className="gap-2"
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <FlagComponent
                      country={option.value}
                      countryName={option.label}
                    />
                    <span className="flex-1 text-sm">{option.label}</span>
                    {option.value && (
                      <span className="text-sm text-foreground/50">
                        {`+${
                          parsePhoneNumber(
                            `+${option.value}1`,
                            option.value,
                          )?.countryCallingCode
                        }`}
                      </span>
                    )}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        option.value === value ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

const FlagComponent = ({ country, countryName }: { country: Country; countryName: string }) => {
  const Flag = React.useMemo(() => {
    if (!country || !isCountrySupported(country)) return null
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { default: flag } = require(`react-phone-number-input/flags/${country}.svg`)
    return flag
  }, [country])

  if (!Flag) return null

  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20">
      <Flag title={countryName} />
    </span>
  )
}
FlagComponent.displayName = "FlagComponent"

export { PhoneInput, isPossiblePhoneNumber }
export type { Country, PhoneNumberType }
