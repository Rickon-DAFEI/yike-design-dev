import { Size } from '../../../utils/constant';
import { InjectionKey } from 'vue'


export type RadioBaseProps = {
  size?: Size
  type?: 'radio' | 'button'
}



export type RadioGroupProps = {
  modelValue?: boolean | string | number
  size?: Size
  type?: 'radio' | 'button'
  /**
 * @desc native `name` attribute
 */
  name?: string
  /**
 * @desc whether to trigger form validation
 */
  validateEvent?: boolean,
}

export interface RadioProps extends RadioGroupProps {
  label: string | number | boolean
  disabled: boolean
  defaultChecked?: boolean
}


export interface RadioGroupContext extends RadioGroupProps {
  changeEvent: (val: RadioGroupProps['modelValue']) => void
}

export const radioGroupKey: InjectionKey<RadioGroupContext> =
  Symbol('radioGroupKey')