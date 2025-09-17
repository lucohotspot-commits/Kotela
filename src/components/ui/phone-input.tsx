
"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"
import {
  Country,
  getCountries,
  getCountryCallingCode,
} from "react-phone-number-input/input"
import "react-phone-number-input/style.css"
import PhoneInputWithCountry, {
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
import { ScrollArea } from "./scroll-area"

type PhoneInputComponentProps = React.ForwardRefExoticComponent<
  Props<PhoneInputProps> & React.RefAttributes<HTMLInputElement>
>

type CustomPhoneInputProps = Omit<
  React.ComponentPropsWithoutRef<PhoneInputComponentProps>,
  "onChange"
> & {
  onChange: (value: string) => void
  country?: Country
  onCountryChange?: (country: Country) => void
}

const PhoneInput = React.forwardRef<
  React.ElementRef<PhoneInputComponentProps>,
  CustomPhoneInputProps
>(({ className, onChange, country, onCountryChange, ...props }, ref) => {
  return (
    <PhoneInputWithCountry
      ref={ref}
      className={cn("flex", className)}
      flagComponent={FlagComponent}
      countrySelectComponent={(props) => (
        <CountrySelectComponent {...props} onCountryChange={onCountryChange} />
      )}
      inputComponent={InputComponent}
      international
      smartCaret={false}
      countryCallingCodeEditable={false}
      onChange={(value) => onChange(value || "")}
      country={country}
      onCountryChange={onCountryChange}
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
  onCountryChange?: (value: Country) => void
}

const CountrySelectComponent = ({
  disabled,
  value,
  onChange,
  onCountryChange,
}: CountrySelectComponentProps) => {
  const countryOptions = React.useMemo(() => {
    const countries = getCountries()
    const callingCodes = countries.map((country) => ({
      value: country,
      label: country, // We'll get the proper label from country-list
      callingCode: getCountryCallingCode(country),
    }))
    return callingCodes
  }, [])
  
  const handleSelect = React.useCallback(
    (country: Country) => {
      onChange(country)
      if (onCountryChange) {
        onCountryChange(country)
      }
    },
    [onChange, onCountryChange],
  )

  const countryNames = require('country-list').getNameList()

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
            <ScrollArea className="h-72">
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countryOptions.map((option) => (
                    <CommandItem
                      className="gap-2"
                      key={option.value}
                      onSelect={() => handleSelect(option.value)}
                    >
                      <FlagComponent
                        country={option.value}
                        countryName={countryNames[option.value] || option.label}
                      />
                      <span className="flex-1 text-sm">{countryNames[option.value] || option.label}</span>
                      <span className="text-sm text-foreground/50">
                        {`+${option.callingCode}`}
                      </span>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          option.value === value ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

const FlagComponent = ({ country }: { country: Country; countryName: string }) => {
  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20 items-center justify-center text-[10px] font-bold text-background">
      {country}
    </span>
  )
}
FlagComponent.displayName = "FlagComponent"

export { PhoneInput, isPossiblePhoneNumber }
export type { Country }
