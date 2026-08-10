import RemittanceForm from './RemittanceForm'
import { availableCurrencies } from '../data/mockAnchors'
import { action } from 'storybook/actions'

export default {
  title: 'Components/RemittanceForm',
  component: RemittanceForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    currencies: availableCurrencies(),
    onSubmit: action('onSubmit'),
  },
  argTypes: {
    currencies: { control: false },
    onSubmit: { control: false },
  },
}

export const Default = {}

export const MinimalPair = {
  name: 'Two currencies',
  args: {
    currencies: ['USD', 'USDC'],
  },
}
